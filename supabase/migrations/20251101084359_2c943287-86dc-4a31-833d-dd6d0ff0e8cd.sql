-- Phase 3.1: Fix security linter warnings

-- 1. Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Move vector extension from public to extensions schema
-- This resolves the "Extension in Public" warning
ALTER EXTENSION vector SET SCHEMA extensions;

-- 3. Fix calculate_cosine_similarity function to set search_path
-- This resolves the "Function Search Path Mutable" warning
CREATE OR REPLACE FUNCTION public.calculate_cosine_similarity(vec1 extensions.vector, vec2 extensions.vector)
 RETURNS double precision
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path = ''
AS $function$
DECLARE
  dot_product float;
  magnitude1 float;
  magnitude2 float;
BEGIN
  -- Calcul du produit scalaire
  SELECT SUM(a * b) INTO dot_product
  FROM unnest(vec1::float[]) WITH ORDINALITY AS t1(a, i)
  JOIN unnest(vec2::float[]) WITH ORDINALITY AS t2(b, j)
  ON t1.i = t2.j;
  
  -- Calcul des magnitudes
  SELECT SQRT(SUM(a * a)) INTO magnitude1
  FROM unnest(vec1::float[]) AS t(a);
  
  SELECT SQRT(SUM(b * b)) INTO magnitude2
  FROM unnest(vec2::float[]) AS t(b);
  
  -- Similarité cosine = dot_product / (magnitude1 * magnitude2)
  IF magnitude1 = 0 OR magnitude2 = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN dot_product / (magnitude1 * magnitude2);
END;
$function$;