// Types pour les routes
export type RouteAccess = 'public' | 'authenticated' | 'applicant' | 'admin';

export interface RouteConfig {
  path: string;
  access: RouteAccess;
  label: string;
  isDynamic?: boolean;
}

// Registre complet des routes de l'application
export const ROUTE_REGISTRY: RouteConfig[] = [
  // Routes publiques
  { path: '/postuler', access: 'public', label: 'Postuler' },
  { path: '/auth', access: 'public', label: 'Authentification' },
  
  // Routes applicant
  { path: '/', access: 'applicant', label: 'Tableau de bord' },
  { path: '/mon-profil', access: 'applicant', label: 'Mon profil' },
  { path: '/mes-candidatures', access: 'applicant', label: 'Mes candidatures' },
  
  // Routes admin
  { path: '/dashboard', access: 'admin', label: 'Dashboard Admin' },
  { path: '/database', access: 'admin', label: 'Base de données' },
  { path: '/expert/:id', access: 'admin', label: 'Détail expert', isDynamic: true },
  { path: '/qualification', access: 'admin', label: 'Qualification' },
  { path: '/analytics', access: 'admin', label: 'Analytics' },
  { path: '/import', access: 'admin', label: 'Import' },
  { path: '/admin/roles', access: 'admin', label: 'Gestion des rôles' },
  { path: '/admin/permissions', access: 'admin', label: 'Gestion des permissions' },
  { path: '/admin/form-builder', access: 'admin', label: 'Form Builder' },
  { path: '/admin/candidatures', access: 'admin', label: 'Gestion candidatures' },
  
  // Routes partagées
  { path: '/account', access: 'authenticated', label: 'Mon compte' },
];

// Obtenir tous les chemins valides
export const getValidPaths = (): string[] => 
  ROUTE_REGISTRY.map(r => r.path);

// Vérifier si un chemin est valide
export const isValidRoute = (path: string): boolean => {
  const cleanPath = path.split('?')[0];
  
  return ROUTE_REGISTRY.some(route => {
    if (route.isDynamic) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(cleanPath);
    }
    return route.path === cleanPath;
  });
};

// Obtenir la configuration d'une route
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  const cleanPath = path.split('?')[0];
  return ROUTE_REGISTRY.find(route => {
    if (route.isDynamic) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(cleanPath);
    }
    return route.path === cleanPath;
  });
};
