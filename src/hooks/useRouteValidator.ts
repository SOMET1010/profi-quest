import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isValidRoute, ROUTE_REGISTRY, getRouteConfig, RouteConfig } from '@/config/routes';

interface RouteValidatorOptions {
  enableDevWarnings?: boolean;
  logToConsole?: boolean;
}

export function useRouteValidator(options: RouteValidatorOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { enableDevWarnings = true, logToConsole = true } = options;
  const isDev = import.meta.env.DEV;

  // Valider une route
  const validateRoute = useCallback((path: string): boolean => {
    const isValid = isValidRoute(path);
    
    if (!isValid && isDev && enableDevWarnings && logToConsole) {
      console.warn(
        `🔗 [Route Validator] Route invalide détectée: "${path}"\n` +
        `Routes valides: ${ROUTE_REGISTRY.map(r => r.path).join(', ')}`
      );
    }
    
    return isValid;
  }, [isDev, enableDevWarnings, logToConsole]);

  // Navigation sécurisée avec validation
  const safeNavigate = useCallback((
    path: string, 
    options?: { replace?: boolean; state?: unknown }
  ) => {
    if (validateRoute(path)) {
      navigate(path, options);
      return true;
    } else {
      if (isDev) {
        console.error(`❌ [Route Validator] Navigation bloquée vers: "${path}"`);
      }
      return false;
    }
  }, [navigate, validateRoute, isDev]);

  // Obtenir les infos d'une route
  const getRouteInfo = useCallback((path: string): RouteConfig | undefined => {
    return getRouteConfig(path);
  }, []);

  // Vérifier la route actuelle au chargement (dev uniquement)
  useEffect(() => {
    if (isDev && enableDevWarnings) {
      const currentPath = location.pathname;
      if (!isValidRoute(currentPath) && currentPath !== '*') {
        console.warn(
          `⚠️ [Route Validator] Page actuelle non enregistrée: "${currentPath}"`
        );
      }
    }
  }, [location.pathname, isDev, enableDevWarnings]);

  return {
    validateRoute,
    safeNavigate,
    getRouteInfo,
    isCurrentRouteValid: isValidRoute(location.pathname),
    currentRoute: getRouteInfo(location.pathname),
    allRoutes: ROUTE_REGISTRY,
  };
}
