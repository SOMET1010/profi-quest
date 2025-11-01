-- ============================================
-- CORRECTION PRIORITÉ 1 - SÉCURITÉ CRITIQUE
-- ============================================

-- ============================================
-- CORRECTION 1 : Créer un Administrateur DG
-- ============================================

-- Supprimer le rôle POSTULANT existant pour dg@ansut.ci
DELETE FROM user_roles 
WHERE user_id = '9d257064-d562-47a3-a81f-9b6a9b841db6' 
  AND role = 'POSTULANT';

-- Assigner le rôle DG à dg@ansut.ci
INSERT INTO user_roles (user_id, role)
VALUES ('9d257064-d562-47a3-a81f-9b6a9b841db6', 'DG')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- CORRECTION 2 : Sécuriser la Table audit_logs
-- ============================================

-- Supprimer l'ancienne politique vulnérable qui permettait à n'importe qui d'insérer
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- Créer une nouvelle politique sécurisée : SEUL service_role peut insérer
-- Les triggers utilisent automatiquement SECURITY DEFINER donc continueront de fonctionner
CREATE POLICY "Service role can insert audit logs"
ON audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Vérification : Les utilisateurs authentifiés ne doivent plus pouvoir insérer
-- Seuls les triggers (qui s'exécutent avec service_role via SECURITY DEFINER) peuvent insérer