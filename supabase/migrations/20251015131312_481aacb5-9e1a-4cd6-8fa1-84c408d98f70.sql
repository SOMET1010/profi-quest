-- Politique de bootstrap : permet au premier utilisateur de devenir DG
-- Cette politique est auto-limitante : elle ne fonctionne QUE si aucun DG n'existe encore
CREATE POLICY "Allow first admin self-assignment"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur s'attribue à lui-même
  auth.uid() = user_id
  -- Le rôle est DG
  AND role = 'DG'
  -- Aucun DG n'existe déjà
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'DG'
  )
);