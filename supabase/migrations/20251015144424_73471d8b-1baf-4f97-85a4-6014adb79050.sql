-- Attribution de tous les rôles à l'utilisateur patrick.somet@ansut.ci
-- Note: Normalement un utilisateur ne devrait avoir qu'UN seul rôle (DG étant le plus élevé)

-- Supprimer les rôles existants pour cet utilisateur (au cas où)
DELETE FROM public.user_roles 
WHERE user_id = '8e750c46-fdf1-4ea1-afb8-fc997f033704';

-- Attribuer tous les rôles disponibles
INSERT INTO public.user_roles (user_id, role) VALUES
  ('8e750c46-fdf1-4ea1-afb8-fc997f033704', 'DG'),
  ('8e750c46-fdf1-4ea1-afb8-fc997f033704', 'FINANCE'),
  ('8e750c46-fdf1-4ea1-afb8-fc997f033704', 'AGENT'),
  ('8e750c46-fdf1-4ea1-afb8-fc997f033704', 'READONLY');