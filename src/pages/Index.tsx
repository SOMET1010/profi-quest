import SimpleDashboard from "@/components/SimpleDashboard";
import { RoleGuard } from "@/components/RoleGuard";
import { useHasRole } from "@/hooks/useRole";
import ExpertProfile from "@/pages/ExpertProfile";
import AdminSetup from "@/pages/AdminSetup";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const { userRole, isLoading } = useHasRole('READONLY'); // Get role info
  
  // Show loading while checking role
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  // If user has no role, show admin setup
  if (user && !userRole) {
    return <AdminSetup />;
  }
  
  // Redirect AGENT to their dedicated interface
  if (userRole === 'AGENT') {
    return <ExpertProfile />;
  }
  
  // DG and FINANCE can access the Dashboard
  if (userRole === 'DG' || userRole === 'FINANCE' || userRole === 'READONLY') {
    return <SimpleDashboard />;
  }
  
  // Fallback for any other case
  return (
    <RoleGuard requiredRole="FINANCE">
      <SimpleDashboard />
    </RoleGuard>
  );
};

export default Index;
