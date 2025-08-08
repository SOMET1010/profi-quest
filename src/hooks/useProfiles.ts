import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  experience_years: number;
  hourly_rate: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfiles = (limit = 50) => {
  return useQuery({
    queryKey: ["profiles", limit],
    queryFn: async (): Promise<Profile[]> => {
      try {
        // Mock data for now since database schema is not yet created
        // This will be replaced with real queries once the migration is approved
        return [
          {
            id: "1",
            user_id: "user1",
            first_name: "Marie",
            last_name: "Dupont",
            email: "marie.dupont@example.com",
            phone: "+33 1 23 45 67 89",
            location: "Paris, France",
            experience_years: 8,
            hourly_rate: 650,
            available: true,
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
          },
          {
            id: "2",
            user_id: "user2", 
            first_name: "Jean",
            last_name: "Martin",
            email: "jean.martin@example.com",
            phone: "+33 1 23 45 67 90",
            location: "Lyon, France",
            experience_years: 12,
            hourly_rate: 750,
            available: true,
            created_at: "2024-01-10T09:00:00Z",
            updated_at: "2024-01-10T09:00:00Z",
          },
        ];
      } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};