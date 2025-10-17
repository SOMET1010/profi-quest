export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activites: {
        Row: {
          code: string
          created_at: string | null
          date_debut_actualise: string | null
          date_debut_initial: string | null
          date_fin_actualise: string | null
          date_fin_initial: string | null
          description: string | null
          id: string
          nom: string
          projet_id: string | null
          responsable: string | null
          sponsor_programme: string | null
          statut: string | null
          taux_avancement: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          date_debut_actualise?: string | null
          date_debut_initial?: string | null
          date_fin_actualise?: string | null
          date_fin_initial?: string | null
          description?: string | null
          id?: string
          nom: string
          projet_id?: string | null
          responsable?: string | null
          sponsor_programme?: string | null
          statut?: string | null
          taux_avancement?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          date_debut_actualise?: string | null
          date_debut_initial?: string | null
          date_fin_actualise?: string | null
          date_fin_initial?: string | null
          description?: string | null
          id?: string
          nom?: string
          projet_id?: string | null
          responsable?: string | null
          sponsor_programme?: string | null
          statut?: string | null
          taux_avancement?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activites_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "projets_hierarchiques"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          description: string
          employee_matricule: string | null
          id: number
          project_id: number | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description: string
          employee_matricule?: string | null
          id?: number
          project_id?: number | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string
          employee_matricule?: string | null
          id?: number
          project_id?: number | null
        }
        Relationships: []
      }
      ansut_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          description: string | null
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          description?: string | null
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          description?: string | null
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"] | null
          actor_id: string | null
          actor_role: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["audit_action"] | null
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"] | null
          actor_id?: string | null
          actor_role?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      courriers_memos: {
        Row: {
          created_at: string | null
          date_reception: string | null
          destinataire: string | null
          expediteur: string | null
          id: string
          numero: string
          observations: string | null
          responsable_id: string | null
          statut: string | null
          sujet: string
          type: string
          urgence: string | null
        }
        Insert: {
          created_at?: string | null
          date_reception?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          numero: string
          observations?: string | null
          responsable_id?: string | null
          statut?: string | null
          sujet: string
          type: string
          urgence?: string | null
        }
        Update: {
          created_at?: string | null
          date_reception?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          numero?: string
          observations?: string | null
          responsable_id?: string | null
          statut?: string | null
          sujet?: string
          type?: string
          urgence?: string | null
        }
        Relationships: []
      }
      diligences: {
        Row: {
          action: string
          concerne_dtdi: boolean | null
          courrier_id: string | null
          created_at: string | null
          direction_assignee: string | null
          echeance: string | null
          id: string
          observations: string | null
          priorite: string | null
          responsable_id: string | null
          statut: string | null
        }
        Insert: {
          action: string
          concerne_dtdi?: boolean | null
          courrier_id?: string | null
          created_at?: string | null
          direction_assignee?: string | null
          echeance?: string | null
          id?: string
          observations?: string | null
          priorite?: string | null
          responsable_id?: string | null
          statut?: string | null
        }
        Update: {
          action?: string
          concerne_dtdi?: boolean | null
          courrier_id?: string | null
          created_at?: string | null
          direction_assignee?: string | null
          echeance?: string | null
          id?: string
          observations?: string | null
          priorite?: string | null
          responsable_id?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diligences_courrier_id_fkey"
            columns: ["courrier_id"]
            isOneToOne: false
            referencedRelation: "courriers_memos"
            referencedColumns: ["id"]
          },
        ]
      }
      directions: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          nom: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          actif: boolean | null
          created_at: string | null
          direction_code: string
          direction_label: string
          email: string
          fonction: string
          matricule: string
          nom_complet: string
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          direction_code: string
          direction_label: string
          email: string
          fonction: string
          matricule: string
          nom_complet: string
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          direction_code?: string
          direction_label?: string
          email?: string
          fonction?: string
          matricule?: string
          nom_complet?: string
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          error_type: string | null
          id: string
          message: string | null
          resolution_notes: string | null
          resolved_at: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          error_type?: string | null
          id?: string
          message?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          error_type?: string | null
          id?: string
          message?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events_ledger: {
        Row: {
          action: string | null
          actor: string | null
          at: string | null
          hash_curr: string | null
          hash_prev: string | null
          id: string
          payload: Json | null
        }
        Insert: {
          action?: string | null
          actor?: string | null
          at?: string | null
          hash_curr?: string | null
          hash_prev?: string | null
          id?: string
          payload?: Json | null
        }
        Update: {
          action?: string | null
          actor?: string | null
          at?: string | null
          hash_curr?: string | null
          hash_prev?: string | null
          id?: string
          payload?: Json | null
        }
        Relationships: []
      }
      kpi_data: {
        Row: {
          axes_count: number | null
          created_at: string | null
          date_snapshot: string | null
          directions_count: number | null
          id: number
          total_budget: number | null
          total_projects: number | null
        }
        Insert: {
          axes_count?: number | null
          created_at?: string | null
          date_snapshot?: string | null
          directions_count?: number | null
          id?: number
          total_budget?: number | null
          total_projects?: number | null
        }
        Update: {
          axes_count?: number | null
          created_at?: string | null
          date_snapshot?: string | null
          directions_count?: number | null
          id?: number
          total_budget?: number | null
          total_projects?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ansut_profile_id: string | null
          application_status: string | null
          application_submitted_at: string | null
          avatar_url: string | null
          behavioral_skills: string | null
          certificates_url: string | null
          created_at: string | null
          department: string | null
          diplomas_url: string | null
          email: string
          experience_years: number | null
          first_name: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          location: string | null
          motivation_letter_url: string | null
          phone: string | null
          preferences: Json | null
          role: string
          technical_skills: string | null
          updated_at: string | null
        }
        Insert: {
          ansut_profile_id?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          avatar_url?: string | null
          behavioral_skills?: string | null
          certificates_url?: string | null
          created_at?: string | null
          department?: string | null
          diplomas_url?: string | null
          email: string
          experience_years?: number | null
          first_name?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          motivation_letter_url?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string
          technical_skills?: string | null
          updated_at?: string | null
        }
        Update: {
          ansut_profile_id?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          avatar_url?: string | null
          behavioral_skills?: string | null
          certificates_url?: string | null
          created_at?: string | null
          department?: string | null
          diplomas_url?: string | null
          email?: string
          experience_years?: number | null
          first_name?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          location?: string | null
          motivation_letter_url?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string
          technical_skills?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_ansut_profile_id_fkey"
            columns: ["ansut_profile_id"]
            isOneToOne: false
            referencedRelation: "ansut_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          budget_alloue_2025: number | null
          budget_execute: number | null
          budget_total: number | null
          code: string | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          description: string | null
          direction_id: string | null
          id: string
          nom: string
          sponsor: string | null
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          budget_alloue_2025?: number | null
          budget_execute?: number | null
          budget_total?: number | null
          code?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          direction_id?: string | null
          id?: string
          nom: string
          sponsor?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_alloue_2025?: number | null
          budget_execute?: number | null
          budget_total?: number | null
          code?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          direction_id?: string | null
          id?: string
          nom?: string
          sponsor?: string | null
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programmes_direction_id_fkey"
            columns: ["direction_id"]
            isOneToOne: false
            referencedRelation: "directions"
            referencedColumns: ["id"]
          },
        ]
      }
      projets_hierarchiques: {
        Row: {
          budget_alloue_2025: number | null
          budget_execute: number | null
          budget_total: number | null
          chef_projet: string | null
          code: string
          competence_numerique_citoyenne: number | null
          created_at: string | null
          date_debut_actualise: string | null
          date_debut_initial: string | null
          date_fin_actualise: string | null
          date_fin_initial: string | null
          description: string | null
          gouvernance_excellence_operationnelle: number | null
          id: string
          infrastructure_base_numerique: number | null
          nom: string
          phase_deploiement: boolean | null
          phase_developpement: boolean | null
          phase_etude: boolean | null
          phase_exploitation_maintenance: boolean | null
          plan_pluriannuel: boolean | null
          points_arbitrage: string | null
          programme_id: string | null
          services_numeriques_essentiels: number | null
          sponsor: string | null
          statut: string | null
          taux_avancement: number | null
          taux_execution_financiere: number | null
          updated_at: string | null
        }
        Insert: {
          budget_alloue_2025?: number | null
          budget_execute?: number | null
          budget_total?: number | null
          chef_projet?: string | null
          code: string
          competence_numerique_citoyenne?: number | null
          created_at?: string | null
          date_debut_actualise?: string | null
          date_debut_initial?: string | null
          date_fin_actualise?: string | null
          date_fin_initial?: string | null
          description?: string | null
          gouvernance_excellence_operationnelle?: number | null
          id?: string
          infrastructure_base_numerique?: number | null
          nom: string
          phase_deploiement?: boolean | null
          phase_developpement?: boolean | null
          phase_etude?: boolean | null
          phase_exploitation_maintenance?: boolean | null
          plan_pluriannuel?: boolean | null
          points_arbitrage?: string | null
          programme_id?: string | null
          services_numeriques_essentiels?: number | null
          sponsor?: string | null
          statut?: string | null
          taux_avancement?: number | null
          taux_execution_financiere?: number | null
          updated_at?: string | null
        }
        Update: {
          budget_alloue_2025?: number | null
          budget_execute?: number | null
          budget_total?: number | null
          chef_projet?: string | null
          code?: string
          competence_numerique_citoyenne?: number | null
          created_at?: string | null
          date_debut_actualise?: string | null
          date_debut_initial?: string | null
          date_fin_actualise?: string | null
          date_fin_initial?: string | null
          description?: string | null
          gouvernance_excellence_operationnelle?: number | null
          id?: string
          infrastructure_base_numerique?: number | null
          nom?: string
          phase_deploiement?: boolean | null
          phase_developpement?: boolean | null
          phase_etude?: boolean | null
          phase_exploitation_maintenance?: boolean | null
          plan_pluriannuel?: boolean | null
          points_arbitrage?: string | null
          programme_id?: string | null
          services_numeriques_essentiels?: number | null
          sponsor?: string | null
          statut?: string | null
          taux_avancement?: number | null
          taux_execution_financiere?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projets_hierarchiques_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"] | null
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string | null
          id: string | null
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["audit_action"] | null
          actor_id?: string | null
          after_data?: never
          before_data?: never
          created_at?: string | null
          id?: string | null
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"] | null
          actor_id?: string | null
          after_data?: never
          before_data?: never
          created_at?: string | null
          id?: string | null
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_ansut_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_ansut_permission: {
        Args: { required_roles: string[] }
        Returns: boolean
      }
      has_ansut_role: {
        Args: { required_role: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "DG" | "FINANCE" | "AGENT" | "READONLY"
      audit_action: "INSERT" | "UPDATE" | "DELETE"
      kyc_status: "not_started" | "in_progress" | "completed" | "rejected"
      project_axe: "Infra" | "Services" | "Compétences" | "Gouvernance"
      project_status: "Planifié" | "En cours" | "Suspendu" | "Clôturé"
      virement_status: "PREPARATION" | "APPROBATION" | "EMISSION" | "RAPPROCHE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["DG", "FINANCE", "AGENT", "READONLY"],
      audit_action: ["INSERT", "UPDATE", "DELETE"],
      kyc_status: ["not_started", "in_progress", "completed", "rejected"],
      project_axe: ["Infra", "Services", "Compétences", "Gouvernance"],
      project_status: ["Planifié", "En cours", "Suspendu", "Clôturé"],
      virement_status: ["PREPARATION", "APPROBATION", "EMISSION", "RAPPROCHE"],
    },
  },
} as const
