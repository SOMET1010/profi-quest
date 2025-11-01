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

  // Show loading state while checking role
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Only render children for applicants
  if (role && ['POSTULANT', 'CONSULTANT'].includes(role)) {
    return <>{children}</>;
  }

  return null;
}
