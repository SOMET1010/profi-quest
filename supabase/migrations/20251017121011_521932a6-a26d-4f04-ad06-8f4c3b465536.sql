
-- ==========================================
-- PHASE 3.2: CORRECTIONS FINALES - Functions Search Path
-- Correction des 3 dernières fonctions avec search_path mutable
-- ==========================================

-- Ces fonctions sont utilisées pour le système d'import
-- et doivent avoir un search_path fixe pour éviter les injections

-- 1. Corriger apply_default_values
DROP FUNCTION IF EXISTS public.apply_default_values(uuid);
CREATE OR REPLACE FUNCTION public.apply_default_values(import_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE staging_import_rows 
  SET normalized_data = COALESCE(normalized_data, '{}'::jsonb) || '{"default_applied": true}'::jsonb
  WHERE import_id = import_id_param AND status = 'FAILED';
END;
$$;

COMMENT ON FUNCTION public.apply_default_values(uuid) 
IS 'Apply default values to failed import rows - secure with fixed search_path';

-- 2. Corriger deduplicate_import_rows
DROP FUNCTION IF EXISTS public.deduplicate_import_rows(uuid);
CREATE OR REPLACE FUNCTION public.deduplicate_import_rows(import_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Compter les doublons
  SELECT COUNT(*)::INTEGER INTO duplicate_count
  FROM staging_import_rows 
  WHERE import_id = import_id_param 
    AND conflict_key IN (
      SELECT conflict_key 
      FROM staging_import_rows 
      WHERE import_id = import_id_param 
        AND conflict_key IS NOT NULL
      GROUP BY conflict_key 
      HAVING COUNT(*) > 1
    );
    
  -- Marquer les doublons (garder le premier)
  UPDATE staging_import_rows 
  SET status = 'FAILED', error_msg = 'Duplicate entry'
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY conflict_key ORDER BY created_at) as rn
      FROM staging_import_rows 
      WHERE import_id = import_id_param AND conflict_key IS NOT NULL
    ) t WHERE t.rn > 1
  );
  
  RETURN duplicate_count;
END;
$$;

COMMENT ON FUNCTION public.deduplicate_import_rows(uuid) 
IS 'Deduplicate import rows - secure with fixed search_path';

-- 3. Corriger optimize_import_performance
DROP FUNCTION IF EXISTS public.optimize_import_performance(uuid);
CREATE OR REPLACE FUNCTION public.optimize_import_performance(import_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Marquer les lignes comme optimisées
  UPDATE staging_import_rows 
  SET normalized_data = COALESCE(normalized_data, '{}'::jsonb) || '{"optimized": true}'::jsonb
  WHERE import_id = import_id_param;
END;
$$;

COMMENT ON FUNCTION public.optimize_import_performance(uuid) 
IS 'Optimize import performance - secure with fixed search_path';

-- 4. Documentation finale
-- Toutes les fonctions système ont maintenant un search_path fixe
-- pour prévenir les attaques par injection de schéma
