-- Phase 2: Fonction SQL pour calcul de similarité cosine

CREATE OR REPLACE FUNCTION calculate_cosine_similarity(vec1 vector(1536), vec2 vector(1536))
RETURNS float
LANGUAGE plpgsql
IMMUTABLE
AS $$
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
$$;