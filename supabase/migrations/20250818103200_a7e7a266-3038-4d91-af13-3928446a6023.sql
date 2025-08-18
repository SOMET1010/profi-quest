-- Insert admin role for the current user
-- This will give admin access to the authenticated user
-- Replace with actual user ID or use a function to get current user

-- First, let's create a function to assign admin role to current user
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert admin role for the current authenticated user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_admin_role() TO authenticated;

-- Also insert a default admin role for testing
-- You can call this function when logged in to get admin access
SELECT public.assign_admin_role();