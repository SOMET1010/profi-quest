-- ==========================================
-- PHASE 1: CORRECTIONS DE SÉCURITÉ CRITIQUES
-- Sécurisation des tables ansut_profiles et fournisseurs
-- ==========================================

-- 1.1. Sécuriser la table ansut_profiles
-- Problème: ansut_profiles_select_own permet à tout utilisateur authentifié de voir son profil
-- Solution: Restreindre l'accès aux seuls rôles autorisés (DG, FINANCE, AGENT)

DROP POLICY IF EXISTS "ansut_profiles_select_own" ON public.ansut_profiles;

-- Nouvelle politique: Seuls les rôles autorisés peuvent voir les profils
CREATE POLICY "ansut_profiles_select_authorized_roles" 
ON public.ansut_profiles 
FOR SELECT 
USING (
  -- L'utilisateur peut voir son propre profil limité OU
  -- L'utilisateur a un rôle autorisé (DG, FINANCE, AGENT)
  auth.uid() = id 
  OR has_ansut_role('DG'::text)
  OR has_ansut_role('FINANCE'::text)
  OR has_ansut_role('AGENT'::text)
);

-- 1.2. Sécuriser la table fournisseurs
-- Problème: fournisseurs_select_authenticated permet à TOUS les utilisateurs authentifiés de voir les données financières
-- Solution: Restreindre aux rôles DG, FINANCE et AGENT uniquement

DROP POLICY IF EXISTS "fournisseurs_select_authenticated" ON public.fournisseurs;

-- Nouvelle politique: Seuls DG, FINANCE et AGENT peuvent lire les fournisseurs
CREATE POLICY "fournisseurs_select_authorized_roles" 
ON public.fournisseurs 
FOR SELECT 
USING (
  has_ansut_role('DG'::text) 
  OR has_ansut_role('FINANCE'::text)
  OR has_ansut_role('AGENT'::text)
);

-- Commentaires explicatifs
COMMENT ON POLICY "ansut_profiles_select_authorized_roles" ON public.ansut_profiles IS 
'Restricts profile viewing to authorized roles (DG, FINANCE, AGENT) or own profile. Fixes security vulnerability where any authenticated user could view sensitive profile data.';

COMMENT ON POLICY "fournisseurs_select_authorized_roles" ON public.fournisseurs IS 
'Restricts supplier data viewing to DG, FINANCE, and AGENT roles only. Prevents unauthorized access to financial vendor information.';