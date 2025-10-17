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
  
  // POSTULANT and CONSULTANT see their expert profile
  if (userRole === 'POSTULANT' || userRole === 'CONSULTANT') {
    return <ExpertProfile />;
  }
  
  // All other roles (DG, SI, DRH, RDRH, RH_ASSISTANT) can access Dashboard if they have permission
  if (canViewDashboard) {
    return <SimpleDashboard />;
  }
  
  // Fallback: show expert profile
  return <ExpertProfile />;
};

export default Index;
