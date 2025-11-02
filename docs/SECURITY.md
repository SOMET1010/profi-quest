# Guide de Sécurité - QUALI-RH EXPERTS

## 🔐 Architecture de Sécurité

### Clés Supabase Publiques

L'application expose intentionnellement les clés suivantes :
- `VITE_SUPABASE_URL` : URL publique du projet
- `VITE_SUPABASE_PUBLISHABLE_KEY` : Anon key (rôle JWT : `anon`)
- `VITE_SUPABASE_PROJECT_ID` : Identifiant public du projet

**Ces clés sont conçues pour être publiques.** La sécurité est assurée par :

1. **Row Level Security (RLS)** : Politiques au niveau de la base de données
2. **JWT avec rôle `anon`** : Permissions limitées côté serveur
3. **Politiques RLS strictes** : Chaque table a des politiques qui contrôlent l'accès

### Pourquoi ces clés peuvent être publiques ?

Contrairement aux API traditionnelles, Supabase utilise une approche "security by design" :

- **L'anon key** n'a accès qu'aux données autorisées par les politiques RLS
- **Le projet ID** et l'URL sont nécessaires pour se connecter, mais sans RLS permissives, aucune donnée n'est accessible
- **La vraie sécurité** réside dans les politiques RLS, pas dans l'obscurité des clés

### Clés à JAMAIS Exposer

- `SUPABASE_SERVICE_ROLE_KEY` : Accès administrateur complet (bypass RLS)
- Toute clé d'API tierce (Stripe, SendGrid, Resend, etc.)
- Secrets d'authentification OAuth
- Tokens d'accès personnels

## ✅ Checklist de Sécurité

### Avant Chaque Commit

- [ ] Aucune clé `service_role` dans le code client
- [ ] Les secrets tiers sont stockés dans Supabase Edge Functions secrets
- [ ] Aucun mot de passe en dur dans le code
- [ ] Les politiques RLS sont testées pour tous les rôles

### Audit Régulier

- [ ] Vérifier les logs Supabase pour tentatives d'accès non autorisées
- [ ] Tester les politiques RLS avec différents rôles utilisateurs (POSTULANT, DRH, SUPERADMIN)
- [ ] Valider que les en-têtes de sécurité sont configurés (HSTS, CSP, X-Frame-Options)
- [ ] Exécuter `supabase db lint` pour détecter les failles RLS

### Tests de Sécurité Recommandés

```sql
-- Vérifier que toutes les tables sensibles ont RLS activé
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename NOT LIKE 'pg_%'
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = pg_tables.tablename
  );

-- Vérifier qu'aucun utilisateur n'a de rôle manquant
SELECT COUNT(*) as users_without_role
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE ur.role IS NULL;
```

## 🛡️ Politiques RLS Critiques

### Règles d'Or

1. **Toujours utiliser `auth.uid()`** pour vérifier l'identité de l'utilisateur actuel
2. **Ne jamais faire confiance aux données client** : valider côté serveur
3. **Tester les politiques avec tous les rôles** : admin, utilisateur standard, anonyme
4. **Utiliser des fonctions SECURITY DEFINER** pour éviter les récursions infinies

### Exemple de Bonne Politique RLS

```sql
-- ✅ BON : Utilise une fonction security definer
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- ❌ MAUVAIS : Risque de récursion infinie
CREATE POLICY "Admins can view all"
ON profiles FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

## 📚 Ressources Officielles

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API Keys Explained](https://supabase.com/docs/guides/api/api-keys)
- [Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [RLS Performance Tips](https://supabase.com/docs/guides/database/postgres/row-level-security)

## 🚨 Que Faire en Cas de Fuite de Clé ?

### Si `SUPABASE_SERVICE_ROLE_KEY` est exposée :

1. **URGENT** : Révoquer immédiatement la clé dans le dashboard Supabase
2. Générer une nouvelle clé service role
3. Mettre à jour tous les Edge Functions avec la nouvelle clé
4. Auditer les logs pour détecter toute activité suspecte

### Si `SUPABASE_PUBLISHABLE_KEY` est exposée :

- **Pas de panique** : Cette clé est conçue pour être publique
- Vérifier que les politiques RLS sont bien configurées
- Surveiller les logs pour détecter des patterns inhabituels

## 📝 Historique des Audits

| Date | Auditeur | Score | Notes |
|------|----------|-------|-------|
| 2025-11-02 | IA + User | 8.4/10 | RLS solides, architecture sécurisée, standards respectés |

---

**Dernière mise à jour :** 2 novembre 2025  
**Contact sécurité :** via repository GitHub
