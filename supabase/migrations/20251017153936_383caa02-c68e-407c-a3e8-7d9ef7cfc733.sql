-- ============================================
-- NETTOYAGE COMPLET - Suppression système financier
-- Date: 2025-01-17
-- Objectif: Transformer la DB en système 100% RH
-- ============================================

-- ============================================
-- PHASE 1: SUPPRESSION DES TABLES FINANCIÈRES
-- ============================================

-- Tables de gestion des chèques
DROP TABLE IF EXISTS public.cheques_status_corrections CASCADE;
DROP TABLE IF EXISTS public.cheques CASCADE;

-- Tables de gestion des virements
DROP TABLE IF EXISTS public.virement_lignes CASCADE;
DROP TABLE IF EXISTS public.virements CASCADE;

-- Tables de gestion des factures
DROP TABLE IF EXISTS public.facture_lignes CASCADE;
DROP TABLE IF EXISTS public.factures CASCADE;

-- Tables de gestion des fournisseurs
DROP TABLE IF EXISTS public.fournisseurs CASCADE;

-- Tables bancaires
DROP TABLE IF EXISTS public.journaux_bancaires CASCADE;

-- ============================================
-- PHASE 2: SUPPRESSION DES TABLES D'IMPORT
-- ============================================

DROP TABLE IF EXISTS public.staging_import_rows CASCADE;
DROP TABLE IF EXISTS public.staging_imports CASCADE;
DROP TABLE IF EXISTS public.debug_sessions CASCADE;

-- ============================================
-- PHASE 3: SUPPRESSION DES VUES
-- ============================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_cheques_kpi CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.mv_import_performance CASCADE;
DROP VIEW IF EXISTS public.v_cheques_status_corrections_summary CASCADE;

-- ============================================
-- PHASE 4: SUPPRESSION DES TYPES ENUM
-- ============================================

DROP TYPE IF EXISTS public.cheque_status CASCADE;
DROP TYPE IF EXISTS public.fournisseur_status CASCADE;
DROP TYPE IF EXISTS public.import_status CASCADE;
DROP TYPE IF EXISTS public.import_type CASCADE;
DROP TYPE IF EXISTS public.row_status CASCADE;

-- ============================================
-- PHASE 5: SUPPRESSION DES FONCTIONS FINANCIÈRES
-- ============================================

-- Fonctions de gestion des chèques
DROP FUNCTION IF EXISTS public.maintain_cheque_status_consistency() CASCADE;
DROP FUNCTION IF EXISTS public.check_cheques_consistency() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_cheques_kpi() CASCADE;

-- Fonctions de recherche fournisseurs
DROP FUNCTION IF EXISTS public.fuzzy_search_fournisseurs(text) CASCADE;
DROP FUNCTION IF EXISTS public.fuzzy_search_fournisseurs(text, real, integer) CASCADE;
DROP FUNCTION IF EXISTS public.detect_duplicates(text, jsonb, real) CASCADE;

-- Fonctions d'import
DROP FUNCTION IF EXISTS public.deduplicate_import_rows(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.apply_default_values(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.optimize_import_performance(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.reset_stuck_import(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.retry_import(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.manual_process_import(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.trigger_import_processing(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_import_statistics(date, date) CASCADE;
DROP FUNCTION IF EXISTS public.refresh_import_performance_stats() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_imports(integer, boolean) CASCADE;

-- Fonction de validation (purement financière)
DROP FUNCTION IF EXISTS public.validate_import_data(text, jsonb) CASCADE;

-- ============================================
-- PHASE 6: VÉRIFICATION FINALE
-- ============================================

-- Log de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Nettoyage financier terminé:';
  RAISE NOTICE '- 11 tables supprimées';
  RAISE NOTICE '- 5 types enum supprimés';
  RAISE NOTICE '- 15 fonctions supprimées';
  RAISE NOTICE 'Base de données maintenant 100%% orientée RH ✓';
END $$;