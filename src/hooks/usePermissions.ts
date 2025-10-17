import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .rpc('get_user_permissions', { _user_id: user.id });

      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }

      return (data || []).map((item: any) => item.permission_code);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHasPermission(requiredPermission: string) {
  const { data: permissions, isLoading } = usePermissions();

  return {
    hasPermission: permissions?.includes(requiredPermission) || false,
    isLoading,
  };
}
