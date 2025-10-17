# Base de données ANSUT - Architecture simplifiée

> **Date du nettoyage** : 2025-01-17  
> **Objectif** : Clarification et simplification de l'architecture

---

## 📊 Vue d'ensemble

Cette base de données supporte le système de gestion RH et financière de l'ANSUT (Agence Nationale du Service Universel des Télécommunications) en Côte d'Ivoire.

---

## 👥 Gestion des utilisateurs

### `ansut_profiles` (Table principale)
**Rôle** : Utilisateurs ANSUT avec gestion des rôles et permissions

**Colonnes clés** :
- `id` : UUID (référence auth.users)
- `email` : Email unique
- `full_name` : Nom complet
- `role` : Rôle système (DG, FINANCE, AGENT, READONLY)
- `is_active` : Statut actif/inactif

**RLS** : Chaque rôle a des permissions spécifiques définies par des policies dédiées

---

### `profiles` (Extension pour candidatures)
**Rôle** : Profils d'experts et candidatures

**Colonnes clés** :
- `id` : UUID principal
- `ansut_profile_id` : FK vers `ansut_profiles` (lien avec les utilisateurs ANSUT)
- `first_name`, `last_name` : Nom/prénom du candidat
- `email` : Email du candidat
- `location` : Localisation
- `experience_years` : Années d'expérience
- `hourly_rate` : Taux horaire
- `technical_skills` : Compétences techniques
- `behavioral_skills` : Compétences comportementales
- `motivation_letter_url` : URL lettre de motivation
- `diplomas_url` : URL diplômes
- `certificates_url` : URL certificats
- `application_status` : Statut candidature (draft, submitted, etc.)
- `application_submitted_at` : Date soumission

**RLS** : Les candidats peuvent voir/modifier leurs propres profils

---

## 💰 Système financier

### `cheques` (1,509 enregistrements)
**Rôle** : Gestion des chèques

**Colonnes clés** :
- `numero` : Numéro de chèque
- `montant` : Montant
- `statut` : EN_ATTENTE, SIGNE, RETIRE
- `date_signature` : Date signature DG
- `date_retrait` : Date retrait
- `fournisseur_id` : FK vers fournisseurs

**Workflow** :
1. FINANCE/AGENT crée le chèque (EN_ATTENTE)
2. DG signe (SIGNE)
3. Bénéficiaire retire (RETIRE)

**RLS** : Permissions granulaires par rôle (DG, FINANCE, AGENT, READONLY)

---

### `virements` (4 enregistrements)
**Rôle** : Virements bancaires

**Colonnes clés** :
- `reference` : Référence unique
- `montant_total` : Montant
- `statut` : Statut virement

**RLS** : Accès limité à DG, FINANCE, AGENT

---

### `fournisseurs` (555 enregistrements)
**Rôle** : Base de données fournisseurs

**Colonnes clés** :
- `nom` : Nom fournisseur
- `email`, `telephone` : Contacts
- `nif` : Numéro d'identification fiscale
- `tva_numero` : Numéro TVA
- `statut` : ACTIF/INACTIF

**RLS** : SELECT pour tous, modifications pour DG/FINANCE uniquement

---

### `factures` + `facture_lignes`
**Rôle** : Système de facturation (structure prête, actuellement vide)

**Colonnes clés (factures)** :
- `numero` : Numéro facture
- `client_nom` : Nom client
- `montant_ht`, `montant_tva`, `montant_ttc` : Montants
- `statut` : BROUILLON, VALIDEE, ENVOYEE, PAYEE
- `dgi_status` : Statut validation DGI

**RLS** : Création limitée à DG/FINANCE

---

## 📥 Système d'import Excel

### `staging_imports`
**Rôle** : Suivi des imports Excel (CVthèques, fournisseurs, etc.)

**Colonnes clés** :
- `type` : Type d'import (CHEQUES, FOURNISSEURS, VIREMENTS)
- `status` : PENDING, PROCESSING, COMPLETED, FAILED
- `rows_total`, `rows_ok`, `rows_failed` : Statistiques
- `processing_time_ms` : Temps traitement
- `throughput_rows_per_second` : Débit

**RLS** : Accessible à DG, FINANCE, AGENT

---

### `staging_import_rows`
**Rôle** : Détail des lignes importées

**Colonnes clés** :
- `import_id` : FK vers staging_imports
- `raw_data` : Données brutes JSON
- `normalized_data` : Données normalisées JSON
- `status` : PENDING, OK, FAILED
- `error_msg` : Message d'erreur si échec

**RLS** : Accessible à DG, FINANCE, AGENT

---

## 📬 Gestion administrative

### `courriers_memos`
**Rôle** : Gestion des courriers et mémos internes

**Colonnes clés** :
- `type` : Type document (COURRIER, MEMO)
- `numero` : Numéro référence
- `sujet` : Sujet
- `expediteur`, `destinataire` : Expéditeur/destinataire
- `urgence` : Niveau urgence (normal, urgent, tres_urgent)
- `statut` : nouveau, en_cours, traite

**RLS** : Authentification requise pour toutes opérations

---

### `diligences`
**Rôle** : Suivi des tâches et diligences

**Colonnes clés** :
- `action` : Action à réaliser
- `responsable_id` : Responsable assigné
- `echeance` : Date échéance
- `priorite` : normale, haute, critique
- `statut` : a_realiser, en_cours, termine
- `concerne_dtdi` : Booléen si concerne DTDI
- `direction_assignee` : Direction assignée

**RLS** : Authentification requise

---

## 🏗️ Gestion de projets

### `projets_hierarchiques`
**Rôle** : Projets ANSUT avec axes stratégiques

**Colonnes clés** :
- `code`, `nom` : Identifiants projet
- `programme_id` : FK vers programmes
- `budget_total`, `budget_alloue_2025`, `budget_execute` : Budgets
- `taux_avancement` : Pourcentage avancement
- `statut` : Non démarré, En cours, etc.
- Axes stratégiques : `infrastructure_base_numerique`, `services_numeriques_essentiels`, `competence_numerique_citoyenne`, `gouvernance_excellence_operationnelle`

**RLS** : Lecture pour tous authentifiés

---

### `programmes`
**Rôle** : Programmes regroupant plusieurs projets

**Colonnes clés** :
- `code`, `nom` : Identifiants
- `direction_id` : FK vers directions
- `budget_total`, `budget_alloue_2025`, `budget_execute` : Budgets

**RLS** : Lecture pour tous authentifiés

---

### `directions`
**Rôle** : Directions organisationnelles

**Colonnes clés** :
- `nom` : Nom direction
- `code` : Code direction
- `description` : Description

**RLS** : Lecture pour tous authentifiés

---

### `activites`
**Rôle** : Activités détaillées des projets

**Colonnes clés** :
- `projet_id` : FK vers projets_hierarchiques
- `code`, `nom` : Identifiants
- `taux_avancement` : Avancement
- `responsable` : Responsable activité

**RLS** : SELECT pour tous, modifications pour DG/FINANCE/AGENT

---

## 🔍 Audit et traçabilité

### `audit_logs`
**Rôle** : Journal complet des modifications

**Colonnes clés** :
- `table_name` : Table concernée
- `record_id` : ID enregistrement
- `action` : INSERT, UPDATE, DELETE
- `actor_id` : Utilisateur
- `before_data`, `after_data` : Données avant/après

**RLS** : SELECT pour DG uniquement

---

### `cheques_status_corrections`
**Rôle** : Audit spécifique des corrections de statut de chèques

**Colonnes clés** :
- `cheque_id` : FK vers cheques
- `ancien_statut`, `nouveau_statut` : Changement statut
- `correction_type` : AUTO_CORRECTION, MANUAL_FIX
- `corrected_by` : Utilisateur

**RLS** : Lecture DG/FINANCE, insertion système

---

### `events_ledger`
**Rôle** : Journal immuable des événements (blockchain-like)

**Colonnes clés** :
- `action` : Action effectuée
- `actor` : Acteur
- `payload` : Données JSON
- `hash_curr`, `hash_prev` : Hashes chaînés

**RLS** : Accessible à tous authentifiés

---

### `error_logs`
**Rôle** : Logs d'erreurs système

**Colonnes clés** :
- `error_type` : Type erreur
- `message` : Message
- `stack_trace` : Stack trace
- `user_id` : Utilisateur concerné
- `resolved_at` : Date résolution

**RLS** : Insertion système uniquement

---

### `debug_sessions`
**Rôle** : Sessions de debug pour imports

**Colonnes clés** :
- `import_id` : FK vers staging_imports
- `status` : RUNNING, COMPLETED, FAILED
- `duration_ms` : Durée
- `summary`, `details`, `recommendations` : JSON

**RLS** : Lecture pour tous authentifiés, création/update pour propriétaire

---

## 🗑️ Tables supprimées lors du nettoyage (2025-01-17)

Les tables suivantes ont été supprimées car elles étaient inutilisées ou dupliquées :

| Table | Raison suppression |
|-------|-------------------|
| ❌ `campaigns` | Jamais implémentée (n'existait pas en base) |
| ❌ `user_profiles` | KYC Ballerine non utilisé (7 lignes orphelines) |
| ❌ `kyc_workflows` | Workflow KYC non intégré |
| ❌ `projects` | Ancien système, doublon de projets_hierarchiques |
| ❌ `projets` | Doublon de projets_hierarchiques |
| ❌ `users` | Doublon de ansut_profiles |

**Impact** : 
- Aucune fonctionnalité active n'a été affectée
- Code nettoyé (hooks, routes, composants supprimés)
- Schéma simplifié de 6 tables

---

## 🔐 Sécurité - Row Level Security (RLS)

Toutes les tables principales ont des RLS policies activées :

### Hiérarchie des rôles
```
DG (Niveau 4) : Accès complet
  ↓
FINANCE (Niveau 3) : Gestion financière
  ↓  
AGENT (Niveau 2) : Saisie et lecture
  ↓
READONLY (Niveau 1) : Lecture uniquement
```

### Exemple de policies (cheques)
- **AGENT** : Peut créer des chèques EN_ATTENTE
- **FINANCE** : Peut modifier chèques EN_ATTENTE et SIGNE
- **DG** : Peut tout faire (signature, modification, etc.)
- **READONLY** : Lecture seule

---

## 📈 Tables de performance

### `mv_cheques_kpi` (Materialized View)
Vue matérialisée pour les KPIs des chèques

### `mv_import_performance` (Materialized View)
Statistiques de performance des imports

---

## 🔧 Fonctions utilitaires

### Fonctions principales
- `has_ansut_role(required_role)` : Vérifie si utilisateur a un rôle
- `has_ansut_permission(required_roles[])` : Vérifie permissions multiples
- `validate_import_data(entity_type, data)` : Valide données import
- `detect_duplicates(entity_type, data)` : Détecte doublons
- `fuzzy_search_fournisseurs(search_term)` : Recherche floue fournisseurs
- `maintain_cheque_status_consistency()` : Maintient cohérence statuts chèques

### Fonctions d'import
- `trigger_import_processing(import_uuid)` : Déclenche traitement import
- `retry_import(import_id)` : Réessayer import échoué
- `cleanup_old_imports(days_to_keep)` : Nettoie anciens imports

---

## 📝 Bonnes pratiques

1. **Toujours utiliser ansut_profiles** pour les utilisateurs ANSUT
2. **profiles est réservé** aux candidatures d'experts (lié via ansut_profile_id)
3. **Imports Excel** passent par staging_imports → staging_import_rows
4. **Audit activé** sur toutes tables critiques (audit_logs)
5. **RLS obligatoire** : Toutes tables sensibles ont des policies strictes
6. **Triggers automatiques** : Mise à jour statuts chèques, timestamps, etc.

---

## 🚀 Prochaines étapes suggérées

1. ✅ **Nettoyage effectué** (6 tables supprimées)
2. 🔄 Activer la facturation (tables `factures` prêtes)
3. 📊 Ajouter dashboards analytics avancés
4. 🔔 Système de notifications (diligences en retard, etc.)
5. 📱 API REST pour applications mobiles

---

## 📞 Support technique

Pour toute question sur la structure de la base :
- Consulter les types générés : `src/integrations/supabase/types.ts`
- Voir les policies RLS : Supabase Dashboard → Database → Policies
- Logs d'erreurs : Table `error_logs`

---

**Version** : 1.0  
**Dernière mise à jour** : 2025-01-17  
**Mainteneur** : Équipe ANSUT DTDI
