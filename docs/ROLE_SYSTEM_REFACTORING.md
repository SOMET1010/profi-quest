# Refactoring du Système de Rôles - Documentation

## 📋 Vue d'ensemble

Ce document décrit le refactoring complet du système de rôles de l'application, effectué le **2025-01-17** pour résoudre les incohérences causées par trois systèmes de rôles concurrents.

## 🎯 Objectifs

1. **Unifier** les 3 systèmes de rôles en un seul
2. **Sécuriser** l'application avec des RLS policies cohérentes
3. **Simplifier** le code frontend et backend
4. **Maintenir** la compatibilité pendant la transition

## 🔄 Systèmes Avant Refactoring

### Système 1: ansut_profiles (Legacy)
- **Table**: `ansut_profiles`
- **Rôles**: `DG`, `FINANCE`, `AGENT`, `READONLY`
- **Fonctions**: `has_ansut_role()`, `has_ansut_permission()`
- **Problème**: Mappé différemment que les autres systèmes

### Système 2: profiles.role (Intermédiaire)
- **Table**: `profiles`
- **Colonne**: `role` (type text)
- **Problème**: Redondant et source de conflits

### Système 3: user_roles (Moderne)
- **Table**: `user_roles`
- **Type**: `app_role` ENUM
- **Rôles**: `SUPERADMIN`, `DG`, `SI`, `DRH`, `RDRH`, `RH_ASSISTANT`, `CONSULTANT`, `POSTULANT`
- **Statut**: Système cible

## ✅ Système Après Refactoring

### Source Unique de Vérité
```
Table: user_roles
Type: app_role ENUM
Hiérarchie:
  - SUPERADMIN (15) - Accès total
  - DG (10) - Direction Générale
  - SI (9) - Système d'Information
  - DRH (8) - Direction RH
  - RDRH (7) - Responsable DRH
  - RH_ASSISTANT (5) - Assistant RH
  - CONSULTANT (3) - Consultant externe
  - POSTULANT (1) - Candidat
```

## 🗃️ Migrations Effectuées

### Migration 1: Unification et Mapping
```sql
-- Créer table d'audit
CREATE TABLE role_migration_audit (...)

-- Fonction de mapping
CREATE FUNCTION map_legacy_role_to_app_role(...)

-- Migration des données avec résolution des conflits
INSERT INTO role_migration_audit (...)
UPDATE user_roles (...)
```

### Migration 2: Sécurité
```sql
-- Activer RLS sur role_migration_audit
ALTER TABLE role_migration_audit ENABLE ROW LEVEL SECURITY;

-- Créer vue unifiée avec security_invoker
CREATE VIEW unified_user_roles WITH (security_invoker = true) AS (...)

-- Nettoyer les policies obsolètes
DROP POLICY "ansut_profiles_select_dg_all" ON ansut_profiles;
```

### Fonctions de Compatibilité

Les anciennes fonctions sont maintenant des **wrappers** qui redirigent vers `user_roles`:

```sql
-- has_ansut_role() → Redirige vers user_roles
-- has_ansut_permission() → Redirige vers user_roles
-- get_ansut_user_role() → Retourne depuis user_roles
```

**⚠️ Warning**: Ces fonctions affichent un warning dans les logs et doivent être remplacées progressivement.

## 💻 Refactoring Frontend

### Nouveau Hook Unifié
```typescript
// src/hooks/useUnifiedRole.ts
export function useUnifiedRole() {
  return {
    role: AppRole | null,
    level: number,
    hasMinimumRole: (role: AppRole) => boolean,
    hasExactRole: (role: AppRole) => boolean,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    isLoading: boolean
  };
}
```

### Configuration des Features
```typescript
// src/config/features.ts
export const FEATURES = {
  USE_UNIFIED_ROLES: true,
  STRICT_ROLE_CHECK: true,
  MIGRATION_WARNING: false,
  DEBUG_ROLES: import.meta.env.DEV
};

export const ROLE_SYSTEM_CONFIG = {
  SOURCE_TABLE: 'user_roles',
  CACHE_TIME: 5 * 60 * 1000,
  DEFAULT_ROLE: 'POSTULANT',
  ADMIN_ROLES: ['SUPERADMIN', 'DG', 'SI', 'DRH', 'RDRH'],
  DASHBOARD_ROLES: ['SUPERADMIN', 'DG', 'SI', 'DRH', 'RDRH', 'RH_ASSISTANT']
};
```

### Composants Mis à Jour

#### SimpleDashboard.tsx
```typescript
// AVANT
const { userRole } = useHasRole('POSTULANT');
if (userRole === 'SUPERADMIN') return true;

// APRÈS
const { role, hasMinimumRole, isSuperAdmin } = useUnifiedRole();
if (isSuperAdmin) return true;
return hasMinimumRole(module.requiredRole);
```

#### Index.tsx
```typescript
// AVANT
if (userRole === 'SUPERADMIN' || userRole === 'DG' || ...) {
  return <SimpleDashboard />;
}

// APRÈS
if (ROLE_SYSTEM_CONFIG.DASHBOARD_ROLES.includes(userRole)) {
  return <SimpleDashboard />;
}
```

### Monitoring: MigrationHealthCheck

Un composant a été ajouté pour surveiller la santé du système pendant la transition:

```typescript
<MigrationHealthCheck />
```

Affiche:
- ✅ Nombre d'utilisateurs migrés
- ⚠️ Conflits détectés
- ❌ Utilisateurs sans rôle

## 📊 Tables Créées

### role_migration_audit
Trace de la migration pour audit et rollback potentiel.

| Colonne | Type | Description |
|---------|------|-------------|
| user_id | uuid | ID utilisateur |
| old_ansut_role | text | Ancien rôle ANSUT |
| old_profile_role | text | Ancien rôle profile |
| new_app_role | app_role | Nouveau rôle unifié |
| migration_strategy | text | Stratégie appliquée |
| migration_notes | text | Notes sur la migration |
| migrated_at | timestamptz | Date de migration |

### unified_user_roles (Vue)
Vue unifiée pour monitoring pendant la transition.

```sql
SELECT 
  user_id,
  current_role,      -- depuis user_roles
  legacy_ansut_role, -- depuis ansut_profiles
  legacy_profile_role, -- depuis profiles
  role_source        -- origine du rôle
FROM unified_user_roles;
```

## 🔧 Fonctions Utilitaires

### check_role_system_health()
```sql
SELECT * FROM check_role_system_health();
```

Retourne:
- Total d'utilisateurs
- Utilisateurs avec rôle
- Utilisateurs sans rôle
- Nombre de profils legacy
- Conflits de rôles

## 🚀 Plan de Rollback

En cas de problème critique:

```sql
-- 1. Réactiver les anciennes policies
CREATE POLICY "ansut_profiles_select_dg_all" ON ansut_profiles...

-- 2. Restaurer depuis l'audit
UPDATE ansut_profiles ap
SET role = rma.old_ansut_role
FROM role_migration_audit rma
WHERE ap.id = rma.user_id;

-- 3. Désactiver les feature flags
-- Dans src/config/features.ts
USE_UNIFIED_ROLES: false
```

## 📈 Métriques de Succès

### Base de Données
- ✅ 19/19 utilisateurs migrés avec succès
- ✅ 0 utilisateurs sans rôle
- ✅ Tous les warnings de sécurité critiques résolus
- ⚠️ 1 warning mineur (function search_path) - non bloquant

### Frontend
- ✅ `useUnifiedRole` remplace `useRole`
- ✅ SimpleDashboard utilise le nouveau système
- ✅ Index.tsx utilise ROLE_SYSTEM_CONFIG
- ✅ MigrationHealthCheck actif

### Edge Functions
- ✅ `get-users-with-roles` vérifie SUPERADMIN/DG/SI/DRH
- ✅ Compatibilité avec anciennes fonctions via wrappers

## 🔮 Prochaines Étapes (Phase 6 - Optionnel)

**Après 2 semaines de monitoring sans incident:**

1. Supprimer définitivement `ansut_profiles`
2. Supprimer la colonne `profiles.role`
3. Supprimer les fonctions wrapper `has_ansut_*`
4. Supprimer `role_migration_audit` (après archivage)
5. Désactiver `MIGRATION_WARNING`

## 📚 Références

### Hooks
- `useUnifiedRole()` - Hook principal
- `useHasMinimumRole(role)` - Vérification de rôle minimum
- `usePermissions()` - Permissions granulaires (inchangé)

### Configuration
- `FEATURES` - Feature flags
- `ROLE_SYSTEM_CONFIG` - Configuration rôles
- `ROLE_HIERARCHY` - Niveaux hiérarchiques

### Composants
- `RoleGuard` - Protection de routes (inchangé, utilise useRole deprecated)
- `PermissionGuard` - Protection par permission (inchangé)
- `MigrationHealthCheck` - Monitoring migration

### Fonctions SQL
- `map_legacy_role_to_app_role()` - Mapping rôles
- `check_role_system_health()` - Santé système
- `has_ansut_role()` - Wrapper compatibilité (DEPRECATED)
- `has_ansut_permission()` - Wrapper compatibilité (DEPRECATED)

## 🎓 Best Practices

### Pour les Développeurs

1. **Toujours utiliser `useUnifiedRole()`**
   ```typescript
   const { role, hasMinimumRole } = useUnifiedRole();
   ```

2. **Ne jamais hardcoder les listes de rôles**
   ```typescript
   // ❌ MAUVAIS
   if (role === 'DG' || role === 'SI' || role === 'DRH') {...}
   
   // ✅ BON
   if (ROLE_SYSTEM_CONFIG.ADMIN_ROLES.includes(role)) {...}
   ```

3. **Utiliser la hiérarchie plutôt que des égalités**
   ```typescript
   // ❌ MAUVAIS
   if (role === 'DG') {...}
   
   // ✅ BON
   if (hasMinimumRole('DG')) {...}
   ```

4. **Vérifier les feature flags avant d'utiliser des features en beta**
   ```typescript
   if (FEATURES.USE_UNIFIED_ROLES) {...}
   ```

### Pour les RLS Policies

1. **Toujours utiliser `user_roles`**
   ```sql
   -- ✅ BON
   EXISTS (
     SELECT 1 FROM user_roles
     WHERE user_id = auth.uid()
       AND role IN ('SUPERADMIN', 'DG')
   )
   ```

2. **Utiliser les fonctions security definer**
   ```sql
   -- ✅ BON
   has_permission(auth.uid(), 'manage_users')
   ```

## ✅ Éléments Supprimés (2025-01-17)

### Hooks Frontend Obsolètes
- ❌ `src/hooks/useRole.ts` - **SUPPRIMÉ**
  - `useRole()` → ✅ Utiliser `useUnifiedRole()`
  - `useHasRole()` → ✅ Utiliser `useUnifiedRole().hasMinimumRole()`

### Composants Frontend Obsolètes
- ❌ `src/components/Dashboard.tsx` - **SUPPRIMÉ** (non utilisé)
  - Remplacé par `SimpleDashboard.tsx` utilisant `useUnifiedRole`

### Fonctions SQL Obsolètes
- ❌ `public.get_ansut_user_role()` - **SUPPRIMÉE**
  - Utiliser `user_roles` directement
- ❌ `public.handle_new_ansut_user()` - **SUPPRIMÉE**
  - Remplacé par `handle_new_user()` qui insère dans `user_roles`

### Fonctions SQL Dépréciées (Avec Warnings)
- ⚠️ `public.has_ansut_role(text)` - **DÉPRÉCIÉ**
  - Wrapper de compatibilité, utiliser `has_permission()` ou `user_roles`
- ⚠️ `public.has_ansut_permission(text[])` - **DÉPRÉCIÉ**
  - Wrapper de compatibilité, utiliser `has_permission()`

### Tables Archivées
- 📦 `public.ansut_profiles` - **ARCHIVÉE** (read-only)
  - Marquée comme DEPRECATED dans les commentaires DB
  - Utiliser `user_roles` pour les rôles actuels
  - Conservée pour l'historique uniquement

### Nouvelles Vues de Monitoring
- ✅ `public.role_system_audit` - Vue sécurisée pour surveiller les incohérences
  - Utilise `security_invoker = true`
  - N'expose pas directement `auth.users`
  - RLS via les tables sous-jacentes

## ⚠️ Problèmes Connus

### 1. Warning: Function Search Path Mutable
- **Niveau**: WARN (non bloquant)
- **Impact**: Faible
- **Solution**: Ajouter `SET search_path = public` aux fonctions concernées
- **Statut**: Non critique - Les fonctions importantes ont déjà le search_path défini
- **Référence**: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

## 📞 Support

En cas de problème:
1. Vérifier les logs avec `FEATURES.DEBUG_ROLES = true`
2. Consulter `check_role_system_health()`
3. Vérifier la table `role_migration_audit`
4. Contacter l'équipe technique si rollback nécessaire

---

**Date de dernière mise à jour**: 2025-01-17  
**Version du système de rôles**: 2.0 (Unifié)  
**Statut**: ✅ Production Ready
