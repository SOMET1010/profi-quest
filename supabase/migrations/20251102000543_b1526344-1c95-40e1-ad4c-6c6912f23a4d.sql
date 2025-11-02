-- ============================================================================
-- PHASE 0: Nettoyer les données orphelines
-- ============================================================================

-- Supprimer les profils sans utilisateur correspondant dans auth.users
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- ============================================================================
-- PHASE 1: Migrer les données de profiles.role vers user_roles
-- ============================================================================

-- Créer les entrées manquantes dans user_roles basées sur profiles.role
INSERT INTO public.user_roles (user_id, role)
SELECT 
  p.id,
  CASE 
    WHEN p.role = 'admin' THEN 'DRH'::app_role
    WHEN p.role = 'viewer' THEN 'POSTULANT'::app_role
    ELSE 'POSTULANT'::app_role
  END as role
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
WHERE p.role IS NOT NULL 
  AND p.role != 'viewer'
  AND ur.role IS NULL
  AND EXISTS (SELECT 1 FROM auth.users WHERE id = p.id)
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- PHASE 2: Supprimer la colonne obsolète profiles.role
-- ============================================================================

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;

-- ============================================================================
-- PHASE 3: Corriger le trigger handle_new_user()
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insérer le profil (SANS le champ role obsolète)
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Auto-assigner le rôle POSTULANT dans user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'POSTULANT'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Logger l'erreur pour debugging
  RAISE LOG 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RAISE; -- Propager l'erreur pour que Supabase la capture
END;
$function$;