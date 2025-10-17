# 🎓 Base de données QUALI-RH EXPERTS - ANSUT

**Date de mise à jour** : 17 janvier 2025  
**Version** : 2.0 (Post-nettoyage financier)

---

## 🎯 Objectif du système

Plateforme de gestion des **candidatures d'experts** pour les missions et projets ANSUT (Agence Nationale du Service Universel des Télécommunications de Côte d'Ivoire).

---

## 📊 Architecture générale

### 🟢 Tables actives (17 tables)

#### **1. Gestion des utilisateurs et candidats** 👥

| Table | Rôle | Lignes (estimation) |
|-------|------|---------------------|
| `ansut_profiles` | Administrateurs ANSUT (gestionnaires RH) | 3 |
| `profiles` | Pool de talents / candidatures d'experts | ~50 |
| `employees` | Base de données RH interne ANSUT | 10 |

**Hiérarchie des rôles ANSUT** :
- **DG (4)** : Directeur Général - Accès complet
- **FINANCE (3)** : Gestionnaire admin/RH - Gestion complète
- **AGENT (2)** : Agent de saisie - Lecture + ajout de données
- **READONLY (1)** : Consultation uniquement

**Modèle de candidature** :
- `profiles.application_status` : `draft`, `submitted`, `reviewed`, `approved`, `rejected`
- Fichiers attachés : `motivation_letter_url`, `diplomas_url`, `certificates_url`
- Compétences : `technical_skills`, `behavioral_skills`
- Expérience : `experience_years`, `hourly_rate`

---

#### **2. Workflow RH et gestion administrative** 📬

| Table | Rôle | Usage |
|-------|------|-------|
| `courriers_memos` | Courriers et notes de service RH | Suivi des correspondances |
| `diligences` | Suivi des actions et tâches RH | Échéances, responsables, statuts |

**États des diligences** : `a_realiser`, `en_cours`, `termine`  
**Priorités** : `normale`, `urgente`, `critique`

---

#### **3. Structure organisationnelle ANSUT** 🏢

| Table | Rôle | Relations |
|-------|------|-----------|
| `directions` | Directions de l'ANSUT | Contient `programmes` |
| `programmes` | Programmes organisationnels | Contient `projets_hierarchiques` |
| `projets_hierarchiques` | Projets stratégiques ANSUT | Contient `activites` |
| `activites` | Activités détaillées des projets | Assignation employés |

**Axes stratégiques** :
1. Infrastructure de base numérique
2. Services numériques essentiels
3. Compétence numérique citoyenne
4. Gouvernance et excellence opérationnelle

---

#### **4. Audit, logs et traçabilité** 🔍

| Table | Rôle | Rétention |
|-------|------|-----------|
| `audit_logs` | Traçabilité complète (INSERT/UPDATE/DELETE) | Infinie |
| `error_logs` | Logs d'erreurs système | 90 jours |
| `events_ledger` | Journal d'événements immuable | Infinie |
| `activity_log` | Journal d'activité projets | 1 an |
| `user_activity_logs` | Logs d'activité utilisateurs | 1 an |

---

#### **5. Statistiques et KPI** 📊

| Table | Rôle | Rafraîchissement |
|-------|------|------------------|
| `kpi_data` | Indicateurs de performance | Quotidien |
| `app_settings` | Configuration système | Manuel |

---

## 🗑️ Tables supprimées (Cleanup 2025-01-17)

### **Phase 1 : Cleanup initial (10 janvier 2025)**
- ❌ `campaigns` (jamais implémentée)
- ❌ `user_profiles` (KYC non utilisé - Ballerine jamais intégré)
- ❌ `kyc_workflows` (KYC non utilisé)
- ❌ `projects`, `projets` (doublons)
- ❌ `users` (doublon de `ansut_profiles`)
- ❌ `user_roles` (remplacée par `ansut_profiles.role`)

### **Phase 2 : Cleanup financier (17 janvier 2025)** 💰❌

**Raison** : Ces tables provenaient d'une **ancienne base de gestion financière** et n'ont **AUCUN lien** avec la gestion RH / candidatures d'experts.

| Table supprimée | Lignes | Raison |
|----------------|--------|--------|
| `cheques` | 1,509 | Gestion de chèques bancaires (hors RH) |
| `fournisseurs` | 555 | Gestion de fournisseurs (hors RH) |
| `virements` | 4 | Gestion de virements bancaires (hors RH) |
| `factures` + `facture_lignes` | 0 | Système de facturation (jamais utilisé) |
| `virement_lignes` | 0 | Détails virements (hors RH) |
| `journaux_bancaires` | 0 | Journaux bancaires (hors RH) |
| `cheques_status_corrections` | 0 | Audit corrections chèques (hors RH) |
| `staging_imports` | 1 | Imports de données financières uniquement |
| `staging_import_rows` | 1,509 | Lignes d'imports financiers uniquement |
| `debug_sessions` | 0 | Sessions de debug imports financiers |

**Vues supprimées** :
- ❌ `mv_cheques_kpi` (KPI chèques)
- ❌ `mv_import_performance` (Performance imports financiers)
- ❌ `v_cheques_status_corrections_summary` (Audit chèques)

**Types enum supprimés** :
- ❌ `cheque_status` (EN_ATTENTE, SIGNE, RETIRE)
- ❌ `fournisseur_status` (ACTIF, INACTIF, SUSPENDU)
- ❌ `import_status` (PENDING, PROCESSING, COMPLETED, FAILED)
- ❌ `import_type` (CHEQUES, FOURNISSEURS, VIREMENTS)
- ❌ `row_status` (PENDING, OK, FAILED)

**Fonctions supprimées** (15 fonctions) :
- Gestion chèques : `maintain_cheque_status_consistency()`, `check_cheques_consistency()`, `refresh_cheques_kpi()`
- Recherche fournisseurs : `fuzzy_search_fournisseurs()`, `detect_duplicates()`
- Import financier : `deduplicate_import_rows()`, `apply_default_values()`, `reset_stuck_import()`, `retry_import()`, `manual_process_import()`, `trigger_import_processing()`, `cleanup_old_imports()`, `get_import_statistics()`, `refresh_import_performance_stats()`, `optimize_import_performance()`, `validate_import_data()`

---

## 📊 Bilan du nettoyage

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| **Tables** | 28 | 17 | -39% |
| **Lignes de données** | ~4,100 | ~2,030 | -51% |
| **Types enum** | 9 | 4 | -56% |
| **Fonctions** | 35 | 20 | -43% |
| **Vues matérialisées** | 2 | 0 | -100% |
| **Taille DB estimée** | ~250 MB | ~100 MB | -60% |

**Résultat** : Base de données **2x plus légère** et **100% orientée RH** ✅

---

## 🔒 Sécurité et RLS

### **Politique générale**
- ✅ RLS activé sur **TOUTES** les tables sensibles
- ✅ Fonction `has_ansut_role()` pour vérification des permissions
- ✅ Audit trail complet via `audit_logs`
- ✅ Pas de stockage client-side des rôles (protection contre escalade de privilèges)

### **Hiérarchie des permissions**

| Rôle | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| DG | ✅ Toutes tables | ✅ Toutes tables | ✅ Toutes tables | ✅ Toutes tables |
| FINANCE | ✅ Toutes tables | ✅ Sauf `ansut_profiles` | ✅ Sauf rôles | ❌ |
| AGENT | ✅ Toutes tables | ✅ Données RH | ⚠️ Données propres | ❌ |
| READONLY | ✅ Toutes tables | ❌ | ❌ | ❌ |

---

## 🚀 Fonctionnalités RH disponibles

### ✅ Implémenté
1. **Gestion des candidatures**
   - Formulaire de candidature (`/candidature`)
   - Upload de documents (lettre motivation, diplômes, certificats)
   - Statuts de candidature (draft → submitted → reviewed → approved/rejected)
   
2. **Base de données experts**
   - Consultation des profils (`/database`)
   - Recherche et filtres
   - Export de données
   
3. **Gestion des utilisateurs ANSUT**
   - Attribution de rôles (`/role-management`)
   - Gestion des permissions
   - Edge function `get-users-with-roles`
   
4. **Workflow administratif**
   - Suivi des courriers et mémos
   - Gestion des diligences (actions à réaliser)
   - Assignation de responsables

### ⏳ En attente d'implémentation
1. **Campagnes de recrutement**
   - Création de missions
   - Publication d'appels à candidatures
   - Matching automatique candidats/missions
   
2. **Imports Excel de CVthèques**
   - Page `/import-profiles` existe mais non fonctionnelle
   - Nécessite nouveau système d'import RH
   
3. **Analytics avancées**
   - Tableaux de bord détaillés
   - Statistiques de recrutement
   - Rapports d'activité

---

## 📖 Guides de développement

### **Ajouter une nouvelle fonctionnalité RH**
1. Vérifier si une table existante peut contenir les données
2. Si besoin de nouvelle table :
   - Créer migration SQL avec `supabase--migration`
   - Ajouter RLS policies adaptées
   - Mettre à jour `src/integrations/supabase/types.ts` (auto-généré)
3. Créer le hook React Query (`src/hooks/use*.ts`)
4. Créer le composant UI (`src/pages/*.tsx`)
5. Mettre à jour la documentation

### **Principes de sécurité**
- ✅ TOUJOURS activer RLS sur les nouvelles tables
- ✅ TOUJOURS utiliser `has_ansut_role()` dans les policies
- ✅ NE JAMAIS stocker de rôles en client-side
- ✅ TOUJOURS valider les données côté serveur (edge functions)

---

## 🔗 Références

- **Projet Lovable** : [https://lovable.dev/projects/0f4c3144-2a0c-4cca-b2ae-d9bde3473947](https://lovable.dev/projects/0f4c3144-2a0c-4cca-b2ae-d9bde3473947)
- **Supabase Dashboard** : [https://supabase.com/dashboard/project/fuqijxcyudibacaatgpj](https://supabase.com/dashboard/project/fuqijxcyudibacaatgpj)
- **Documentation Lovable** : [https://docs.lovable.dev/](https://docs.lovable.dev/)

---

**Dernière mise à jour** : 17 janvier 2025  
**Responsable technique** : Équipe ANSUT Digital  
**Contact** : support@ansut.ci
