import { ReactNode } from 'react';
import { useUnifiedRole, AppRole } from '@/hooks/useUnifiedRole';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: AppRole;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  fallback,
  showMessage = true 
}: RoleGuardProps) {
  const { hasMinimumRole, role: userRole, isLoading } = useUnifiedRole();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasMinimumRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;
    
    if (!showMessage) return null;

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive/50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Accès restreint</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas les permissions nécessaires pour accéder à cette section.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 justify-center">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Rôle requis: <span className="font-medium">{requiredRole}</span>
                  </span>
                </div>
                {userRole && (
                  <div className="flex items-center gap-2 justify-center mt-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Votre rôle: <span className="font-medium">{userRole}</span>
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}