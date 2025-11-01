-- ============================================
-- ÉTAPE 1/2 : Ajout de SUPERADMIN à l'enum app_role
-- ============================================
-- Cette migration doit être exécutée en premier
-- La valeur enum doit être commitée avant utilisation

ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'SUPERADMIN';