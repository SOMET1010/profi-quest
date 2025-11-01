import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedRole } from '@/hooks/useUnifiedRole';

interface ApplicantRouteProps {
  children: ReactNode;
}

export function ApplicantRoute({ children }: ApplicantRouteProps) {
  const { role, isLoading } = useUnifiedRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;
    
    // Redirect non-applicants to dashboard
    if (role && !['POSTULANT', 'CONSULTANT'].includes(role)) {
      navigate('/dashboard', { replace: true });
    }
  }, [role, isLoading, navigate]);

  // Show nothing while loading or redirecting
  if (isLoading) return null;
  
  // Only render children for applicants
  if (role && ['POSTULANT', 'CONSULTANT'].includes(role)) {
    return <>{children}</>;
  }

  return null;
}
