-- Sécurisation de la table profiles
-- Problème: Policy "Users can view all profiles" expose toutes les données sensibles

-- Supprimer la policy dangereuse
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Créer policy pour que les utilisateurs voient uniquement leur propre profil
CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Créer policy pour que les admins RH voient tous les profils
CREATE POLICY "RH admins view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('DG', 'SI', 'DRH', 'RDRH')
    )
  );