-- Create public_applications table for anonymous submissions
CREATE TABLE IF NOT EXISTS public.public_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  motivation_letter_url TEXT,
  technical_skills TEXT,
  behavioral_skills TEXT,
  experience_years INTEGER,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'converted', 'rejected')),
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  converted_to_profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit an application (INSERT)
CREATE POLICY "Anyone can submit public application"
  ON public.public_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: RH can view all public applications
CREATE POLICY "RH can view public applications"
  ON public.public_applications
  FOR SELECT
  USING (has_permission(auth.uid(), 'view_all_applications'));

-- Policy: RH can update public applications
CREATE POLICY "RH can update public applications"
  ON public.public_applications
  FOR UPDATE
  USING (has_permission(auth.uid(), 'review_applications'));

-- Trigger for updated_at
CREATE TRIGGER update_public_applications_updated_at
  BEFORE UPDATE ON public.public_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_public_applications_status ON public.public_applications(status);
CREATE INDEX idx_public_applications_email ON public.public_applications(email);
CREATE INDEX idx_public_applications_created_at ON public.public_applications(created_at DESC);