import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedRole } from '@/hooks/useUnifiedRole';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { role, isLoading } = useUnifiedRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;
    
    // Redirect applicants to their home dashboard
    if (role && ['POSTULANT', 'CONSULTANT'].includes(role)) {
      navigate('/', { replace: true });
    }
  }, [role, isLoading, navigate]);

  // Show nothing while loading or redirecting
  if (isLoading) return null;
  
  // Only render children for admins/HR
  if (role && !['POSTULANT', 'CONSULTANT'].includes(role)) {
    return <>{children}</>;
  }

  return null;
}
