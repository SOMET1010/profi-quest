-- Phase 1.3: Fix RLS policy for public_applications

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their own applications" ON public_applications;

-- Create improved policy that handles both user_id and email matching
CREATE POLICY "Users can view their own applications" 
ON public_applications 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR has_permission(auth.uid(), 'view_all_applications')
  OR (user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Ensure future applications have user_id (make it NOT NULL)
-- First, update any NULL user_id with a proper fallback
UPDATE public_applications 
SET user_id = (SELECT id FROM auth.users WHERE email = public_applications.email LIMIT 1)
WHERE user_id IS NULL 
  AND email IS NOT NULL 
  AND EXISTS (SELECT 1 FROM auth.users WHERE email = public_applications.email);

-- Now make the column NOT NULL for future inserts
ALTER TABLE public_applications 
ALTER COLUMN user_id SET NOT NULL;