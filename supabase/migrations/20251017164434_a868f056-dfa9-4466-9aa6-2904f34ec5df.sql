-- Phase 1: Fondations ATS - Schéma complet avec IA

-- 1.1 Activer extension pgvector pour embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1.2 Créer table jobs (Offres d'emploi)
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  mission text NOT NULL,
  requirements_text text NOT NULL,
  location text,
  contract_type text CHECK (contract_type IN ('CDI', 'CDD', 'Freelance', 'Stage', 'Alternance')),
  seniority_min integer DEFAULT 0,
  seniority_max integer,
  tags text[] DEFAULT '{}',
  hourly_rate_min numeric,
  hourly_rate_max numeric,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER set_updated_at_jobs
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_tags ON public.jobs USING gin(tags);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs" 
ON public.jobs
FOR SELECT 
USING (status = 'open');

CREATE POLICY "RH can manage jobs" 
ON public.jobs
FOR ALL 
USING (has_permission(auth.uid(), 'manage_jobs'));

-- 1.3 Créer table applications (Candidatures)
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid NOT NULL,
  cover_letter_text text,
  cv_file_path text,
  status text DEFAULT 'received' CHECK (status IN ('received', 'screening', 'shortlist', 'interview', 'offer', 'rejected')),
  score_overall numeric DEFAULT 0 CHECK (score_overall >= 0 AND score_overall <= 100),
  screening_json jsonb DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

CREATE TRIGGER set_updated_at_applications
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_score ON public.applications(score_overall DESC);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH can view all applications" 
ON public.applications
FOR SELECT 
USING (has_permission(auth.uid(), 'view_all_applications'));

CREATE POLICY "Candidates can view own applications" 
ON public.applications
FOR SELECT 
USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can create applications" 
ON public.applications
FOR INSERT 
WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "RH can update applications" 
ON public.applications
FOR UPDATE 
USING (has_permission(auth.uid(), 'review_applications'));

-- 1.4 Créer table skills (Référentiel compétences)
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text CHECK (category IN ('technical', 'behavioral', 'language', 'certification')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_skills_name ON public.skills(name);
CREATE INDEX idx_skills_category ON public.skills(category);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "RH can manage skills" 
ON public.skills
FOR ALL 
USING (has_permission(auth.uid(), 'manage_jobs'));

-- 1.5 Créer table application_skills (Compétences par candidature)
CREATE TABLE public.application_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  level_inferred text CHECK (level_inferred IN ('beginner', 'intermediate', 'advanced', 'expert')),
  evidence_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(application_id, skill_id)
);

CREATE INDEX idx_application_skills_application ON public.application_skills(application_id);
CREATE INDEX idx_application_skills_skill ON public.application_skills(skill_id);

ALTER TABLE public.application_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH can view application skills" 
ON public.application_skills
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE id = application_id 
      AND has_permission(auth.uid(), 'view_all_applications')
  )
);

CREATE POLICY "Candidates can view own application skills" 
ON public.application_skills
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE id = application_id 
      AND candidate_id = auth.uid()
  )
);

CREATE POLICY "System can insert application skills" 
ON public.application_skills
FOR INSERT 
WITH CHECK (true);

-- 1.6 Créer table events (Timeline candidature)
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('status_change', 'comment', 'interview_scheduled', 'email_sent', 'document_uploaded')),
  payload_json jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_events_application ON public.events(application_id);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH can view events" 
ON public.events
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE id = application_id 
      AND has_permission(auth.uid(), 'view_all_applications')
  )
);

CREATE POLICY "Candidates can view own events" 
ON public.events
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE id = application_id 
      AND candidate_id = auth.uid()
  )
);

CREATE POLICY "RH can create events" 
ON public.events
FOR INSERT 
WITH CHECK (has_permission(auth.uid(), 'review_applications'));

-- 1.7 Créer table vectors (Embeddings pour matching IA)
CREATE TABLE public.vectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL CHECK (owner_type IN ('job', 'application')),
  owner_id uuid NOT NULL,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  UNIQUE(owner_type, owner_id)
);

CREATE INDEX idx_vectors_embedding ON public.vectors 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_vectors_owner ON public.vectors(owner_type, owner_id);

ALTER TABLE public.vectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System manages vectors" 
ON public.vectors 
FOR ALL 
USING (false);

-- 1.8 Modifier table profiles (RGPD + liens pro)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS github text,
  ADD COLUMN IF NOT EXISTS consent_gdpr boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_gdpr_at timestamptz;

CREATE INDEX idx_profiles_consent ON public.profiles(consent_gdpr) WHERE consent_gdpr = true;

-- 1.9 Ajouter 4 nouvelles permissions ATS
INSERT INTO public.permissions (code, label, description, category, required_hierarchy_level)
VALUES
  ('manage_jobs', 'Gérer les offres', 'Créer, modifier, supprimer des offres d''emploi', 'jobs', 5),
  ('publish_jobs', 'Publier les offres', 'Rendre publiques les offres d''emploi', 'jobs', 7),
  ('view_ai_scores', 'Voir scores IA', 'Accéder aux scores et analyses IA des candidatures', 'ai', 5),
  ('configure_ai', 'Configurer IA', 'Ajuster pondérations et seuils du pré-tri IA', 'ai', 8)
ON CONFLICT (code) DO NOTHING;

-- 1.10 Attribuer permissions par défaut aux rôles RH
INSERT INTO public.role_default_permissions (role_code, permission_code)
VALUES
  ('DRH', 'manage_jobs'),
  ('DRH', 'publish_jobs'),
  ('DRH', 'view_ai_scores'),
  ('DRH', 'configure_ai'),
  ('RDRH', 'manage_jobs'),
  ('RDRH', 'view_ai_scores'),
  ('RH_ASSISTANT', 'manage_jobs'),
  ('RH_ASSISTANT', 'view_ai_scores')
ON CONFLICT (role_code, permission_code) DO NOTHING;