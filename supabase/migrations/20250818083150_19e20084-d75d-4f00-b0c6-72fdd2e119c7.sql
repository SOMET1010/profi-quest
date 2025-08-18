-- Phase 1: Authentication and Enhanced Profiles System

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('motivation-letters', 'motivation-letters', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('diplomas', 'diplomas', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- Add new required fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS technical_skills TEXT,
ADD COLUMN IF NOT EXISTS behavioral_skills TEXT,
ADD COLUMN IF NOT EXISTS motivation_letter_url TEXT,
ADD COLUMN IF NOT EXISTS diplomas_url TEXT,
ADD COLUMN IF NOT EXISTS certificates_url TEXT,
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS application_submitted_at TIMESTAMP WITH TIME ZONE;

-- Make experience_years truly optional (allow NULL)
ALTER TABLE public.profiles 
ALTER COLUMN experience_years DROP NOT NULL,
ALTER COLUMN experience_years DROP DEFAULT,
ALTER COLUMN experience_years SET DEFAULT NULL;

-- Create storage policies for motivation letters
CREATE POLICY "Users can upload their own motivation letters" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'motivation-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own motivation letters" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'motivation-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own motivation letters" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'motivation-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own motivation letters" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'motivation-letters' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for diplomas
CREATE POLICY "Users can upload their own diplomas" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'diplomas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own diplomas" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'diplomas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own diplomas" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'diplomas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own diplomas" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'diplomas' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for certificates
CREATE POLICY "Users can upload their own certificates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own certificates" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own certificates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own certificates" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update RLS policies to be user-specific
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admin policy to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true); -- Will be refined later with admin role system