# 🚀 Guide de Migration - Système de Rôles Unifié

**Date de création** : 2025-01-17  
**Statut** : ✅ Migration complète

---

## 📋 Pour les Développeurs

### ⚠️ NE PLUS UTILISER

#### Hooks Obsolètes
```typescript
// ❌ OBSOLÈTE - Ne plus utiliser
import { useRole, useHasRole } from "@/hooks/useRole";
const { data: userRole } = useRole();
const { hasRole } = useHasRole('DG');

// ✅ NOUVEAU - Utiliser à la place
import { useUnifiedRole } from "@/hooks/useUnifiedRole";
const { role: userRole, hasMinimumRole, isSuperAdmin } = useUnifiedRole();
const isDG = hasMinimumRole('DG');
```

#### Fonctions SQL Obsolètes
```sql
-- ❌ OBSOLÈTE - Ne plus utiliser
SELECT get_ansut_user_role();
SELECT has_ansut_role('DG');
SELECT has_ansut_permission(ARRAY['DG', 'FINANCE']);

-- ✅ NOUVEAU - Utiliser à la place
SELECT role FROM user_roles WHERE user_id = auth.uid();
SELECT has_permission(auth.uid(), 'manage_jobs');
```

#### Tables Obsolètes
```sql
-- ❌ OBSOLÈTE - Ne plus utiliser pour les rôles
SELECT role FROM ansut_profiles WHERE id = auth.uid();
SELECT role FROM profiles WHERE id = auth.uid();

-- ✅ NOUVEAU - Source unique de vérité
SELECT role FROM user_roles WHERE user_id = auth.uid();
```

---

## 🔧 Comment Migrer Votre Code

### 1. Migration des Hooks React

**Avant** :
```typescript
import { useHasRole } from "@/hooks/useRole";

const MyComponent = () => {
  const { hasRole: isDG, isLoading } = useHasRole('DG');
  const { hasRole: isDRH } = useHasRole('DRH');
  
  if (isDG || isDRH) {
    return <AdminPanel />;
  }
  
  return <UserView />;
};
```

**Après** :
```typescript
import { useUnifiedRole } from "@/hooks/useUnifiedRole";

const MyComponent = () => {
  const { hasMinimumRole, isLoading } = useUnifiedRole();
  
  if (hasMinimumRole('DRH')) { // DRH inclut automatiquement DG et SUPERADMIN
    return <AdminPanel />;
  }
  
  return <UserView />;
};
```

### 2. Migration des Composants

**Avant** :
```typescript
const modules = allModules.filter(module => {
  if (userRole === 'DG') return true;
  if (userRole === 'FINANCE' && module.requiredRole !== 'DG') return true;
  return false;
});
```

**Après** :
```typescript
import { useUnifiedRole } from "@/hooks/useUnifiedRole";

const modules = allModules.filter(module => {
  if (isSuperAdmin) return true; // SUPERADMIN voit tout
  return hasMinimumRole(module.requiredRole);
});
```

### 3. Migration des Politiques RLS

**Avant** :
```sql
CREATE POLICY "DG can manage"
ON public.some_table
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM ansut_profiles
    WHERE id = auth.uid() AND role = 'DG'
  )
);
```

**Après** :
```sql
CREATE POLICY "DG can manage"
ON public.some_table
FOR ALL
USING (
  has_permission(auth.uid(), 'manage_resource')
  -- OU si vous voulez vérifier un rôle spécifique :
  -- EXISTS (
  --   SELECT 1 FROM user_roles
  --   WHERE user_id = auth.uid() AND role = 'DG'
  -- )
);
```

---

## 📊 Monitoring de la Migration

### Vérifier la Santé du Système
```sql
-- Vérifier que tous les utilisateurs ont un rôle
SELECT * FROM check_role_system_health();

-- Vue d'audit détaillée
SELECT * FROM role_system_audit WHERE status != 'OK';

-- Compter les utilisateurs sans rôle
SELECT COUNT(*) FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE ur.role IS NULL;
```

### Tests Recommandés

#### Frontend
- [ ] Tester la connexion avec chaque rôle
- [ ] Vérifier l'accès au dashboard pour les rôles admin
- [ ] Tester le sidebar (modules visibles par rôle)
- [ ] Vérifier la gestion des rôles (`/admin/roles`)
- [ ] Tester les permissions spéciales (attribution de rôles, etc.)

#### Backend
- [ ] Vérifier les RLS policies sur toutes les tables
- [ ] Tester les Edge Functions avec différents rôles
- [ ] Vérifier les permissions custom (`user_permissions`)
- [ ] Tester l'assignation de rôles

---

## 🎯 Nouveaux Patterns à Utiliser

### 1. Vérification de Rôle Minimum
```typescript
// Vérifie si l'utilisateur a AU MOINS le rôle spécifié
const { hasMinimumRole } = useUnifiedRole();

if (hasMinimumRole('DRH')) {
  // Accessible par DRH, RDRH, DG, SI, SUPERADMIN
}
```

### 2. Vérification de Rôle Exact
```typescript
// Vérifie si l'utilisateur a EXACTEMENT ce rôle
const { hasExactRole } = useUnifiedRole();

if (hasExactRole('POSTULANT')) {
  // Uniquement POSTULANT
}
```

### 3. Vérification Admin
```typescript
// Vérifie si l'utilisateur est admin (DRH ou supérieur)
const { isAdmin, isSuperAdmin } = useUnifiedRole();

if (isSuperAdmin) {
  // Accès total
} else if (isAdmin) {
  // Accès admin limité
}
```

### 4. Configuration Centralisée
```typescript
import { ROLE_SYSTEM_CONFIG } from "@/config/features";

// Utiliser les constantes centralisées
const isDashboardUser = ROLE_SYSTEM_CONFIG.DASHBOARD_ROLES.includes(role);
const isAdminUser = ROLE_SYSTEM_CONFIG.ADMIN_ROLES.includes(role);
```

---

## 🔐 Bonnes Pratiques de Sécurité

### ❌ À Éviter
```typescript
// Hardcoder les hiérarchies de rôles
if (role === 'DG' || role === 'FINANCE' || role === 'AGENT') { }

// Utiliser plusieurs sources de vérité
const roleFromProfile = profile.role;
const roleFromAnsut = ansutProfile.role;

// Vérifier les rôles côté client uniquement
if (localStorage.getItem('userRole') === 'admin') { }
```

### ✅ Recommandé
```typescript
// Utiliser la hiérarchie centralisée
import { ROLE_HIERARCHY } from "@/hooks/useUnifiedRole";
if (ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY['DRH']) { }

// Source unique de vérité
const { role } = useUnifiedRole();

// Toujours vérifier côté serveur (RLS + fonctions)
CREATE POLICY ... USING (has_permission(auth.uid(), 'permission_code'));
```

---

## 📚 Ressources

### Fichiers Clés
- **Hook principal** : `src/hooks/useUnifiedRole.ts`
- **Configuration** : `src/config/features.ts`
- **Documentation** : `docs/ROLE_SYSTEM_REFACTORING.md`

### Fonctions Utiles
- `has_permission(user_id, permission_code)` : Vérifier une permission
- `is_superadmin(user_id)` : Vérifier si SUPERADMIN
- `check_admin_role(user_id)` : Vérifier si admin (DG, SI, DRH)
- `check_role_system_health()` : Monitoring du système

### Vues Utiles
- `role_system_audit` : Audit des incohérences
- `unified_user_roles` : Vue unifiée des rôles (legacy + current)

---

## 🆘 Support

### Erreurs Courantes

#### "User has no role"
```typescript
// Vérifier que l'utilisateur a un rôle dans user_roles
SELECT * FROM user_roles WHERE user_id = 'user-id';

// Si absent, assigner un rôle par défaut
INSERT INTO user_roles (user_id, role)
VALUES ('user-id', 'POSTULANT');
```

#### "Permission denied"
```sql
-- Vérifier les permissions de l'utilisateur
SELECT * FROM get_user_permissions('user-id');

-- Vérifier les RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'your_table';
```

#### "hasMinimumRole returns false unexpectedly"
```typescript
// Vérifier le rôle actuel et la hiérarchie
const { role, level } = useUnifiedRole();
console.log('Current role:', role, 'Level:', level);
console.log('Required level:', ROLE_HIERARCHY['DRH']);
```

---

**Dernière mise à jour** : 2025-01-17  
**Prochaine révision** : Après 2 semaines en production (Phase 6 optionnelle)
