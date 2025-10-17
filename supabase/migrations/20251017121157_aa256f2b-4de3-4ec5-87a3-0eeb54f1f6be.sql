
-- ==========================================
-- PHASE 3.1: CORRECTIONS FINALES DE SÉCURITÉ
-- Correction des fonctions avec search_path mutable
-- Protection contre les attaques par injection de schéma
-- ==========================================

-- 1. Corriger les fonctions avec search_path mutable
-- Ces fonctions sont vulnérables aux attaques par injection de schéma
-- Nous recréons ces fonctions avec SET search_path = public

-- Fonction fuzzy_search_fournisseurs (version avec 3 paramètres)
DROP FUNCTION IF EXISTS public.fuzzy_search_fournisseurs(text, real, integer);
CREATE OR REPLACE FUNCTION public.fuzzy_search_fournisseurs(search_term text, threshold real DEFAULT 0.8, max_results integer DEFAULT 5)
RETURNS TABLE(id uuid, nom text, similarity real)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.nom, similarity(unaccent(f.nom), unaccent(search_term)) as sim
  FROM fournisseurs f
  WHERE f.deleted_at IS NULL
    AND similarity(unaccent(f.nom), unaccent(search_term)) >= threshold
  ORDER BY sim DESC
  LIMIT max_results;
END;
$$;

-- Fonction fuzzy_search_fournisseurs (version avec 1 paramètre)
DROP FUNCTION IF EXISTS public.fuzzy_search_fournisseurs(text);
CREATE OR REPLACE FUNCTION public.fuzzy_search_fournisseurs(search_term text)
RETURNS TABLE(id uuid, nom text, similarity real)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.nom, similarity(unaccent(f.nom), unaccent(search_term)) as sim
  FROM fournisseurs f
  WHERE f.deleted_at IS NULL
    AND similarity(unaccent(f.nom), unaccent(search_term)) > 0.3
  ORDER BY sim DESC
  LIMIT 5;
END;
$$;

-- Fonction check_cheques_consistency
DROP FUNCTION IF EXISTS public.check_cheques_consistency();
CREATE OR REPLACE FUNCTION public.check_cheques_consistency()
RETURNS TABLE(total_cheques bigint, inconsistencies bigint, last_check timestamp with time zone)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_cheques,
    COUNT(*) FILTER (WHERE 
      (statut = 'RETIRE' AND date_retrait IS NULL) OR
      (statut = 'SIGNE' AND date_signature IS NULL) OR
      (statut = 'EN_ATTENTE' AND date_retrait IS NOT NULL)
    ) as inconsistencies,
    NOW() as last_check
  FROM cheques 
  WHERE deleted_at IS NULL;
END;
$$;

-- 2. Commentaires de documentation
COMMENT ON FUNCTION public.fuzzy_search_fournisseurs(text, real, integer) 
IS 'Secure fuzzy search with fixed search_path to prevent schema injection attacks (Phase 3.1)';

COMMENT ON FUNCTION public.fuzzy_search_fournisseurs(text) 
IS 'Secure fuzzy search with fixed search_path to prevent schema injection attacks (Phase 3.1)';

COMMENT ON FUNCTION public.check_cheques_consistency() 
IS 'Secure consistency check with fixed search_path to prevent schema injection attacks (Phase 3.1)';

-- 3. Note importante pour l'upgrade PostgreSQL
-- IMPORTANT: Une alerte de sécurité recommande d'upgrader PostgreSQL
-- Cette action doit être effectuée manuellement via le dashboard Supabase:
-- https://supabase.com/dashboard/project/fuqijxcyudibacaatgpj/settings/infrastructure
-- 
-- Étapes pour upgrader PostgreSQL:
-- 1. Aller dans Settings > Infrastructure
-- 2. Cliquer sur "Upgrade" pour PostgreSQL
-- 3. Suivre les instructions de Supabase
-- 
-- Cette migration ne peut pas effectuer l'upgrade automatiquement.
-- 
-- Résultat attendu après cette migration:
-- - 3 fonctions protégées contre l'injection de schéma ✅
-- - Table activites avec RLS policies (déjà en place) ✅
-- - Upgrade PostgreSQL (action manuelle requise) ⚠️
