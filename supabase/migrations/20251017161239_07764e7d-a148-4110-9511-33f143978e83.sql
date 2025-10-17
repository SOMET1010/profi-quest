-- Phase 1: Création du système RBAC complet pour ANSUT (CORRIGÉ)

-- 1.1 Supprimer l'ancien enum et créer le nouveau avec les 7 rôles ANSUT
DROP TYPE IF EXISTS app_role CASCADE;
CREATE TYPE app_role AS ENUM (
  'DG',           -- Directeur Général (niveau 10)
  'SI',           -- Système d'Information (niveau 9)
  'DRH',          -- Directeur des Ressources Humaines (niveau 8)
  'RDRH',         -- Responsable DRH (niveau 7)
  'RH_ASSISTANT', -- Assistant RH (niveau 5)
  'CONSULTANT',   -- Expert validé (niveau 3)
  'POSTULANT'     -- Candidat (niveau 1)
);

-- 1.2 Création de la table ansut_roles (Définition des 7 rôles de base)
CREATE TABLE IF NOT EXISTS public.ansut_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code app_role NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  hierarchy_level INTEGER NOT NULL,
  is_system_role BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertion des 7 rôles ANSUT avec leur hiérarchie
INSERT INTO public.ansut_roles (code, label, description, hierarchy_level) VALUES
  ('DG', 'Directeur Général', 'Accès complet, gestion stratégique et validation finale', 10),
  ('SI', 'Système d''Information', 'Accès technique complet, administration système', 9),
  ('DRH', 'Directeur RH', 'Gestion complète RH, validation des recrutements', 8),
  ('RDRH', 'Responsable DRH', 'Supervision RH, validation intermédiaire', 7),
  ('RH_ASSISTANT', 'Assistant RH', 'Traitement des candidatures, saisie', 5),
  ('CONSULTANT', 'Consultant Expert', 'Consultation du profil expert, missions', 3),
  ('POSTULANT', 'Postulant', 'Soumission candidature uniquement', 1);

-- 1.3 Création de la table permissions (Catalogue de toutes les permissions)
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  required_hierarchy_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insertion des permissions avec catégorisation
INSERT INTO public.permissions (code, label, description, category, required_hierarchy_level) VALUES
  -- Candidatures
  ('submit_application', 'Soumettre une candidature', 'Permet de créer et soumettre une candidature', 'candidatures', 1),
  ('view_own_application', 'Voir sa propre candidature', 'Consulter le statut de sa candidature', 'candidatures', 1),
  ('view_all_applications', 'Voir toutes les candidatures', 'Accès à toutes les candidatures', 'candidatures', 5),
  ('review_applications', 'Examiner les candidatures', 'Première revue des dossiers', 'candidatures', 5),
  ('validate_applications', 'Valider les candidatures', 'Validation intermédiaire', 'candidatures', 7),
  ('approve_applications', 'Approuver les candidatures', 'Approbation finale', 'candidatures', 8),
  ('reject_applications', 'Rejeter les candidatures', 'Refuser une candidature', 'candidatures', 7),
  
  -- Base de données experts
  ('view_expert_database', 'Voir la base experts', 'Consulter les profils experts', 'database', 3),
  ('edit_expert_profiles', 'Modifier les profils experts', 'Éditer les informations experts', 'database', 5),
  ('export_database', 'Exporter la base', 'Export Excel/CSV de la base', 'database', 7),
  ('delete_expert_profiles', 'Supprimer des profils', 'Suppression de profils experts', 'database', 8),
  
  -- Administration
  ('manage_users', 'Gérer les utilisateurs', 'Créer/modifier utilisateurs ANSUT', 'admin', 8),
  ('manage_roles', 'Gérer les rôles', 'Attribution de rôles', 'admin', 9),
  ('manage_permissions', 'Gérer les permissions', 'Attribution de permissions individuelles', 'admin', 10),
  ('view_audit_logs', 'Voir les logs d''audit', 'Consulter l''historique des actions', 'admin', 8),
  ('manage_system_settings', 'Paramètres système', 'Configuration globale', 'admin', 9),
  
  -- Courriers & Diligences
  ('create_courriers', 'Créer des courriers', 'Enregistrer des courriers/mémos', 'courriers', 5),
  ('assign_diligences', 'Assigner des diligences', 'Attribuer des tâches', 'courriers', 5),
  ('view_all_courriers', 'Voir tous les courriers', 'Accès complet courriers', 'courriers', 7),
  
  -- Analytics
  ('view_dashboard', 'Voir le tableau de bord', 'Accès au dashboard', 'analytics', 3),
  ('view_advanced_analytics', 'Analytics avancées', 'Rapports détaillés', 'analytics', 7),
  ('export_reports', 'Exporter les rapports', 'Export de rapports', 'analytics', 7);

-- 1.4 Création de la table role_default_permissions (Permissions par défaut de chaque rôle)
CREATE TABLE IF NOT EXISTS public.role_default_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code app_role NOT NULL,
  permission_code TEXT NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_code, permission_code)
);

-- Permissions par défaut pour DG (toutes les permissions)
INSERT INTO public.role_default_permissions (role_code, permission_code)
SELECT 'DG', code FROM permissions;

-- Permissions par défaut pour SI (toutes les permissions - rôle transversal technique)
INSERT INTO public.role_default_permissions (role_code, permission_code)
SELECT 'SI', code FROM permissions;

-- Permissions par défaut pour DRH
INSERT INTO public.role_default_permissions (role_code, permission_code) VALUES
  ('DRH', 'view_all_applications'),
  ('DRH', 'review_applications'),
  ('DRH', 'validate_applications'),
  ('DRH', 'approve_applications'),
  ('DRH', 'reject_applications'),
  ('DRH', 'view_expert_database'),
  ('DRH', 'edit_expert_profiles'),
  ('DRH', 'export_database'),
  ('DRH', 'manage_users'),
  ('DRH', 'view_audit_logs'),
  ('DRH', 'view_all_courriers'),
  ('DRH', 'view_dashboard'),
  ('DRH', 'view_advanced_analytics'),
  ('DRH', 'export_reports');

-- Permissions par défaut pour RDRH
INSERT INTO public.role_default_permissions (role_code, permission_code) VALUES
  ('RDRH', 'view_all_applications'),
  ('RDRH', 'review_applications'),
  ('RDRH', 'validate_applications'),
  ('RDRH', 'reject_applications'),
  ('RDRH', 'view_expert_database'),
  ('RDRH', 'edit_expert_profiles'),
  ('RDRH', 'export_database'),
  ('RDRH', 'view_all_courriers'),
  ('RDRH', 'view_dashboard'),
  ('RDRH', 'view_advanced_analytics'),
  ('RDRH', 'export_reports');

-- Permissions par défaut pour RH_ASSISTANT
INSERT INTO public.role_default_permissions (role_code, permission_code) VALUES
  ('RH_ASSISTANT', 'view_all_applications'),
  ('RH_ASSISTANT', 'review_applications'),
  ('RH_ASSISTANT', 'view_expert_database'),
  ('RH_ASSISTANT', 'create_courriers'),
  ('RH_ASSISTANT', 'assign_diligences'),
  ('RH_ASSISTANT', 'view_dashboard');

-- Permissions par défaut pour CONSULTANT
INSERT INTO public.role_default_permissions (role_code, permission_code) VALUES
  ('CONSULTANT', 'view_own_application'),
  ('CONSULTANT', 'view_expert_database'),
  ('CONSULTANT', 'view_dashboard');

-- Permissions par défaut pour POSTULANT
INSERT INTO public.role_default_permissions (role_code, permission_code) VALUES
  ('POSTULANT', 'submit_application'),
  ('POSTULANT', 'view_own_application');

-- 1.5 Création de la table user_permissions (Permissions individuelles - overrides)
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_code TEXT NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission_code)
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_granted ON user_permissions(granted);

-- 1.6 Recréer la table user_roles avec le nouveau type app_role
DROP TABLE IF EXISTS public.user_roles CASCADE;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'POSTULANT',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 1.7 Fonction de sécurité SECURITY DEFINER : has_permission()
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id UUID, 
  _permission_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  has_default_permission BOOLEAN;
  user_override_permission BOOLEAN;
BEGIN
  -- 1. Récupérer le rôle de l'utilisateur
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = _user_id
  LIMIT 1;

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Vérifier si le rôle a cette permission par défaut
  SELECT EXISTS(
    SELECT 1 
    FROM role_default_permissions
    WHERE role_code = user_role 
      AND permission_code = _permission_code
  ) INTO has_default_permission;

  -- 3. Vérifier les permissions individuelles (overrides)
  SELECT granted INTO user_override_permission
  FROM user_permissions
  WHERE user_id = _user_id 
    AND permission_code = _permission_code;

  -- 4. Logique de décision : override prime, sinon permission par défaut
  IF user_override_permission IS NOT NULL THEN
    RETURN user_override_permission;
  END IF;

  RETURN COALESCE(has_default_permission, FALSE);
END;
$$;

-- 1.8 Fonction pour récupérer toutes les permissions d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE(permission_code TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH user_role AS (
    SELECT role FROM user_roles WHERE user_id = _user_id LIMIT 1
  ),
  default_perms AS (
    SELECT rdp.permission_code
    FROM role_default_permissions rdp
    JOIN user_role ur ON rdp.role_code = ur.role
  ),
  user_overrides AS (
    SELECT permission_code, granted
    FROM user_permissions
    WHERE user_id = _user_id
  )
  SELECT DISTINCT dp.permission_code
  FROM default_perms dp
  WHERE NOT EXISTS (
    SELECT 1 FROM user_overrides uo 
    WHERE uo.permission_code = dp.permission_code 
      AND uo.granted = false
  )
  UNION
  SELECT uo.permission_code
  FROM user_overrides uo
  WHERE uo.granted = true;
END;
$$;

-- 1.9 Mise à jour de la fonction get_current_user_role pour compatibilité
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 1.10 RLS Policies pour user_roles
CREATE POLICY "Users can view their own role"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "DG and SI can manage all roles"
ON user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('DG', 'SI')
  )
);

CREATE POLICY "Allow first DG self-assignment"
ON user_roles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'DG' 
  AND NOT EXISTS (SELECT 1 FROM user_roles WHERE role = 'DG')
);

-- 1.11 RLS pour ansut_roles (lecture seule pour tous)
ALTER TABLE public.ansut_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view roles"
ON ansut_roles FOR SELECT
USING (true);

-- 1.12 RLS pour permissions (lecture seule pour tous)
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view permissions"
ON permissions FOR SELECT
USING (true);

-- 1.13 RLS pour role_default_permissions
ALTER TABLE public.role_default_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view default permissions"
ON role_default_permissions FOR SELECT
USING (true);

-- 1.14 RLS pour user_permissions
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own permissions"
ON user_permissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "DG and SI can manage all permissions"
ON user_permissions FOR ALL
USING (has_permission(auth.uid(), 'manage_permissions'));

-- 1.15 Création de la table application_workflow pour le workflow de validation
CREATE TABLE IF NOT EXISTS public.application_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),
  reviewer_role app_role,
  reviewed_at TIMESTAMPTZ,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workflow_application ON application_workflow(application_id);
CREATE INDEX idx_workflow_status ON application_workflow(status);

-- RLS pour application_workflow
ALTER TABLE public.application_workflow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow of their application"
ON application_workflow FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = application_id 
    AND profiles.id = auth.uid()
  )
  OR has_permission(auth.uid(), 'view_all_applications')
);

CREATE POLICY "RH can manage workflow"
ON application_workflow FOR ALL
USING (
  has_permission(auth.uid(), 'review_applications')
  OR has_permission(auth.uid(), 'validate_applications')
  OR has_permission(auth.uid(), 'approve_applications')
);

-- 1.16 Trigger pour updated_at sur les nouvelles tables
CREATE TRIGGER update_ansut_roles_updated_at
BEFORE UPDATE ON ansut_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();