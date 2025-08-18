import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'hr_manager' | 'expert';

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
    
    // Role hierarchy: admin > hr_manager > expert
    const roleHierarchy = { admin: 3, hr_manager: 2, expert: 1 };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  return {
    hasRole: hasRole(),
    userRole,
    isLoading,
  };
}