import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalExperts: number;
  qualifiedProfiles: number;
  responseRate: number;
  activeMissions: number;
  totalCampaigns: number;
  activeCampaigns: number;
  pendingApplications: number;
  completedApplications: number;
}

export const useStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        // Count total profiles
        const { count: totalExperts } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Count qualified (active) profiles
        const { count: qualifiedProfiles } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);
        
        // Count pending applications (submitted status)
        const { count: pendingApplications } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('application_status', 'submitted');

        // Count completed applications (approved/rejected)
        const { count: completedApplications } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('application_status', ['approved', 'rejected']);

        // Campaigns not yet implemented
        const totalCampaigns = 0;
        const activeCampaigns = 0;

        // Calculate response rate based on actual applications
        const responseRate = totalExperts && pendingApplications 
          ? Math.round((pendingApplications / totalExperts) * 100)
          : 0;

        return {
          totalExperts: totalExperts || 0,
          qualifiedProfiles: qualifiedProfiles || 0,
          responseRate,
          activeMissions: activeCampaigns,
          totalCampaigns,
          activeCampaigns,
          pendingApplications,
          completedApplications,
        };
      } catch (error) {
        console.error("Error fetching stats:", error);
        return {
          totalExperts: 0,
          qualifiedProfiles: 0,
          responseRate: 0,
          activeMissions: 0,
          totalCampaigns: 0,
          activeCampaigns: 0,
          pendingApplications: 0,
          completedApplications: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};