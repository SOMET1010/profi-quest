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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(limit);

        if (error) {
          console.error("Error fetching profiles:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};