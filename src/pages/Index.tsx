import Dashboard from "@/components/Dashboard";
import { RoleGuard } from "@/components/RoleGuard";
import { useHasRole } from "@/hooks/useRole";
import ExpertProfile from "@/pages/ExpertProfile";

const Index = () => {
  const { hasRole: isExpert, userRole } = useHasRole('expert');
  
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
