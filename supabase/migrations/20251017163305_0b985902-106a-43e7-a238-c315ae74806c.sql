-- Phase 0: Correction erreurs critiques SQL

-- 0.1 Créer fonction SECURITY DEFINER pour éviter récursion RLS
CREATE OR REPLACE FUNCTION public.check_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('DG'::app_role, 'SI'::app_role)
  )
$$;

-- 0.2 Supprimer policy récursive sur user_roles
DROP POLICY IF EXISTS "DG and SI can manage all roles" ON user_roles;

-- 0.3 Recréer policy avec fonction safe
CREATE POLICY "DG and SI can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (public.check_admin_role(auth.uid()));

-- 0.4 Corriger ambiguïté permission_code dans get_user_permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id uuid)
RETURNS TABLE(permission_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH user_role AS (
    SELECT ur.role FROM user_roles ur WHERE ur.user_id = _user_id LIMIT 1
  ),
  default_perms AS (
    SELECT rdp.permission_code
    FROM role_default_permissions rdp
    JOIN user_role ur ON rdp.role_code = ur.role
  ),
  user_overrides AS (
    SELECT up.permission_code, up.granted
    FROM user_permissions up
    WHERE up.user_id = _user_id
  )
  SELECT DISTINCT dp.permission_code
  FROM default_perms dp
  WHERE NOT EXISTS (
    SELECT 1 FROM user_overrides uo 
    WHERE uo.permission_code = dp.permission_code 
      AND uo.granted = false
  )
  UNION
  SELECT uo.permission_code
  FROM user_overrides uo
  WHERE uo.granted = true;
END;
$function$;