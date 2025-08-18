import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = (limit = 20) => {
  return useQuery({
    queryKey: ["campaigns", limit],
    queryFn: async (): Promise<Campaign[]> => {
      try {
        // Return empty array until campaigns table is implemented
        // This will be replaced with real queries once the campaigns table exists
        return [];
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};