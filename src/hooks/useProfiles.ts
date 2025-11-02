import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interface alignée avec le schéma complet de la table profiles
// Inclut les champs standards + champs de candidature d'expert
export interface Profile {
  id: string;
  ansut_profile_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  department: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
  // Champs de candidature d'expert
  first_name: string | null;
  last_name: string | null;
  location: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  technical_skills: string | null;
  behavioral_skills: string | null;
  motivation_letter_url: string | null;
  diplomas_url: string | null;
  certificates_url: string | null;
  application_status: string | null;
  application_submitted_at: string | null;
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

        return (data || []) as Profile[];
      } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};