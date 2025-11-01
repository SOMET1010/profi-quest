-- ============================================
-- PHASE 1 & 4 : Créer les buckets manquants
-- ============================================

-- Créer le bucket cvs pour les CV
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Vérifier et créer les autres buckets nécessaires
INSERT INTO storage.buckets (id, name, public) 
VALUES ('motivation-letters', 'motivation-letters', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('diplomas', 'diplomas', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PHASE 2 : Corriger la configuration du champ cvFile
-- ============================================

-- Mettre à jour cvFile pour pointer vers le bon bucket
UPDATE file_upload_config 
SET bucket_name = 'cvs' 
WHERE field_key = 'cvFile';

-- ============================================
-- PHASE 3 : Créer les politiques RLS - Option C (Hybrid)
-- ============================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public candidature upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read candidature files" ON storage.objects;
DROP POLICY IF EXISTS "RH can delete candidature files" ON storage.objects;
DROP POLICY IF EXISTS "RH can update candidature files" ON storage.objects;

-- 1. Permettre à tout le monde d'uploader des fichiers de candidature (INSERT)
CREATE POLICY "Public candidature upload"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id IN ('cvs', 'motivation-letters', 'diplomas', 'certificates')
);

-- 2. Permettre la lecture publique des fichiers (SELECT)
CREATE POLICY "Public read candidature files"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id IN ('cvs', 'motivation-letters', 'diplomas', 'certificates')
);

-- 3. Suppression réservée aux utilisateurs avec permission RH (DELETE)
CREATE POLICY "RH can delete candidature files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('cvs', 'motivation-letters', 'diplomas', 'certificates')
  AND has_permission(auth.uid(), 'manage_jobs')
);

-- 4. Mise à jour réservée aux RH (UPDATE)
CREATE POLICY "RH can update candidature files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('cvs', 'motivation-letters', 'diplomas', 'certificates')
  AND has_permission(auth.uid(), 'manage_jobs')
)
WITH CHECK (
  bucket_id IN ('cvs', 'motivation-letters', 'diplomas', 'certificates')
  AND has_permission(auth.uid(), 'manage_jobs')
);