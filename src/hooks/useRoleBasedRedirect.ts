import { useNavigate } from 'react-router-dom';
import { useUnifiedRole, type AppRole } from '@/hooks/useUnifiedRole';

export function useRoleBasedRedirect() {
  const { role } = useUnifiedRole();
  const navigate = useNavigate();

  const getDefaultRoute = (): string => {
    if (!role) return '/';
    
    const isApplicant = ['POSTULANT', 'CONSULTANT'].includes(role);
    return isApplicant ? '/' : '/dashboard';
  };

  const redirectToDefault = () => {
    navigate(getDefaultRoute());
  };

  const isApplicantRole = (checkRole: AppRole | null): boolean => {
    return checkRole ? ['POSTULANT', 'CONSULTANT'].includes(checkRole) : false;
  };

  return { 
    getDefaultRoute, 
    redirectToDefault,
    isApplicantRole,
    role 
  };
}
