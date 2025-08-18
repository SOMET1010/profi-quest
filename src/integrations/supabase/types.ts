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
    PostgrestVersion: "13.0.4"
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
          application_status: string | null
          application_submitted_at: string | null
          available: boolean | null
          behavioral_skills: string | null
          certificates_url: string | null
          created_at: string
          diplomas_url: string | null
          email: string
          experience_years: number | null
          first_name: string
          hourly_rate: number | null
          id: string
          last_name: string
          location: string | null
          motivation_letter_url: string | null
          phone: string | null
          technical_skills: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_status?: string | null
          application_submitted_at?: string | null
          available?: boolean | null
          behavioral_skills?: string | null
          certificates_url?: string | null
          created_at?: string
          diplomas_url?: string | null
          email: string
          experience_years?: number | null
          first_name: string
          hourly_rate?: number | null
          id?: string
          last_name: string
          location?: string | null
          motivation_letter_url?: string | null
          phone?: string | null
          technical_skills?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_status?: string | null
          application_submitted_at?: string | null
          available?: boolean | null
          behavioral_skills?: string | null
          certificates_url?: string | null
          created_at?: string
          diplomas_url?: string | null
          email?: string
          experience_years?: number | null
          first_name?: string
          hourly_rate?: number | null
          id?: string
          last_name?: string
          location?: string | null
          motivation_letter_url?: string | null
          phone?: string | null
          technical_skills?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      projects: {
        Row: {
          axe_principal: Database["public"]["Enums"]["project_axe"] | null
          axes_casa: string
          budget: number
          chef_projet: string
          code: string
          created_at: string | null
          date_debut: string
          date_fin_prevue: string
          direction: string
          faisabilite_operationnelle: number | null
          id: number
          impact_strategique: number | null
          nom: string
          programme: string
          statut: Database["public"]["Enums"]["project_status"] | null
          taille_equipe: number | null
          updated_at: string | null
          viabilite_financiere: number | null
        }
        Insert: {
          axe_principal?: Database["public"]["Enums"]["project_axe"] | null
          axes_casa: string
          budget: number
          chef_projet: string
          code: string
          created_at?: string | null
          date_debut: string
          date_fin_prevue: string
          direction: string
          faisabilite_operationnelle?: number | null
          id?: number
          impact_strategique?: number | null
          nom: string
          programme: string
          statut?: Database["public"]["Enums"]["project_status"] | null
          taille_equipe?: number | null
          updated_at?: string | null
          viabilite_financiere?: number | null
        }
        Update: {
          axe_principal?: Database["public"]["Enums"]["project_axe"] | null
          axes_casa?: string
          budget?: number
          chef_projet?: string
          code?: string
          created_at?: string | null
          date_debut?: string
          date_fin_prevue?: string
          direction?: string
          faisabilite_operationnelle?: number | null
          id?: number
          impact_strategique?: number | null
          nom?: string
          programme?: string
          statut?: Database["public"]["Enums"]["project_status"] | null
          taille_equipe?: number | null
          updated_at?: string | null
          viabilite_financiere?: number | null
        }
        Relationships: []
      }
      projets: {
        Row: {
          avancement: string | null
          budget_consomme: number | null
          budget_prevu: number | null
          code: string | null
          date_debut: string | null
          date_fin_prevue: string | null
          direction_id: string | null
          id: string
          nom: string | null
          objectif: string | null
          programme_id: string | null
          statut: string | null
        }
        Insert: {
          avancement?: string | null
          budget_consomme?: number | null
          budget_prevu?: number | null
          code?: string | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          direction_id?: string | null
          id?: string
          nom?: string | null
          objectif?: string | null
          programme_id?: string | null
          statut?: string | null
        }
        Update: {
          avancement?: string | null
          budget_consomme?: number | null
          budget_prevu?: number | null
          code?: string | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          direction_id?: string | null
          id?: string
          nom?: string | null
          objectif?: string | null
          programme_id?: string | null
          statut?: string | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr_manager" | "expert"
      project_axe: "Infra" | "Services" | "Compétences" | "Gouvernance"
      project_status: "Planifié" | "En cours" | "Suspendu" | "Clôturé"
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
      app_role: ["admin", "hr_manager", "expert"],
      project_axe: ["Infra", "Services", "Compétences", "Gouvernance"],
      project_status: ["Planifié", "En cours", "Suspendu", "Clôturé"],
    },
  },
} as const
