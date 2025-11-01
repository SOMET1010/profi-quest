import SimpleDashboard from "@/components/SimpleDashboard";

const Index = () => {
  // Admin/HR dashboard - always show SimpleDashboard
  // Applicants are redirected to "/" by AdminRoute wrapper
  return <SimpleDashboard />;
};

export default Index;
