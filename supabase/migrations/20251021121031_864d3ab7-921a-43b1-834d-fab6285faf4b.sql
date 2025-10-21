-- Create enum for field types
CREATE TYPE field_type AS ENUM (
  'text',
  'number',
  'email',
  'tel',
  'textarea',
  'select',
  'file',
  'url',
  'date'
);

-- Create form_fields_config table
CREATE TABLE public.form_fields_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key TEXT NOT NULL UNIQUE,
  field_type field_type NOT NULL,
  label_fr TEXT NOT NULL,
  label_en TEXT,
  placeholder TEXT,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL,
  field_section TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create form_submissions table
CREATE TABLE public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  files_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'new',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_fields_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for form_fields_config
CREATE POLICY "Anyone can view active form fields"
  ON public.form_fields_config
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "RH can manage form fields"
  ON public.form_fields_config
  FOR ALL
  USING (has_permission(auth.uid(), 'manage_jobs'));

-- RLS policies for form_submissions
CREATE POLICY "Anyone can submit form"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "RH can view all submissions"
  ON public.form_submissions
  FOR SELECT
  USING (has_permission(auth.uid(), 'view_all_applications'));

CREATE POLICY "RH can update submissions"
  ON public.form_submissions
  FOR UPDATE
  USING (has_permission(auth.uid(), 'review_applications'));

-- Create trigger for updated_at
CREATE TRIGGER update_form_fields_config_updated_at
  BEFORE UPDATE ON public.form_fields_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default configuration matching current form
INSERT INTO public.form_fields_config (field_key, field_type, label_fr, placeholder, is_required, display_order, field_section) VALUES
  ('firstName', 'text', 'Prénom', 'Votre prénom', true, 1, 'personal'),
  ('lastName', 'text', 'Nom', 'Votre nom', true, 2, 'personal'),
  ('email', 'email', 'Email', 'votre.email@exemple.com', true, 3, 'personal'),
  ('phone', 'tel', 'Téléphone', '+225 XX XX XX XX', false, 4, 'personal'),
  ('location', 'text', 'Localisation', 'Ville, Pays', false, 5, 'personal'),
  ('experienceYears', 'number', 'Années d''expérience', 'Nombre d''années', true, 6, 'professional'),
  ('technicalSkills', 'textarea', 'Compétences techniques', 'Listez vos compétences techniques', true, 7, 'professional'),
  ('behavioralSkills', 'textarea', 'Compétences comportementales', 'Listez vos soft skills', false, 8, 'professional'),
  ('linkedin', 'url', 'Profil LinkedIn', 'https://linkedin.com/in/...', false, 9, 'links'),
  ('github', 'url', 'Profil GitHub', 'https://github.com/...', false, 10, 'links'),
  ('cvFile', 'file', 'CV (PDF)', '', true, 11, 'documents'),
  ('motivationFile', 'file', 'Lettre de motivation (PDF)', '', false, 12, 'documents');