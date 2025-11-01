
-- ============================================================================
-- CORRECTIF SÉCURITÉ v2: Résoudre les warnings du linter (sans policy sur vue)
-- ============================================================================

-- 1. Activer RLS sur role_migration_audit (si pas déjà fait)
DO $$ 
BEGIN
  ALTER TABLE public.role_migration_audit ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Créer la policy admin uniquement (si pas déjà faite)
DO $$
BEGIN
  CREATE POLICY "role_migration_audit_admin_only"
  ON public.role_migration_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('SUPERADMIN'::app_role, 'DG'::app_role, 'SI'::app_role)
    )
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Recréer la vue unified_user_roles sans exposer auth.users
DROP VIEW IF EXISTS public.unified_user_roles CASCADE;

CREATE VIEW public.unified_user_roles
WITH (security_invoker = true)
AS
SELECT 
  ur.user_id as id,
  ur.role as current_role,
  ap.role as legacy_ansut_role,
  p.role as legacy_profile_role,
  CASE 
    WHEN ur.role IS NOT NULL THEN 'user_roles'
    WHEN ap.role IS NOT NULL THEN 'ansut_profiles'
    WHEN p.role IS NOT NULL THEN 'profiles'
    ELSE 'none'
  END as role_source,
  ur.created_at,
  ur.updated_at
FROM user_roles ur
LEFT JOIN ansut_profiles ap ON ap.id = ur.user_id
LEFT JOIN profiles p ON p.id = ur.user_id;

COMMENT ON VIEW public.unified_user_roles IS 'Unified view of role systems - uses security_invoker to respect RLS of querying user';

-- Permissions: les utilisateurs voient seulement via RLS des tables sous-jacentes
GRANT SELECT ON public.unified_user_roles TO authenticated;
