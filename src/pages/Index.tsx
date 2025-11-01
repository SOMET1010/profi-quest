import SimpleDashboard from "@/components/SimpleDashboard";
import { useHasRole } from "@/hooks/useRole";
import ExpertProfile from "@/pages/ExpertProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useHasPermission } from "@/hooks/usePermissions";

const Index = () => {
  const { user } = useAuth();
  const { userRole, isLoading } = useHasRole('POSTULANT'); // Get role info
  const { hasPermission: canViewDashboard } = useHasPermission('view_dashboard');
  
  // Show loading while checking role
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // SUPERADMIN and admin roles (DG, SI, DRH, RDRH, RH_ASSISTANT) always see Dashboard
  if (userRole === 'SUPERADMIN' || userRole === 'DG' || userRole === 'SI' || 
      userRole === 'DRH' || userRole === 'RDRH' || userRole === 'RH_ASSISTANT') {
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
