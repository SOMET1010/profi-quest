-- Créer une politique qui permet au premier utilisateur de devenir admin
-- Si aucun admin n'existe, permettre l'insertion

-- D'abord, supprimer la politique existante qui empêche l'insertion
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Créer une nouvelle politique qui permet l'insertion d'admin si aucun admin n'existe
CREATE POLICY "Allow first admin creation"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Permettre l'insertion d'un rôle admin si aucun admin n'existe
  (role = 'admin' AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ))
  OR
  -- Ou si l'utilisateur est déjà admin
  has_role(auth.uid(), 'admin'::app_role)
);

-- Politique pour permettre l'insertion d'autres rôles par les admins
CREATE POLICY "Admins can insert other roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role != 'admin' AND has_role(auth.uid(), 'admin'::app_role)
);