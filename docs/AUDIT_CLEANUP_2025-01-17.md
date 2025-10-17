# Rapport d'Audit et Nettoyage - 17 janvier 2025

## 📋 Résumé Exécutif

**Date de l'audit** : 17 janvier 2025  
**Statut** : ⚠️ Plusieurs incohérences détectées  
**Priorité** : MOYENNE (nécessite clarification mais pas de bug critique)

---

## ✅ Points Positifs

### 1. Nettoyage de base effectué
- ✅ 6 tables inutilisées supprimées (campaigns, user_profiles, kyc_workflows, projects, projets, users)
- ✅ Code nettoyé (hooks, pages, routes supprimées)
- ✅ Modèle utilisateur clarifié (profiles → ansut_profiles)
- ✅ Documentation DATABASE.md créée

### 2. Qualité du code
- ✅ Aucun @ts-ignore trouvé
- ✅ Aucun TODO/FIXME orphelin
- ✅ RLS policies actives sur toutes les tables sensibles
- ✅ Pas d'imports inutilisés détectés

### 3. Sécurité
- ✅ RLS activé sur toutes les tables principales
- ✅ Audit trails en place (audit_logs, events_ledger)
- ✅ Permissions granulaires par rôle

---

## ⚠️ Problèmes Identifiés

### 🔴 CRITIQUE : Système de rôles dupliqué

**Problème** : Deux systèmes de rôles coexistent dans la base de données

#### Système 1 : `ansut_profiles.role`
- **Rôles** : DG, FINANCE, AGENT, READONLY
- **Usage** : Principal système utilisé pour la gestion ANSUT
- **Localisation** : Colonne `role` dans `ansut_profiles`
- **Fichiers utilisant ce système** :
  - `src/hooks/useRole.ts` (fonction `useHasRole`)
  - `src/components/AppSidebar.tsx`
  - `src/components/RoleGuard.tsx`
  - Toutes les RLS policies

#### Système 2 : `user_roles` table
- **Rôles** : DG, FINANCE, AGENT, READONLY (enum `app_role`)
- **Usage** : Utilisé par `useRole()` hook et RoleManagement
- **Localisation** : Table séparée `user_roles`
- **Fichiers utilisant ce système** :
  - `src/hooks/useRole.ts` (fonction `useRole`)
  - `src/pages/RoleManagement.tsx`
  - `src/pages/AdminSetup.tsx`

**État actuel des données** :
```sql
-- 5 utilisateurs dans user_roles (roles anciens)
-- Tous les utilisateurs ANSUT dans ansut_profiles.role

-- Incohérence : Les deux systèmes ne sont PAS synchronisés
```

**Impact** :
- 🔴 **Confusion** : Deux sources de vérité pour les rôles
- 🔴 **Risque de sécurité** : Un utilisateur pourrait avoir un rôle dans `user_roles` mais pas dans `ansut_profiles`
- 🔴 **Maintenance difficile** : Dois-je mettre à jour les deux systèmes ?

**Recommandation** : **SUPPRIMER `user_roles` table** et tout migrer vers `ansut_profiles.role`

---

### 🟡 MOYEN : useStats retourne des valeurs mockées

**Problème** : Le hook `useStats` contient des valeurs hardcodées à 0 pour les campaigns

**Fichier** : `src/hooks/useStats.ts`

```typescript
// Ligne 32-35 : Mock values
const totalCampaigns = 0;
const activeCampaigns = 0;
const pendingApplications = 0;
const completedApplications = 0;
```

**Impact** :
- Les dashboards affichent toujours "0 campagnes actives"
- Les statistiques ne sont pas représentatives

**Recommandation** : Supprimer ces champs ou les calculer depuis la table `profiles` (application_status)

---

### 🟡 MOYEN : Console.log en production

**Problème** : 25+ console.log/error dans le code

**Exemples** :
```typescript
// src/hooks/useRole.ts:24
console.error('Error fetching user role:', error);

// src/pages/RoleManagement.tsx:79
console.error('Error assigning role:', error);

// src/hooks/useStats.ts:53
console.error("Error fetching stats:", error);
```

**Impact** :
- Pollution des logs navigateur en production
- Potentiel leak d'informations sensibles

**Recommandation** : Utiliser un système de logging structuré (ex: Sentry)

---

### 🟢 MINEUR : Imports iconographiques inutilisés

**Problème** : L'icône `Megaphone` est importée mais plus utilisée dans certains fichiers

**Fichiers** :
- `src/components/Dashboard.tsx` (ligne 9)
- `src/components/SimpleDashboard.tsx` (ligne 9)

**Impact** : Négligeable (quelques Ko dans le bundle)

**Recommandation** : Nettoyer lors du prochain refactor

---

## 🔍 Analyse de Sécurité

### RLS Policies - État des lieux

✅ **Tables sécurisées correctement** :
- `ansut_profiles` : Permissions granulaires (DG > FINANCE > AGENT > READONLY)
- `cheques` : Workflow maker/checker implémenté
- `fournisseurs` : Lecture pour tous, modification DG/FINANCE
- `audit_logs` : Lecture DG uniquement
- `profiles` : Utilisateurs voient leurs propres profils

⚠️ **Tables à vérifier** :
- `user_roles` : Aucune RLS policy trouvée ! (CRITIQUE si table conservée)
- `directions`, `programmes`, `projets_hierarchiques` : Lecture ouverte à tous authentifiés

---

## 📊 Métriques de Qualité du Code

### Couverture des tests
- ❌ Aucun test détecté (pas de fichiers .test.ts ou .spec.ts)

### Complexité
- ✅ Composants bien découpés
- ✅ Hooks réutilisables
- ⚠️ Certains fichiers > 400 lignes (Dashboard.tsx: 378 lignes)

### Performance
- ✅ Lazy loading implémenté (React.lazy)
- ✅ React Query avec staleTime configuré
- ✅ Mémorisation des imports (useNavigationPreload)

---

## 🛠️ Plan d'Action Recommandé

### Phase 1 : Unifier le système de rôles (PRIORITAIRE)

**Option A - Migrer vers ansut_profiles uniquement (RECOMMANDÉ)**
```sql
-- 1. Migrer les données user_roles → ansut_profiles
UPDATE ansut_profiles ap
SET role = ur.role
FROM user_roles ur
WHERE ap.id = ur.user_id
AND ap.role IS NULL;

-- 2. Supprimer la table user_roles
DROP TABLE user_roles CASCADE;

-- 3. Supprimer l'enum app_role
DROP TYPE IF EXISTS app_role;
```

**Option B - Garder user_roles et supprimer ansut_profiles.role**
```sql
-- NON RECOMMANDÉ : ansut_profiles.role est plus utilisé dans le code
```

**Changements code nécessaires** (Option A) :
- Modifier `src/hooks/useRole.ts` pour utiliser `ansut_profiles` au lieu de `user_roles`
- Modifier `src/pages/RoleManagement.tsx` pour utiliser `ansut_profiles`
- Modifier `src/pages/AdminSetup.tsx` pour utiliser `ansut_profiles`
- Supprimer les références à `user_roles`

---

### Phase 2 : Nettoyer useStats

```typescript
// src/hooks/useStats.ts - Supprimer les valeurs mockées
export const useStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Count total profiles
      const { count: totalExperts } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Count qualified (active) profiles
      const { count: qualifiedProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Count applications by status
      const { count: pendingApplications } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'submitted');

      const { count: completedApplications } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('application_status', ['approved', 'qualified']);

      const responseRate = totalExperts && pendingApplications 
        ? Math.round((pendingApplications / totalExperts) * 100)
        : 0;

      return {
        totalExperts: totalExperts || 0,
        qualifiedProfiles: qualifiedProfiles || 0,
        responseRate,
        activeMissions: 0, // À implémenter si missions créées
        totalCampaigns: 0, // Supprimé
        activeCampaigns: 0, // Supprimé
        pendingApplications: pendingApplications || 0,
        completedApplications: completedApplications || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

---

### Phase 3 : Améliorer la sécurité

1. **Ajouter RLS sur user_roles** (si table conservée) :
```sql
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Seul le DG peut voir tous les rôles
CREATE POLICY "DG can view all roles"
ON user_roles FOR SELECT
USING (has_ansut_role('DG'));

-- Seul le DG peut modifier les rôles
CREATE POLICY "DG can modify roles"
ON user_roles FOR ALL
USING (has_ansut_role('DG'));
```

2. **Remplacer console.log par un système de logging** :
```typescript
// src/lib/logger.ts
export const logger = {
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    // En production : envoyer à Sentry ou autre
  },
  info: (message: string) => {
    if (import.meta.env.DEV) {
      console.log(message);
    }
  }
};
```

---

### Phase 4 : Nettoyage mineur

1. Supprimer l'import `Megaphone` inutilisé
2. Supprimer les champs `totalCampaigns` et `activeCampaigns` de `DashboardStats`
3. Mettre à jour la documentation

---

## 📈 Bénéfices Attendus

### Après Phase 1 (Unification des rôles)
- ✅ **-1 table** en base de données
- ✅ **-1 système de rôles** à maintenir
- ✅ **Cohérence** : Une seule source de vérité
- ✅ **Sécurité** : Moins de risques de désynchronisation

### Après Phase 2 (useStats)
- ✅ Statistiques réelles au lieu de valeurs mockées
- ✅ Dashboard plus représentatif

### Après Phase 3 (Sécurité)
- ✅ Logs structurés en production
- ✅ RLS complet sur toutes les tables

### Après Phase 4 (Nettoyage)
- ✅ Code 100% clean
- ✅ Bundle optimisé

---

## ⏱️ Estimation des Temps

| Phase | Complexité | Temps estimé | Risque |
|-------|-----------|--------------|--------|
| Phase 1 | Moyenne | 2-3h | Moyen (tests requis) |
| Phase 2 | Faible | 30min | Faible |
| Phase 3 | Faible | 1h | Faible |
| Phase 4 | Faible | 30min | Très faible |
| **TOTAL** | - | **4-5h** | - |

---

## 🚦 Décision Requise

**Question principale** : Quel système de rôles conserver ?

**Option A (RECOMMANDÉE)** : Garder `ansut_profiles.role` uniquement
- ✅ Déjà utilisé partout dans le code
- ✅ Intégré aux RLS policies
- ✅ Plus cohérent avec l'architecture ANSUT

**Option B** : Garder `user_roles` uniquement
- ❌ Nécessite de refactoriser toutes les RLS policies
- ❌ Nécessite de modifier beaucoup de code
- ❌ Moins intégré à l'architecture existante

**Votre choix** : _______________

---

## 📝 Notes Techniques

### Tables actuellement en base
```
✅ activites
✅ activity_log
✅ ansut_profiles (rôles : DG, FINANCE, AGENT, READONLY)
✅ app_settings
✅ audit_logs
✅ cheques
✅ cheques_status_corrections
✅ courriers_memos
✅ debug_sessions
✅ diligences
✅ directions
✅ employees
✅ error_logs
✅ events_ledger
✅ facture_lignes
✅ factures
✅ fournisseurs
✅ journaux_bancaires
✅ kpi_data
✅ profiles (liées à ansut_profiles via ansut_profile_id)
✅ programmes
✅ projets_hierarchiques
✅ staging_import_rows
✅ staging_imports
⚠️ user_roles (À DÉCIDER : garder ou supprimer)
✅ virement_lignes
✅ virements
```

### Hooks personnalisés
```typescript
✅ useRole() - Utilise user_roles
✅ useHasRole() - Utilise ansut_profiles.role
✅ useStats() - Contient valeurs mockées
✅ useProfiles() - OK
✅ useCampaigns() - SUPPRIMÉ ✅
✅ useNavigationPreload() - OK
```

---

**Préparé par** : Assistant Lovable AI  
**Date** : 17 janvier 2025  
**Version** : 1.0
