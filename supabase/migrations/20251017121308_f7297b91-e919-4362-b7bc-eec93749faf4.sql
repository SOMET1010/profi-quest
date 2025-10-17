
-- ==========================================
-- PHASE 3.2: CORRECTIONS SECURITY DEFINER VIEWS
-- Convertir les vues SECURITY DEFINER en SECURITY INVOKER
-- Les vues SECURITY DEFINER s'exécutent avec les privilèges du créateur
-- au lieu de l'utilisateur qui les interroge, ce qui peut contourner RLS
-- ==========================================

-- 1. Vue kpi_performance_globale
-- Convertir en security_invoker pour respecter les RLS de l'utilisateur
ALTER VIEW public.kpi_performance_globale 
SET (security_invoker = true);

COMMENT ON VIEW public.kpi_performance_globale IS 
'Vue KPI avec security_invoker=true - applique les RLS de l''utilisateur (Phase 3.2)';

-- 2. Vue v_cheques_status_corrections_summary
-- Convertir en security_invoker pour respecter les RLS de l'utilisateur
ALTER VIEW public.v_cheques_status_corrections_summary 
SET (security_invoker = true);

COMMENT ON VIEW public.v_cheques_status_corrections_summary IS 
'Vue résumé corrections chèques avec security_invoker=true - applique les RLS de l''utilisateur (Phase 3.2)';

-- 3. Vue v_debug_dashboard
-- Convertir en security_invoker pour respecter les RLS de l'utilisateur
ALTER VIEW public.v_debug_dashboard 
SET (security_invoker = true);

COMMENT ON VIEW public.v_debug_dashboard IS 
'Vue debug dashboard avec security_invoker=true - applique les RLS de l''utilisateur (Phase 3.2)';

-- Documentation de la correction
-- Les vues avec security_invoker=true appliquent les permissions et RLS
-- de l'utilisateur qui exécute la requête, pas du créateur de la vue.
-- Cela garantit que les utilisateurs ne peuvent voir que les données
-- auxquelles ils ont accès selon les policies RLS en place.
