-- =====================================================
-- Phase 3: Database Cleanup - Role System Migration
-- =====================================================
-- Drop obsolete SQL functions that are now replaced by unified role system
-- Keep compatibility wrappers with warnings

-- 1. Drop obsolete trigger function for ansut_profiles
DROP FUNCTION IF EXISTS public.handle_new_ansut_user() CASCADE;

-- 2. Drop obsolete role getter (replaced by unified system)
DROP FUNCTION IF EXISTS public.get_ansut_user_role() CASCADE;

-- 3. Archive ansut_profiles table (make it truly read-only)
COMMENT ON TABLE public.ansut_profiles IS 
  'DEPRECATED (2025-01-17): Archive table. Use user_roles for current roles. This table is kept for historical data only.';

COMMENT ON COLUMN public.profiles.ansut_profile_id IS 
  'DEPRECATED (2025-01-17): Use user_roles table instead. This column is kept for legacy data only.';

-- 4. Create monitoring view for role system health
CREATE OR REPLACE VIEW public.role_system_audit AS
SELECT 
  u.id,
  u.email,
  ap.role AS ansut_legacy_role,
  ur.role AS current_app_role,
  CASE 
    WHEN ur.role IS NULL THEN 'Missing user_role'
    WHEN ap.role IS NOT NULL AND ap.role != ur.role::text THEN 'Role mismatch'
    ELSE 'OK'
  END AS status,
  u.created_at AS user_created_at,
  ur.updated_at AS role_updated_at
FROM auth.users u
LEFT JOIN public.ansut_profiles ap ON ap.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.deleted_at IS NULL
ORDER BY 
  CASE 
    WHEN ur.role IS NULL THEN 1
    WHEN ap.role IS NOT NULL AND ap.role != ur.role::text THEN 2
    ELSE 3
  END,
  u.created_at DESC;

-- Grant access to authenticated users (but they can only see via RLS)
GRANT SELECT ON public.role_system_audit TO authenticated;

-- 5. Add helpful comments to compatibility wrappers
COMMENT ON FUNCTION public.has_ansut_role(text) IS 
  'DEPRECATED: Compatibility wrapper. Use has_permission() or check user_roles directly.';

COMMENT ON FUNCTION public.has_ansut_permission(text[]) IS 
  'DEPRECATED: Compatibility wrapper. Use has_permission() instead.';

-- 6. Keep map_legacy_role_to_app_role for potential future migrations
COMMENT ON FUNCTION public.map_legacy_role_to_app_role(text, text, app_role) IS 
  'Migration utility: Maps legacy roles to app_role enum. Used for data migrations only.';