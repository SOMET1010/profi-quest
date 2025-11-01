-- =====================================================
-- Security Fix: role_system_audit view (Corrected)
-- =====================================================
-- Recreate the view with security_invoker = true to avoid security definer issues
-- Security is enforced through underlying table RLS policies

DROP VIEW IF EXISTS public.role_system_audit;

-- Create a secure view that doesn't expose auth.users directly
-- Only shows essential info and respects RLS through underlying tables
CREATE OR REPLACE VIEW public.role_system_audit 
WITH (security_invoker = true)
AS
SELECT 
  ur.user_id AS id,
  p.email,
  ap.role AS ansut_legacy_role,
  ur.role AS current_app_role,
  CASE 
    WHEN ur.role IS NULL THEN 'Missing user_role'
    WHEN ap.role IS NOT NULL AND ap.role != ur.role::text THEN 'Role mismatch'
    ELSE 'OK'
  END AS status,
  p.created_at AS user_created_at,
  ur.updated_at AS role_updated_at
FROM public.user_roles ur
LEFT JOIN public.profiles p ON p.id = ur.user_id
LEFT JOIN public.ansut_profiles ap ON ap.id = ur.user_id
ORDER BY 
  CASE 
    WHEN ur.role IS NULL THEN 1
    WHEN ap.role IS NOT NULL AND ap.role != ur.role::text THEN 2
    ELSE 3
  END,
  p.created_at DESC;

-- Grant select to authenticated users (RLS on underlying tables will restrict access)
GRANT SELECT ON public.role_system_audit TO authenticated;