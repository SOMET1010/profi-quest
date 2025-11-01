import SimpleDashboard from "@/components/SimpleDashboard";
import { useUnifiedRole } from "@/hooks/useUnifiedRole";
import { ROLE_SYSTEM_CONFIG } from "@/config/features";
import ExpertProfile from "@/pages/ExpertProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useHasPermission } from "@/hooks/usePermissions";

const Index = () => {
  const { user } = useAuth();
  const { role: userRole, isLoading, hasMinimumRole } = useUnifiedRole();
  const { hasPermission: canViewDashboard } = useHasPermission('view_dashboard');
  
  // Show loading while checking role
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // Utiliser la configuration unifiée
  const isDashboardRole = userRole && 
    (ROLE_SYSTEM_CONFIG.DASHBOARD_ROLES as readonly string[]).includes(userRole);
    
  if (isDashboardRole) {
    return <SimpleDashboard />;
  }
  
  // POSTULANT and CONSULTANT see their expert profile
  if (userRole === 'POSTULANT' || userRole === 'CONSULTANT') {
    return <ExpertProfile />;
  }
  
  // Fallback for users with view_dashboard permission
  if (canViewDashboard) {
    return <SimpleDashboard />;
  }
  
  // Default fallback: show expert profile
  return <ExpertProfile />;
};

export default Index;
