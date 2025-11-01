-- ============================================
-- ÉTAPE 2/2 : Configuration du rôle SUPERADMIN
-- ============================================

-- Créer l'entrée dans ansut_roles
INSERT INTO ansut_roles (code, label, description, hierarchy_level, is_system_role)
VALUES (
  'SUPERADMIN'::app_role,
  'Super Administrateur DTDI',
  'Accès technique complet pour la Direction de la Transformation Digitale et de l''Innovation',
  15,
  true
)
ON CONFLICT (code) DO UPDATE 
SET hierarchy_level = 15, 
    description = EXCLUDED.description,
    updated_at = now();

-- Créer la fonction helper is_superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'SUPERADMIN'::app_role
  )
$$;

-- Promouvoir les deux comptes DTDI à SUPERADMIN
UPDATE user_roles 
SET role = 'SUPERADMIN'::app_role, 
    updated_at = now()
WHERE user_id IN (
  '04dafae5-6b1c-4184-b2fb-6fbf051586f7',  -- dtdi@ansut.ci
  '8e750c46-fdf1-4ea1-afb8-fc997f033704'   -- patrick.somet@ansut.ci
);

-- Mettre à jour les RLS policies critiques

-- audit_logs : SUPERADMIN peut tout voir
DROP POLICY IF EXISTS "Only DG can view audit logs" ON audit_logs;
CREATE POLICY "SUPERADMIN and DG can view audit logs"
ON audit_logs FOR SELECT
TO public
USING (
  is_superadmin(auth.uid()) 
  OR has_ansut_role('DG')
);

-- user_roles : SUPERADMIN peut gérer tous les rôles
DROP POLICY IF EXISTS "DG and SI can manage all roles" ON user_roles;
CREATE POLICY "SUPERADMIN and admins can manage roles"
ON user_roles FOR ALL
TO public
USING (
  is_superadmin(auth.uid())
  OR check_admin_role(auth.uid())
);

-- ansut_profiles : SUPERADMIN peut tout voir/modifier
CREATE POLICY "SUPERADMIN can manage all profiles"
ON ansut_profiles FOR ALL
TO public
USING (is_superadmin(auth.uid()));

-- app_settings : SUPERADMIN peut gérer les settings
CREATE POLICY "SUPERADMIN can manage settings"
ON app_settings FOR ALL
TO public
USING (is_superadmin(auth.uid()));

-- user_permissions : SUPERADMIN peut gérer les permissions
CREATE POLICY "SUPERADMIN can manage all permissions"
ON user_permissions FOR ALL
TO public
USING (is_superadmin(auth.uid()));

-- Mettre à jour check_admin_role pour inclure SUPERADMIN
CREATE OR REPLACE FUNCTION public.check_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('SUPERADMIN'::app_role, 'DG'::app_role, 'SI'::app_role)
  )
$$;