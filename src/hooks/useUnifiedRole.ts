import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'SUPERADMIN' | 'DG' | 'SI' | 'DRH' | 'RDRH' | 'RH_ASSISTANT' | 'CONSULTANT' | 'POSTULANT';

// Hiérarchie unifiée des rôles (source unique de vérité)
export const ROLE_HIERARCHY = {
  SUPERADMIN: 15,
  DG: 10,
  SI: 9,
  DRH: 8,
  RDRH: 7,
  RH_ASSISTANT: 5,
  CONSULTANT: 3,
  POSTULANT: 1,
} as const;

/**
 * Hook unifié pour la gestion des rôles
 * Source unique: table user_roles
 * Remplace les anciens systèmes (ansut_profiles, profiles.role)
 */
export function useUnifiedRole() {
  const { user } = useAuth();

  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['unified-user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Source unique: user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role', { ascending: false }) // Prendre le rôle le plus élevé si multiple
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching unified user role:', error);
        return null;
      }

      return data?.role ? (data.role as AppRole) : null;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: null,
  });

  /**
   * Vérifie si l'utilisateur a au moins le niveau du rôle requis
   */
  const hasMinimumRole = (requiredRole: AppRole): boolean => {
    if (!userRole) return false;
    if (userRole === 'SUPERADMIN') return true; // SUPERADMIN a accès à tout
    
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    
    return userLevel >= requiredLevel;
  };

  /**
   * Vérifie si l'utilisateur a exactement ce rôle
   */
  const hasExactRole = (role: AppRole): boolean => {
    return userRole === role;
  };

  /**
   * Retourne le niveau hiérarchique du rôle actuel
   */
  const getRoleLevel = (): number => {
    return userRole ? ROLE_HIERARCHY[userRole] : 0;
  };

  /**
   * Vérifie si l'utilisateur est admin (DG, SI, DRH ou supérieur)
   */
  const isAdmin = (): boolean => {
    return hasMinimumRole('DRH');
  };

  /**
   * Vérifie si l'utilisateur est super admin
   */
  const isSuperAdmin = (): boolean => {
    return userRole === 'SUPERADMIN';
  };

  return {
    role: userRole,
    level: getRoleLevel(),
    hasMinimumRole,
    hasExactRole,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    isLoading,
    error,
  };
}

/**
 * Hook pour vérifier un rôle minimum spécifique
 */
export function useHasMinimumRole(requiredRole: AppRole) {
  const { hasMinimumRole, role, isLoading } = useUnifiedRole();

  return {
    hasRole: hasMinimumRole(requiredRole),
    userRole: role,
    isLoading,
  };
}
