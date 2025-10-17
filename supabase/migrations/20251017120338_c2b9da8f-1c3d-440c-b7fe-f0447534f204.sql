-- ==========================================
-- PHASE 2: CORRECTIONS DE SÉCURITÉ IMPORTANTES
-- Correction des fonctions avec search_path mutable
-- Déplacement des extensions
-- Masquage des vues matérialisées
-- ==========================================

-- 2.1. Corriger les fonctions avec search_path mutable
-- Ces fonctions doivent avoir SET search_path = public pour éviter les attaques par injection

-- Fonction: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$;

-- Fonction: validate_active_user_role
CREATE OR REPLACE FUNCTION public.validate_active_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = true AND NEW.role NOT IN ('DG', 'FINANCE', 'AGENT', 'READONLY') THEN
    RAISE EXCEPTION 'Active users must have a valid role';
  END IF;
  RETURN NEW;
END;
$$;

-- Fonction: update_updated_at_column (déjà corrigée mais on s'assure)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 2.2. Créer un schéma pour les extensions et les déplacer
CREATE SCHEMA IF NOT EXISTS extensions;

-- Déplacer les extensions pg_trgm et unaccent
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

-- Mettre à jour le search_path pour inclure le schéma extensions
ALTER DATABASE postgres SET search_path TO public, extensions;

-- 2.3. Masquer les vues matérialisées de l'API publique
-- Révoquer les permissions sur les vues matérialisées sensibles

REVOKE ALL ON public.mv_cheques_kpi FROM anon, authenticated;
REVOKE ALL ON public.mv_import_performance FROM anon, authenticated;

-- Autoriser uniquement les rôles spécifiques à accéder à ces vues
GRANT SELECT ON public.mv_cheques_kpi TO authenticator;
GRANT SELECT ON public.mv_import_performance TO authenticator;

-- Commentaires explicatifs
COMMENT ON FUNCTION public.handle_new_user() IS 
'Secure function with fixed search_path to prevent search_path injection attacks';

COMMENT ON FUNCTION public.validate_active_user_role() IS 
'Secure function with fixed search_path to prevent search_path injection attacks';

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Secure function with fixed search_path to prevent search_path injection attacks';

COMMENT ON SCHEMA extensions IS 
'Schema for PostgreSQL extensions to isolate them from the public schema';

COMMENT ON MATERIALIZED VIEW public.mv_cheques_kpi IS 
'Materialized view with restricted access - only accessible through authenticator role';

COMMENT ON MATERIALIZED VIEW public.mv_import_performance IS 
'Materialized view with restricted access - only accessible through authenticator role';