import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FormField {
  id: string;
  field_key: string;
  field_type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'url' | 'date';
  label_fr: string;
  label_en?: string;
  placeholder?: string;
  description?: string;
  is_required: boolean;
  validation_rules?: Record<string, any>;
  options?: any[];
  display_order: number;
  field_section: string;
  is_active: boolean;
}

export function useFormFields(activeOnly = true) {
  return useQuery({
    queryKey: ['form-fields', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('form_fields_config')
        .select('*')
        .order('display_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FormField[];
    },
  });
}

export function useUpdateFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormField> }) => {
      const { data, error } = await supabase
        .from('form_fields_config')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      toast.success('Champ mis à jour');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour: ' + error.message);
    },
  });
}

export function useCreateFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: Omit<FormField, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('form_fields_config')
        .insert(field)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      toast.success('Champ créé');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création: ' + error.message);
    },
  });
}

export function useDeleteFormField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_fields_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      toast.success('Champ supprimé');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression: ' + error.message);
    },
  });
}
