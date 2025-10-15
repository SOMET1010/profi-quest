import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'DG' | 'FINANCE' | 'AGENT' | 'READONLY';

export function useRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role', { ascending: true }) // admin first
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role as AppRole | null;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useHasRole(requiredRole: AppRole) {
  const { data: userRole, isLoading } = useRole();

  const hasRole = () => {
    if (!userRole) return false;
    
    // Role hierarchy: DG > FINANCE > AGENT > READONLY
    const roleHierarchy = { DG: 4, FINANCE: 3, AGENT: 2, READONLY: 1 };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  return {
    hasRole: hasRole(),
    userRole,
    isLoading,
  };
}