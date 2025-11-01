import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  location: string | null;
  experience_years: number | null;
  technical_skills: string | null;
  behavioral_skills: string | null;
  linkedin: string | null;
  github: string | null;
  motivation_letter_url: string | null;
  diplomas_url: string | null;
  certificates_url: string | null;
  application_status: string | null;
  application_submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data as UserProfile;
    },
    enabled: !!user,
  });
};
