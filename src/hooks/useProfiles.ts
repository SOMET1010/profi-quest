import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interface alignée avec le schéma réel de la table profiles
export interface Profile {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  preferences: any;
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