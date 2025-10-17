import { ReactNode } from 'react';
import { useHasPermission } from '@/hooks/usePermissions';
import { Skeleton } from '@/components/ui/skeleton';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission: string;
  fallback?: ReactNode;
  showSkeleton?: boolean;
}

export function PermissionGuard({ 
  children, 
  requiredPermission, 
  fallback,
  showSkeleton = false
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useHasPermission(requiredPermission);

  if (isLoading) {
    if (showSkeleton) {
      return <Skeleton className="h-8 w-full" />;
    }
    return null;
  }

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
