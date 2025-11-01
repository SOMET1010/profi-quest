import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["user-applications", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const { data, error } = await supabase
        .from("public_applications")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.email,
  });
};
