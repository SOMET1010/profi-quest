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
        // Optimized Supabase queries using existing profiles table
        // Query specific columns only, avoid select("*")
        const [profilesResult, qualifiedProfilesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('available', true)
        ]);

        const totalExperts = profilesResult.count || 0;
        const qualifiedProfiles = qualifiedProfilesResult.count || 0;
        
        // Mock values for features not yet implemented in database
        const totalCampaigns = 0;
        const activeCampaigns = 0;
        const pendingApplications = 0;
        const completedApplications = 0;

        // Calculate response rate
        const responseRate = totalExperts && pendingApplications 
          ? Math.round((pendingApplications / totalExperts) * 100)
          : 0;

        return {
          totalExperts,
          qualifiedProfiles,
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