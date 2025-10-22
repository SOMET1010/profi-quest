-- Sécurisation de la table courriers_memos (correction)
-- Problème: Tous les utilisateurs authentifiés peuvent lire/modifier/créer des courriers

-- Supprimer les policies dangereuses
DROP POLICY IF EXISTS "Authenticated users can view all courriers_memos" ON courriers_memos;
DROP POLICY IF EXISTS "Authenticated users can create courriers_memos" ON courriers_memos;
DROP POLICY IF EXISTS "Authenticated users can update courriers_memos" ON courriers_memos;

-- Policy: Voir les courriers dont on est responsable ou si DG
CREATE POLICY "Users see assigned correspondence"
  ON courriers_memos FOR SELECT
  USING (
    responsable_id = auth.uid() 
    OR has_ansut_role('DG')
  );

-- Policy: Seuls DG et agents autorisés peuvent créer des courriers
CREATE POLICY "Authorized users can create correspondence"
  ON courriers_memos FOR INSERT
  WITH CHECK (
    has_ansut_role('DG')
    OR has_ansut_role('AGENT')
  );

-- Policy: Responsable et DG peuvent modifier
CREATE POLICY "Responsible and DG can update correspondence"
  ON courriers_memos FOR UPDATE
  USING (
    responsable_id = auth.uid()
    OR has_ansut_role('DG')
  );