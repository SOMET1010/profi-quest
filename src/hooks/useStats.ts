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
  acceptanceRate: number;
  avgProcessingDays: number;
  newApplicationsToday: number;
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
        
        // Count pending applications from public_applications
        const { count: pendingApplications } = await supabase
          .from('public_applications')
          .select('*', { count: 'exact', head: true })
          .in('status', ['new', 'reviewed', 'shortlisted']);

        // Count completed applications (accepted/rejected)
        const { count: completedApplications } = await supabase
          .from('public_applications')
          .select('*', { count: 'exact', head: true })
          .in('status', ['accepted', 'rejected']);

        // Count applications created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: newApplicationsToday } = await supabase
          .from('public_applications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Calculate acceptance rate
        const totalDecided = (completedApplications || 0);
        const { count: accepted } = await supabase
          .from('public_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'accepted');

        const acceptanceRate = totalDecided > 0 
          ? Math.round(((accepted || 0) / totalDecided) * 100) 
          : 0;

        // Calculate average processing time (in days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: processedApps } = await supabase
          .from('public_applications')
          .select('created_at, reviewed_at')
          .not('reviewed_at', 'is', null)
          .gte('created_at', thirtyDaysAgo.toISOString());

        let avgProcessingDays = 0;
        if (processedApps && processedApps.length > 0) {
          const totalTime = processedApps.reduce((sum, app) => {
            const created = new Date(app.created_at).getTime();
            const reviewed = new Date(app.reviewed_at!).getTime();
            return sum + (reviewed - created);
          }, 0);
          avgProcessingDays = Math.round(totalTime / processedApps.length / (1000 * 60 * 60 * 24));
        }

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
          pendingApplications: pendingApplications || 0,
          completedApplications: completedApplications || 0,
          acceptanceRate,
          avgProcessingDays,
          newApplicationsToday: newApplicationsToday || 0,
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
          acceptanceRate: 0,
          avgProcessingDays: 0,
          newApplicationsToday: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};