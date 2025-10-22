-- Politiques RLS pour les buckets de storage
-- Permettre les uploads anonymes pour le formulaire public

-- Politiques pour le bucket 'diplomas'
CREATE POLICY "Allow anonymous uploads to diplomas"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'diplomas');

CREATE POLICY "RH can read all diplomas"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'diplomas' 
  AND has_permission(auth.uid(), 'view_all_applications')
);

CREATE POLICY "RH can update diplomas"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'diplomas' 
  AND has_permission(auth.uid(), 'review_applications')
);

CREATE POLICY "RH can delete diplomas"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'diplomas' 
  AND has_permission(auth.uid(), 'review_applications')
);

-- Politiques pour le bucket 'motivation-letters'
CREATE POLICY "Allow anonymous uploads to motivation-letters"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'motivation-letters');

CREATE POLICY "RH can read all motivation letters"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'motivation-letters' 
  AND has_permission(auth.uid(), 'view_all_applications')
);

CREATE POLICY "RH can update motivation letters"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'motivation-letters' 
  AND has_permission(auth.uid(), 'review_applications')
);

CREATE POLICY "RH can delete motivation letters"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'motivation-letters' 
  AND has_permission(auth.uid(), 'review_applications')
);

-- Politiques pour le bucket 'certificates'
CREATE POLICY "Allow anonymous uploads to certificates"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "RH can read all certificates"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'certificates' 
  AND has_permission(auth.uid(), 'view_all_applications')
);

CREATE POLICY "RH can update certificates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certificates' 
  AND has_permission(auth.uid(), 'review_applications')
);

CREATE POLICY "RH can delete certificates"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates' 
  AND has_permission(auth.uid(), 'review_applications')
);