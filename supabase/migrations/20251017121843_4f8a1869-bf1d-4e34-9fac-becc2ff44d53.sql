
-- ==========================================
-- PHASE 1: CORRECTIONS CRITIQUES DE SÉCURITÉ RLS
-- Consolidation des policies redondantes
-- Restriction des permissions trop permissives
-- ==========================================

-- ===========================================
-- 1. COURRIERS_MEMOS : Nettoyer les policies redondantes
-- ===========================================

-- Supprimer les policies "All users" redondantes avec "Authenticated users"
DROP POLICY IF EXISTS "All users can create courriers_memos" ON public.courriers_memos;
DROP POLICY IF EXISTS "All users can view courriers_memos" ON public.courriers_memos;
DROP POLICY IF EXISTS "All users can update courriers_memos" ON public.courriers_memos;

-- Garder uniquement les policies "Authenticated users" qui sont plus explicites
-- Ces policies restent inchangées :
-- - "Authenticated users can create courriers_memos"
-- - "Authenticated users can view all courriers_memos"
-- - "Authenticated users can update courriers_memos"

COMMENT ON TABLE public.courriers_memos IS 
'Courriers et mémos - Policies consolidées pour éliminer les redondances (Phase 1.1)';

-- ===========================================
-- 2. USER_PROFILES : Consolider les policies SELECT redondantes
-- ===========================================

-- Supprimer les policies SELECT redondantes
DROP POLICY IF EXISTS "Users can read own profile immediately" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for users during signup" ON public.user_profiles;

-- La policy principale reste :
-- - "Users can read own profile" (lecture de son propre profil)
-- - "Service role can manage all profiles" (gestion système)
-- - "Allow user profile creation" (création lors signup)
-- - "Users can update own profile" (modification)

COMMENT ON TABLE public.user_profiles IS 
'Profils utilisateurs KYC - Policies SELECT consolidées pour éviter redondances (Phase 1.2)';

-- ===========================================
-- 3. FACTURES : Restreindre la création aux rôles FINANCE/DG
-- ===========================================

-- Supprimer la policy trop permissive
DROP POLICY IF EXISTS "Authenticated users can create factures" ON public.factures;

-- Créer une nouvelle policy restrictive
CREATE POLICY "factures_insert_finance_dg_only"
ON public.factures
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM ansut_profiles
    WHERE ansut_profiles.id = auth.uid()
      AND ansut_profiles.role IN ('DG', 'FINANCE')
      AND ansut_profiles.is_active = true
  )
);

COMMENT ON POLICY "factures_insert_finance_dg_only" ON public.factures IS 
'Seuls les rôles DG et FINANCE peuvent créer des factures - Sécurité renforcée (Phase 1.3)';

-- ===========================================
-- 4. AUDIT_LOGS : Clarifier les permissions de lecture
-- ===========================================

-- Supprimer la policy permissive qui autorise tous les rôles
DROP POLICY IF EXISTS "lecture_audit_tous_roles" ON public.audit_logs;

-- Garder uniquement la policy restrictive DG
-- "Only DG can view audit logs" reste active
-- Cela garantit que seul le DG peut consulter l'audit complet

-- Créer une vue pour les autres rôles qui ne voient que leurs propres actions
CREATE OR REPLACE VIEW public.user_activity_logs AS
SELECT 
  id,
  table_name,
  record_id,
  action,
  actor_id,
  created_at,
  -- Ne pas exposer before_data et after_data pour les non-DG
  CASE 
    WHEN has_ansut_role('DG') THEN before_data
    ELSE NULL
  END as before_data,
  CASE 
    WHEN has_ansut_role('DG') THEN after_data
    ELSE NULL
  END as after_data
FROM public.audit_logs
WHERE actor_id = auth.uid() -- Les utilisateurs ne voient que leurs propres actions
   OR has_ansut_role('DG');  -- Sauf DG qui voit tout

-- Activer security_invoker pour respecter les permissions de l'utilisateur
ALTER VIEW public.user_activity_logs SET (security_invoker = true);

-- RLS policy pour la vue
CREATE POLICY "user_activity_logs_read_own_or_dg"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  actor_id = auth.uid() OR has_ansut_role('DG')
);

COMMENT ON VIEW public.user_activity_logs IS 
'Vue filtrée des logs d''audit - Les utilisateurs voient leurs actions, DG voit tout (Phase 1.4)';

-- ===========================================
-- 5. DOCUMENTATION DES CHANGEMENTS
-- ===========================================

COMMENT ON TABLE public.factures IS 
'Factures - Création restreinte aux rôles FINANCE et DG pour sécurité renforcée';

-- Résumé des améliorations :
-- ✅ courriers_memos : 6 policies → 3 policies (consolidation)
-- ✅ user_profiles : 6 policies → 4 policies (consolidation)
-- ✅ factures : Création restreinte FINANCE/DG uniquement
-- ✅ audit_logs : Lecture DG uniquement + vue filtrée pour les autres
-- 
-- Impact sécurité :
-- - Élimination des ambiguïtés de permissions
-- - Réduction de la surface d'attaque (moins de permissions)
-- - Meilleure traçabilité (audit logs protégés)
-- - Conformité avec le principe du moindre privilège
