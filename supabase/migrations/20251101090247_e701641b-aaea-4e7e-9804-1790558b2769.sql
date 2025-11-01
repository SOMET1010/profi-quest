-- CORRECTION SUPERADMIN : Ajout de toutes les permissions
-- Le SUPERADMIN doit avoir accès à toutes les fonctionnalités

-- Ajouter toutes les permissions disponibles pour le rôle SUPERADMIN
INSERT INTO role_default_permissions (role_code, permission_code)
SELECT 
  'SUPERADMIN'::app_role,
  code
FROM permissions
WHERE NOT EXISTS (
  SELECT 1 FROM role_default_permissions 
  WHERE role_code = 'SUPERADMIN'::app_role 
  AND permission_code = permissions.code
);

-- Vérification : SUPERADMIN doit avoir 26 permissions
-- SELECT COUNT(*) FROM role_default_permissions WHERE role_code = 'SUPERADMIN';