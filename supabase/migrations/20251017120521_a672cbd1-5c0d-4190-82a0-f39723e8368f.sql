-- ==========================================
-- PHASE 3: CORRECTIONS QUALITÉ DU CODE
-- Ajout des colonnes manquantes à la table profiles
-- pour supporter la fonctionnalité de candidature d'expert
-- ==========================================

-- Ajouter les colonnes manquantes à la table profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS technical_skills TEXT,
  ADD COLUMN IF NOT EXISTS behavioral_skills TEXT,
  ADD COLUMN IF NOT EXISTS motivation_letter_url TEXT,
  ADD COLUMN IF NOT EXISTS diplomas_url TEXT,
  ADD COLUMN IF NOT EXISTS certificates_url TEXT,
  ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS application_submitted_at TIMESTAMPTZ;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_application_status ON public.profiles(application_status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Commentaires pour documentation
COMMENT ON COLUMN public.profiles.first_name IS 'First name of the expert candidate';
COMMENT ON COLUMN public.profiles.last_name IS 'Last name of the expert candidate';
COMMENT ON COLUMN public.profiles.location IS 'Geographic location of the expert';
COMMENT ON COLUMN public.profiles.experience_years IS 'Years of professional experience';
COMMENT ON COLUMN public.profiles.hourly_rate IS 'Hourly rate in euros';
COMMENT ON COLUMN public.profiles.technical_skills IS 'Technical skills description';
COMMENT ON COLUMN public.profiles.behavioral_skills IS 'Behavioral/soft skills description';
COMMENT ON COLUMN public.profiles.motivation_letter_url IS 'URL to uploaded motivation letter';
COMMENT ON COLUMN public.profiles.diplomas_url IS 'URL to uploaded diplomas';
COMMENT ON COLUMN public.profiles.certificates_url IS 'URL to uploaded certificates';
COMMENT ON COLUMN public.profiles.application_status IS 'Status of expert application: draft, submitted, approved, rejected';
COMMENT ON COLUMN public.profiles.application_submitted_at IS 'Timestamp when application was submitted';