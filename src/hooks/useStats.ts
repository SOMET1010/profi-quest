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
        // Mock data for now since database schema is not yet created
        // This will be replaced with real queries once the migration is approved
        return {
          totalExperts: 2341,
          qualifiedProfiles: 1897,
          responseRate: 78,
          activeMissions: 45,
          totalCampaigns: 23,
          activeCampaigns: 23,
          pendingApplications: 156,
          completedApplications: 312,
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