import { ReactNode, useEffect } from 'react';
import { useAppNavigation } from '@/hooks/useAppNavigation';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isApplicant, navigateToHome, isLoading } = useAppNavigation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;
    
    // Redirect applicants to their home dashboard
    if (isApplicant) {
      navigateToHome();
    }
  }, [isApplicant, isLoading, navigateToHome]);

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
  
  // Only render children for admins/HR
  if (!isApplicant) {
    return <>{children}</>;
  }

  return null;
}
