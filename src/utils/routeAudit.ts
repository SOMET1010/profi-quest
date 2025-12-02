import { ROUTE_REGISTRY, isValidRoute } from '@/config/routes';

export interface RouteAuditResult {
  totalRoutes: number;
  validRoutes: string[];
  dynamicRoutes: string[];
  publicRoutes: string[];
  protectedRoutes: string[];
}

// Générer un rapport des routes
export function generateRouteAudit(): RouteAuditResult {
  return {
    totalRoutes: ROUTE_REGISTRY.length,
    validRoutes: ROUTE_REGISTRY.map(r => r.path),
    dynamicRoutes: ROUTE_REGISTRY.filter(r => r.isDynamic).map(r => r.path),
    publicRoutes: ROUTE_REGISTRY.filter(r => r.access === 'public').map(r => r.path),
    protectedRoutes: ROUTE_REGISTRY.filter(r => r.access !== 'public').map(r => r.path),
  };
}

// Valider une liste de chemins
export function validatePaths(paths: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  paths.forEach(path => {
    if (isValidRoute(path)) {
      valid.push(path);
    } else {
      invalid.push(path);
    }
  });
  
  return { valid, invalid };
}

// Afficher le rapport d'audit dans la console (dev only)
export function printRouteAuditReport(): void {
  if (import.meta.env.DEV) {
    const audit = generateRouteAudit();
    console.group('📊 Route Audit Report');
    console.log(`Total routes: ${audit.totalRoutes}`);
    console.log('Public routes:', audit.publicRoutes);
    console.log('Protected routes:', audit.protectedRoutes);
    console.log('Dynamic routes:', audit.dynamicRoutes);
    console.groupEnd();
  }
}
