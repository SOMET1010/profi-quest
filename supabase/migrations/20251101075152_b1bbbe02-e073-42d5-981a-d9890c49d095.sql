-- ============================================
-- CORRECTION 3 : Protection PII ansut_profiles
-- ============================================

-- Supprimer la politique permissive qui expose les PII
DROP POLICY IF EXISTS "ansut_profiles_select_authorized_roles" ON ansut_profiles;

-- Créer une politique restrictive : seul le propriétaire ou DG peut voir les PII
CREATE POLICY "Users view own profile or DG views all"
ON ansut_profiles
FOR SELECT
TO public
USING (
  auth.uid() = id           -- L'utilisateur voit son propre profil
  OR has_ansut_role('DG')  -- Le DG voit tous les profils
);