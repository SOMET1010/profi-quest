-- Ajouter user_id à public_applications pour lier les candidatures aux utilisateurs
ALTER TABLE public_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Lier les candidatures existantes aux utilisateurs via email
UPDATE public_applications pa
SET user_id = au.id
FROM auth.users au
WHERE pa.email = au.email AND pa.user_id IS NULL;

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_public_applications_user_id 
ON public_applications(user_id);

-- Mettre à jour les politiques RLS pour utiliser user_id
DROP POLICY IF EXISTS "Users can view their own applications" ON public_applications;

CREATE POLICY "Users can view their own applications" 
ON public_applications 
FOR SELECT 
USING (auth.uid() = user_id OR has_permission(auth.uid(), 'view_all_applications'));