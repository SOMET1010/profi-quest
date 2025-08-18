import Dashboard from "@/components/Dashboard";
import { RoleGuard } from "@/components/RoleGuard";
import { useHasRole } from "@/hooks/useRole";
import ExpertProfile from "@/pages/ExpertProfile";
import AdminSetup from "@/pages/AdminSetup";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const { userRole, isLoading } = useHasRole('expert'); // Get role info
  
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
  
  // Admins and HR managers can access the Dashboard
  if (userRole === 'admin' || userRole === 'hr_manager') {
    return <Dashboard />;
  }
  
  // Fallback for any other case
  return (
    <RoleGuard requiredRole="hr_manager">
      <Dashboard />
    </RoleGuard>
  );
};

export default Index;
