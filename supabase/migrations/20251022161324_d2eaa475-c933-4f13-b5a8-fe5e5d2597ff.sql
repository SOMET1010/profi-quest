-- Table de configuration pour les uploads de fichiers
CREATE TABLE IF NOT EXISTS file_upload_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key text NOT NULL UNIQUE,
  bucket_name text NOT NULL,
  max_size_mb integer DEFAULT 5 CHECK (max_size_mb > 0 AND max_size_mb <= 20),
  allowed_extensions text[] DEFAULT '{pdf,doc,docx}' CHECK (array_length(allowed_extensions, 1) > 0),
  allowed_mime_types text[] DEFAULT '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_file_upload_config_field_key ON file_upload_config(field_key);

-- Trigger pour updated_at
CREATE TRIGGER update_file_upload_config_updated_at
  BEFORE UPDATE ON file_upload_config
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- RLS Policies
ALTER TABLE file_upload_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read file config"
  ON file_upload_config FOR SELECT
  USING (true);

CREATE POLICY "RH can manage file config"
  ON file_upload_config FOR ALL
  USING (has_permission(auth.uid(), 'manage_jobs'));

-- Seed initial data
INSERT INTO file_upload_config (field_key, bucket_name, max_size_mb, allowed_extensions, allowed_mime_types) VALUES
  ('cvFile', 'diplomas', 5, '{pdf,doc,docx}', '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'),
  ('motivationFile', 'motivation-letters', 5, '{pdf,doc,docx}', '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}'),
  ('diplomaFile', 'diplomas', 5, '{pdf,doc,docx,jpg,jpeg,png}', '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png}'),
  ('certificateFile', 'certificates', 5, '{pdf,doc,docx,jpg,jpeg,png}', '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png}')
ON CONFLICT (field_key) DO NOTHING;

-- Commentaires
COMMENT ON TABLE file_upload_config IS 'Configuration des uploads de fichiers par champ de formulaire';
COMMENT ON COLUMN file_upload_config.field_key IS 'Clé du champ de formulaire';
COMMENT ON COLUMN file_upload_config.bucket_name IS 'Nom du bucket Supabase Storage';
COMMENT ON COLUMN file_upload_config.max_size_mb IS 'Taille maximale en MB (1-20)';
COMMENT ON COLUMN file_upload_config.allowed_extensions IS 'Extensions de fichier autorisées';
COMMENT ON COLUMN file_upload_config.allowed_mime_types IS 'Types MIME acceptés';