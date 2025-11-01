/**
 * Feature Flags Configuration
 * Permet de gérer le rollout progressif et le rollback si nécessaire
 */

export const FEATURES = {
  /**
   * Utiliser le système de rôles unifié (user_roles uniquement)
   * Si false: rollback vers l'ancien système mixte
   */
  USE_UNIFIED_ROLES: true,

  /**
   * Vérifications strictes des rôles
   * Recommandé: true pour la production
   */
  STRICT_ROLE_CHECK: true,

  /**
   * Afficher les warnings de migration aux utilisateurs
   * Utile pendant la période de transition
   */
  MIGRATION_WARNING: false,

  /**
   * Afficher les informations de debug dans la console
   */
  DEBUG_ROLES: import.meta.env.DEV,
} as const;

/**
 * Configuration du système de rôles post-refactoring
 */
export const ROLE_SYSTEM_CONFIG = {
  // Source unique de vérité pour les rôles
  SOURCE_TABLE: 'user_roles',
  
  // Temps de cache des rôles (en ms)
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  
  // Rôle par défaut pour les nouveaux utilisateurs
  DEFAULT_ROLE: 'POSTULANT',
  
  // Rôles considérés comme "admin"
  ADMIN_ROLES: ['SUPERADMIN', 'DG', 'SI', 'DRH', 'RDRH'],
  
  // Rôles pouvant voir le dashboard
  DASHBOARD_ROLES: ['SUPERADMIN', 'DG', 'SI', 'DRH', 'RDRH', 'RH_ASSISTANT'] as const,
} as const;

// Type helper pour les rôles dashboard
export type DashboardRole = typeof ROLE_SYSTEM_CONFIG.DASHBOARD_ROLES[number];

/**
 * Vérifie si un feature flag est activé
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}

/**
 * Logging conditionnel basé sur DEBUG_ROLES
 */
export function debugRole(message: string, ...args: any[]) {
  if (FEATURES.DEBUG_ROLES) {
    console.log(`[ROLE DEBUG] ${message}`, ...args);
  }
}
