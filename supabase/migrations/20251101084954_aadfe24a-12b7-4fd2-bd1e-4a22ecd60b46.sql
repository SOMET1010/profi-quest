-- CORRECTION DES PROBLÈMES DE SÉCURITÉ CRITIQUES
-- Phase: Sécurisation des données sensibles (version corrigée)

-- =========================================
-- 1. SÉCURISATION DE LA TABLE PROFILES
-- =========================================

-- Supprimer TOUTES les politiques SELECT existantes pour recréer proprement
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "RH admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users view own profile" ON public.profiles;

-- Recréer une politique SELECT stricte qui requiert l'authentification
CREATE POLICY "Authenticated users view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- RH peut voir tous les profils (uniquement si authentifié et avec permission)
CREATE POLICY "RH admins view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('DG'::app_role, 'SI'::app_role, 'DRH'::app_role, 'RDRH'::app_role)
  )
);

-- =========================================
-- 2. SÉCURISATION DE PUBLIC_APPLICATIONS
-- =========================================

-- Supprimer la politique trop permissive qui permet de voir par email
DROP POLICY IF EXISTS "Users can view their own applications" ON public.public_applications;
DROP POLICY IF EXISTS "Authenticated users view own applications" ON public.public_applications;

-- Recréer une politique SELECT stricte (authentification requise)
CREATE POLICY "Authenticated users view own applications" 
ON public.public_applications 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_permission(auth.uid(), 'view_all_applications')
);

-- =========================================
-- 3. RENFORCEMENT AUDIT_LOGS
-- =========================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "user_activity_logs_read_own_or_dg" ON public.audit_logs;
DROP POLICY IF EXISTS "SUPERADMIN and DG can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Only SUPERADMIN and DG view audit logs" ON public.audit_logs;

-- Recréer une politique ultra-restrictive (SUPERADMIN et DG seulement)
CREATE POLICY "Only SUPERADMIN and DG view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (
  is_superadmin(auth.uid()) 
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'DG'::app_role
  )
);

-- =========================================
-- 4. VÉRIFICATIONS FINALES
-- =========================================

-- S'assurer que RLS est bien activé sur toutes les tables sensibles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Forcer RLS même pour les owners de la table (protection maximale)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.public_applications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;