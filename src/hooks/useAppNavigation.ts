import { useNavigate } from 'react-router-dom';
import { useUnifiedRole, type AppRole } from '@/hooks/useUnifiedRole';

// Centralized route configuration
export const APP_ROUTES = {
  // Public routes
  PUBLIC_SIGNUP: '/postuler',
  AUTH: '/auth',
  
  // Applicant routes
  APPLICANT_HOME: '/',
  APPLICANT_PROFILE: '/mon-profil',
  APPLICANT_APPLICATIONS: '/mes-candidatures',
  
  // Admin/HR routes
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_DATABASE: '/database',
  ADMIN_ANALYTICS: '/analytics',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  
  // Shared routes
  ACCOUNT: '/account',
} as const;

export function useAppNavigation() {
  const { role, isLoading } = useUnifiedRole();
  const navigate = useNavigate();

  const isApplicant = role ? ['POSTULANT', 'CONSULTANT'].includes(role) : false;

  // Get the default home route based on role
  const getHomeRoute = (): string => {
    return isApplicant ? APP_ROUTES.APPLICANT_HOME : APP_ROUTES.ADMIN_DASHBOARD;
  };

  // Get the profile route based on role
  const getProfileRoute = (): string => {
    return isApplicant ? APP_ROUTES.APPLICANT_PROFILE : APP_ROUTES.ADMIN_DASHBOARD;
  };

  // Get the applications route based on role
  const getApplicationsRoute = (): string => {
    return isApplicant ? APP_ROUTES.APPLICANT_APPLICATIONS : APP_ROUTES.ADMIN_DATABASE;
  };

  // Navigate to home (role-aware)
  const navigateToHome = () => {
    navigate(getHomeRoute(), { replace: true });
  };

  // Navigate to profile (role-aware)
  const navigateToProfile = () => {
    navigate(getProfileRoute(), { replace: true });
  };

  // Navigate to applications (role-aware)
  const navigateToApplications = () => {
    navigate(getApplicationsRoute(), { replace: true });
  };

  return {
    // Routes getters
    getHomeRoute,
    getProfileRoute,
    getApplicationsRoute,
    
    // Navigation helpers
    navigateToHome,
    navigateToProfile,
    navigateToApplications,
    
    // Direct navigation
    navigate,
    
    // Role info
    role,
    isApplicant,
    isLoading,
    
    // Constants
    ROUTES: APP_ROUTES,
  };
}
