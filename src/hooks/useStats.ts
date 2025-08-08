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
        // Since migration hasn't been run yet, return default values
        // These will be replaced with real queries once tables exist
        const totalExperts = 0;
        const qualifiedProfiles = 0;
        const totalCampaigns = 0;
        const activeCampaigns = 0;
        const pendingApplications = 0;
        const completedApplications = 0;

        // Calculate response rate (simplified: applications vs profiles contacted)
        const responseRate = totalExperts && pendingApplications 
          ? Math.round((pendingApplications / totalExperts) * 100)
          : 0;

        return {
          totalExperts: totalExperts || 0,
          qualifiedProfiles: qualifiedProfiles || 0,
          responseRate,
          activeMissions: activeCampaigns || 0,
          totalCampaigns: totalCampaigns || 0,
          activeCampaigns: activeCampaigns || 0,
          pendingApplications: pendingApplications || 0,
          completedApplications: completedApplications || 0,
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