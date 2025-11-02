import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ApplicationWithHistory {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  cv_url: string | null;
  motivation_letter_url: string | null;
  technical_skills: string | null;
  behavioral_skills: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  experience_years: number | null;
  status: string;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export const useApplicationManagement = (filters?: {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const queryClient = useQueryClient();

  const applicationsQuery = useQuery({
    queryKey: ["applications-management", filters],
    queryFn: async (): Promise<ApplicationWithHistory[]> => {
      let query = supabase
        .from("public_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  const historyQuery = (applicationId: string) =>
    useQuery({
      queryKey: ["application-history", applicationId],
      queryFn: async (): Promise<StatusHistory[]> => {
        const { data, error } = await supabase
          .from("application_status_history")
          .select("*")
          .eq("application_id", applicationId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!applicationId,
    });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      applicationId,
      newStatus,
      notes,
      sendEmail = true,
    }: {
      applicationId: string;
      newStatus: string;
      notes?: string;
      sendEmail?: boolean;
    }) => {
      // Call the database function
      const { data, error } = await supabase.rpc("update_application_status", {
        _application_id: applicationId,
        _new_status: newStatus,
        _notes: notes || null,
      });

      if (error) throw error;

      // Send email notification if requested
      if (sendEmail && data) {
        try {
          const result = data as any;
          await supabase.functions.invoke("send-status-update-email", {
            body: {
              firstName: result.first_name,
              lastName: result.last_name,
              email: result.email,
              status: newStatus,
              notes: notes,
            },
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Don't throw - status was updated successfully
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-management"] });
      queryClient.invalidateQueries({ queryKey: ["application-history"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({
      applicationIds,
      newStatus,
      notes,
    }: {
      applicationIds: string[];
      newStatus: string;
      notes?: string;
    }) => {
      const promises = applicationIds.map((id) =>
        supabase.rpc("update_application_status", {
          _application_id: id,
          _new_status: newStatus,
          _notes: notes || null,
        })
      );

      const results = await Promise.all(promises);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        throw new Error(`${errors.length} mises à jour ont échoué`);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications-management"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Statuts mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  return {
    applications: applicationsQuery.data || [],
    isLoading: applicationsQuery.isLoading,
    error: applicationsQuery.error,
    updateStatus: updateStatusMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    isUpdating: updateStatusMutation.isPending || bulkUpdateMutation.isPending,
    historyQuery,
  };
};
