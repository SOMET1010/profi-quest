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
        // Mock data for now since database schema is not yet created
        // This will be replaced with real queries once the migration is approved
        return [
          {
            id: "1",
            title: "Experts en IA pour mission gouvernementale",
            description: "Recherche d'experts en intelligence artificielle",
            status: "active",
            budget: 50000,
            deadline: "2024-12-31",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
          },
          {
            id: "2", 
            title: "Consultants en cybersécurité",
            description: "Mission de sécurisation des systèmes",
            status: "active",
            budget: 75000,
            deadline: "2024-11-30",
            created_at: "2024-01-10T09:00:00Z",
            updated_at: "2024-01-10T09:00:00Z",
          },
        ];
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};