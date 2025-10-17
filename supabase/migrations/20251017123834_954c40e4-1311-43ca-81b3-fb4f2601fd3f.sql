-- ============================================
-- PHASE 1: Suppression des tables inutilisées
-- ============================================

-- 1. Tables KYC non utilisées
DROP TABLE IF EXISTS public.kyc_workflows CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. Anciens systèmes de projets (doublons)
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.projets CASCADE;

-- 3. Table utilisateurs doublon
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- PHASE 2: Clarification du modèle utilisateur
-- ============================================

-- Ajouter une clé étrangère vers ansut_profiles dans profiles
ALTER TABLE public.profiles 
ADD COLUMN ansut_profile_id uuid REFERENCES public.ansut_profiles(id) ON DELETE CASCADE;

-- Créer un index pour les performances
CREATE INDEX idx_profiles_ansut_profile_id ON public.profiles(ansut_profile_id);

-- Migrer les données existantes si emails correspondent
UPDATE public.profiles p
SET ansut_profile_id = a.id
FROM public.ansut_profiles a
WHERE p.email = a.email;

-- Supprimer la colonne user_id (doublon)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id CASCADE;