-- Fix RLS policies for profiles table to allow users to manage their own profiles

-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create comprehensive RLS policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('DG'::app_role, 'SI'::app_role, 'DRH'::app_role)
    )
  );

-- Drop existing storage policies before recreating them
DROP POLICY IF EXISTS "Users can upload their own motivation letters" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own motivation letters" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own diplomas" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own diplomas" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Recreate storage bucket policies
CREATE POLICY "Users can upload their own motivation letters"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'motivation-letters' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own motivation letters"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'motivation-letters' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own diplomas"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'diplomas' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own diplomas"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'diplomas' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own certificates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own certificates"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'certificates' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN ('motivation-letters', 'diplomas', 'certificates')
    AND EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('DG'::app_role, 'SI'::app_role, 'DRH'::app_role, 'RDRH'::app_role)
    )
  );