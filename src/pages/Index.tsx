import Dashboard from "@/components/Dashboard";
import { RoleGuard } from "@/components/RoleGuard";
import { useHasRole } from "@/hooks/useRole";
import ExpertProfile from "@/pages/ExpertProfile";
import AdminSetup from "@/pages/AdminSetup";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const { hasRole: isExpert, userRole, isLoading } = useHasRole('expert');
  
  // Show loading while checking role
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // If user has no role, show admin setup
  if (user && !userRole) {
    return <AdminSetup />;
  }
  
  // Redirect experts to their dedicated interface
  if (userRole === 'expert') {
    return <ExpertProfile />;
  }
  
  return (
    <RoleGuard requiredRole="hr_manager">
      <Dashboard />
    </RoleGuard>
  );
};

export default Index;
