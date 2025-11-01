
-- ============================================================================
-- PHASE 2: MIGRATION COMPLÈTE DU SYSTÈME DE RÔLES
-- Objectif: Unifier les 3 systèmes (ansut_profiles, profiles.role, user_roles)
-- vers un seul système: user_roles
-- ============================================================================

-- 2.1: Créer la table d'audit de migration
CREATE TABLE IF NOT EXISTS public.role_migration_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  old_ansut_role text,
  old_profile_role text,
  new_app_role app_role,
  migration_strategy text,
  migrated_at timestamptz DEFAULT NOW(),
  migration_notes text
);

COMMENT ON TABLE public.role_migration_audit IS 'Audit trail for role system migration';

-- 2.2: Fonction pour mapper les anciens rôles vers app_role
CREATE OR REPLACE FUNCTION public.map_legacy_role_to_app_role(
  ansut_role text,
  profile_role text,
  existing_app_role app_role
)
RETURNS app_role
LANGUAGE plpgsql
AS $$
BEGIN
  -- Priorité 1: Si app_role existe et est admin, le conserver
  IF existing_app_role IN ('SUPERADMIN', 'DG', 'SI', 'DRH', 'RDRH') THEN
    RETURN existing_app_role;
  END IF;
  
  -- Priorité 2: Mapper depuis ansut_role
  IF ansut_role IS NOT NULL THEN
    RETURN CASE ansut_role
      WHEN 'DG' THEN 'DG'::app_role
      WHEN 'FINANCE' THEN 'DRH'::app_role
      WHEN 'AGENT' THEN 'RH_ASSISTANT'::app_role
      WHEN 'READONLY' THEN 'CONSULTANT'::app_role
      ELSE 'POSTULANT'::app_role
    END;
  END IF;
  
  -- Priorité 3: Conserver app_role existant ou défaut
  RETURN COALESCE(existing_app_role, 'POSTULANT'::app_role);
END;
$$;

-- 2.3: Migrer les rôles avec résolution des conflits
INSERT INTO public.role_migration_audit (
  user_id,
  old_ansut_role,
  old_profile_role,
  new_app_role,
  migration_strategy,
  migration_notes
)
SELECT 
  COALESCE(ap.id, p.id, ur.user_id) as user_id,
  ap.role as old_ansut_role,
  p.role as old_profile_role,
  map_legacy_role_to_app_role(ap.role, p.role, ur.role) as new_app_role,
  CASE 
    WHEN ur.role IN ('SUPERADMIN', 'DG', 'SI', 'DRH') THEN 'keep_existing_admin'
    WHEN ap.role IS NOT NULL THEN 'migrate_from_ansut'
    ELSE 'keep_existing'
  END as migration_strategy,
  CASE
    WHEN ap.role != ur.role::text THEN 'Conflict resolved: ' || ap.role || ' -> ' || ur.role::text
    ELSE 'No conflict'
  END as migration_notes
FROM ansut_profiles ap
FULL OUTER JOIN profiles p ON p.id = ap.id
FULL OUTER JOIN user_roles ur ON ur.user_id = COALESCE(ap.id, p.id);

-- 2.4: Mettre à jour user_roles avec les nouveaux rôles mappés
UPDATE user_roles ur
SET 
  role = rma.new_app_role,
  updated_at = NOW()
FROM role_migration_audit rma
WHERE ur.user_id = rma.user_id
  AND ur.role != rma.new_app_role
  AND rma.migration_strategy IN ('migrate_from_ansut');

-- 2.5: Déprécier la colonne profiles.role
COMMENT ON COLUMN profiles.role IS 'DEPRECATED: Use user_roles table instead. This column is kept for rollback purposes only.';

-- 2.6: Créer une fonction wrapper pour has_ansut_role (compatibilité)
CREATE OR REPLACE FUNCTION public.has_ansut_role(required_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Avertissement dans les logs
  RAISE WARNING 'has_ansut_role() is DEPRECATED. Use has_permission() or check user_roles directly.';
  
  -- Rediriger vers user_roles
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
      AND (
        role::text = required_role
        OR (required_role = 'FINANCE' AND role = 'DRH')
        OR (required_role = 'AGENT' AND role = 'RH_ASSISTANT')
        OR (required_role = 'READONLY' AND role IN ('CONSULTANT', 'POSTULANT'))
      )
  );
END;
$$;

-- 2.7: Créer une fonction wrapper pour has_ansut_permission
CREATE OR REPLACE FUNCTION public.has_ansut_permission(required_roles text[])
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  RAISE WARNING 'has_ansut_permission() is DEPRECATED. Use has_permission() instead.';
  
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Mapper les anciens rôles vers les nouveaux
  RETURN user_role::text = ANY(required_roles)
    OR (user_role = 'DRH' AND 'FINANCE' = ANY(required_roles))
    OR (user_role = 'RH_ASSISTANT' AND 'AGENT' = ANY(required_roles))
    OR (user_role IN ('CONSULTANT', 'POSTULANT') AND 'READONLY' = ANY(required_roles))
    OR (user_role = 'DG' AND array_length(required_roles, 1) > 0);
END;
$$;

-- 2.8: Mettre à jour la fonction get_ansut_user_role
CREATE OR REPLACE FUNCTION public.get_ansut_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2.9: Créer une vue pour faciliter la transition
CREATE OR REPLACE VIEW public.unified_user_roles AS
SELECT 
  u.id,
  u.email,
  ur.role as current_role,
  ap.role as legacy_ansut_role,
  p.role as legacy_profile_role,
  CASE 
    WHEN ur.role IS NOT NULL THEN 'user_roles'
    WHEN ap.role IS NOT NULL THEN 'ansut_profiles'
    WHEN p.role IS NOT NULL THEN 'profiles'
    ELSE 'none'
  END as role_source
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN ansut_profiles ap ON ap.id = u.id
LEFT JOIN profiles p ON p.id = u.id;

COMMENT ON VIEW public.unified_user_roles IS 'Unified view of all role systems for monitoring during migration';

-- 2.10: Nettoyer les RLS policies obsolètes sur ansut_profiles
DROP POLICY IF EXISTS "ansut_profiles_select_dg_all" ON ansut_profiles;
DROP POLICY IF EXISTS "ansut_profiles_insert_dg_only" ON ansut_profiles;
DROP POLICY IF EXISTS "ansut_profiles_update_own" ON ansut_profiles;

-- Créer une policy read-only simple pour historique
CREATE POLICY "ansut_profiles_readonly_for_admins"
ON ansut_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
      AND role IN ('SUPERADMIN'::app_role, 'DG'::app_role, 'SI'::app_role)
  )
);

-- 2.11: Créer une fonction de santé du système de rôles
CREATE OR REPLACE FUNCTION public.check_role_system_health()
RETURNS TABLE (
  metric text,
  count bigint,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'Total users' as metric, COUNT(*) as count, 'info' as status
  FROM auth.users
  UNION ALL
  SELECT 'Users with user_roles', COUNT(*), 
    CASE WHEN COUNT(*) > 0 THEN 'ok' ELSE 'warning' END
  FROM user_roles
  UNION ALL
  SELECT 'Users without role', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN 'ok' ELSE 'error' END
  FROM auth.users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  WHERE ur.user_id IS NULL
  UNION ALL
  SELECT 'Legacy ansut_profiles', COUNT(*), 'info'
  FROM ansut_profiles
  UNION ALL
  SELECT 'Role conflicts', COUNT(*),
    CASE WHEN COUNT(*) = 0 THEN 'ok' ELSE 'warning' END
  FROM role_migration_audit
  WHERE migration_notes LIKE 'Conflict%';
$$;

-- 2.12: Permissions sur les nouvelles tables
GRANT SELECT ON public.role_migration_audit TO authenticated;
GRANT SELECT ON public.unified_user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_role_system_health() TO authenticated;
