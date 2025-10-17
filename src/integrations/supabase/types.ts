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
      cheques: {
        Row: {
          approved_by: string | null
          banque: string | null
          conflict_key: string | null
          created_at: string | null
          created_by: string | null
          date_entree_dg: string | null
          date_retrait: string | null
          date_signature: string | null
          deleted_at: string | null
          fournisseur_id: string | null
          id: string
          montant: number
          numero: string
          observation: string | null
          piece_jointe_url: string | null
          statut: Database["public"]["Enums"]["cheque_status"] | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          approved_by?: string | null
          banque?: string | null
          conflict_key?: string | null
          created_at?: string | null
          created_by?: string | null
          date_entree_dg?: string | null
          date_retrait?: string | null
          date_signature?: string | null
          deleted_at?: string | null
          fournisseur_id?: string | null
          id?: string
          montant: number
          numero: string
          observation?: string | null
          piece_jointe_url?: string | null
          statut?: Database["public"]["Enums"]["cheque_status"] | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          approved_by?: string | null
          banque?: string | null
          conflict_key?: string | null
          created_at?: string | null
          created_by?: string | null
          date_entree_dg?: string | null
          date_retrait?: string | null
          date_signature?: string | null
          deleted_at?: string | null
          fournisseur_id?: string | null
          id?: string
          montant?: number
          numero?: string
          observation?: string | null
          piece_jointe_url?: string | null
          statut?: Database["public"]["Enums"]["cheque_status"] | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cheques_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      cheques_status_corrections: {
        Row: {
          ancien_statut: string
          cheque_id: string
          corrected_at: string | null
          corrected_by: string | null
          correction_type: string
          date_retrait: string | null
          date_signature: string | null
          id: number
          nouveau_statut: string
        }
        Insert: {
          ancien_statut: string
          cheque_id: string
          corrected_at?: string | null
          corrected_by?: string | null
          correction_type: string
          date_retrait?: string | null
          date_signature?: string | null
          id?: number
          nouveau_statut: string
        }
        Update: {
          ancien_statut?: string
          cheque_id?: string
          corrected_at?: string | null
          corrected_by?: string | null
          correction_type?: string
          date_retrait?: string | null
          date_signature?: string | null
          id?: number
          nouveau_statut?: string
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
        Relationships: [
          {
            foreignKeyName: "courriers_memos_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          details: Json
          duration_ms: number | null
          id: string
          import_id: string
          recommendations: Json
          report_url: string | null
          session_type: string | null
          started_at: string
          status: string | null
          summary: Json
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          details?: Json
          duration_ms?: number | null
          id?: string
          import_id: string
          recommendations?: Json
          report_url?: string | null
          session_type?: string | null
          started_at?: string
          status?: string | null
          summary?: Json
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          details?: Json
          duration_ms?: number | null
          id?: string
          import_id?: string
          recommendations?: Json
          report_url?: string | null
          session_type?: string | null
          started_at?: string
          status?: string | null
          summary?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_sessions_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "staging_imports"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "diligences_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      facture_lignes: {
        Row: {
          created_at: string | null
          description: string
          facture_id: string
          id: string
          montant_ligne: number
          prix_unitaire: number
          quantite: number
        }
        Insert: {
          created_at?: string | null
          description: string
          facture_id: string
          id?: string
          montant_ligne?: number
          prix_unitaire?: number
          quantite?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          facture_id?: string
          id?: string
          montant_ligne?: number
          prix_unitaire?: number
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "facture_lignes_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          client_adresse: string | null
          client_email: string | null
          client_nom: string
          client_telephone: string | null
          created_at: string | null
          created_by: string | null
          date_echeance: string | null
          date_emission: string | null
          deleted_at: string | null
          devise: string
          dgi_invoice_id: string | null
          dgi_rejection_reason: string | null
          dgi_status: string | null
          dgi_validation_date: string | null
          id: string
          montant_ht: number
          montant_ttc: number
          montant_tva: number
          numero: string
          observations: string | null
          paid_at: string | null
          reference_externe: string | null
          sent_at: string | null
          statut: string
          taux_change: number
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
          version: number
        }
        Insert: {
          client_adresse?: string | null
          client_email?: string | null
          client_nom: string
          client_telephone?: string | null
          created_at?: string | null
          created_by?: string | null
          date_echeance?: string | null
          date_emission?: string | null
          deleted_at?: string | null
          devise?: string
          dgi_invoice_id?: string | null
          dgi_rejection_reason?: string | null
          dgi_status?: string | null
          dgi_validation_date?: string | null
          id?: string
          montant_ht?: number
          montant_ttc?: number
          montant_tva?: number
          numero: string
          observations?: string | null
          paid_at?: string | null
          reference_externe?: string | null
          sent_at?: string | null
          statut?: string
          taux_change?: number
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          version?: number
        }
        Update: {
          client_adresse?: string | null
          client_email?: string | null
          client_nom?: string
          client_telephone?: string | null
          created_at?: string | null
          created_by?: string | null
          date_echeance?: string | null
          date_emission?: string | null
          deleted_at?: string | null
          devise?: string
          dgi_invoice_id?: string | null
          dgi_rejection_reason?: string | null
          dgi_status?: string | null
          dgi_validation_date?: string | null
          id?: string
          montant_ht?: number
          montant_ttc?: number
          montant_tva?: number
          numero?: string
          observations?: string | null
          paid_at?: string | null
          reference_externe?: string | null
          sent_at?: string | null
          statut?: string
          taux_change?: number
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      fournisseurs: {
        Row: {
          adresse: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          nif: string | null
          nom: string
          statut: Database["public"]["Enums"]["fournisseur_status"] | null
          telephone: string | null
          tva_exonere: boolean | null
          tva_numero: string | null
          tva_taux: number | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          nif?: string | null
          nom: string
          statut?: Database["public"]["Enums"]["fournisseur_status"] | null
          telephone?: string | null
          tva_exonere?: boolean | null
          tva_numero?: string | null
          tva_taux?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          nif?: string | null
          nom?: string
          statut?: Database["public"]["Enums"]["fournisseur_status"] | null
          telephone?: string | null
          tva_exonere?: boolean | null
          tva_numero?: string | null
          tva_taux?: number | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      journaux_bancaires: {
        Row: {
          code: string
          created_at: string | null
          libelle: string
        }
        Insert: {
          code: string
          created_at?: string | null
          libelle: string
        }
        Update: {
          code?: string
          created_at?: string | null
          libelle?: string
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
      kyc_workflows: {
        Row: {
          ballerine_data: Json | null
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
          workflow_id: string
          workflow_type: string
        }
        Insert: {
          ballerine_data?: Json | null
          created_at?: string | null
          id?: string
          status: string
          updated_at?: string | null
          user_id: string
          workflow_id: string
          workflow_type: string
        }
        Update: {
          ballerine_data?: Json | null
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          workflow_id?: string
          workflow_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
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
          user_id: string | null
        }
        Insert: {
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
          user_id?: string | null
        }
        Update: {
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
      staging_import_rows: {
        Row: {
          conflict_key: string | null
          created_at: string | null
          entity_type: string | null
          error_msg: string | null
          id: string
          import_id: string | null
          normalized_data: Json | null
          raw_data: Json | null
          status: Database["public"]["Enums"]["row_status"] | null
        }
        Insert: {
          conflict_key?: string | null
          created_at?: string | null
          entity_type?: string | null
          error_msg?: string | null
          id?: string
          import_id?: string | null
          normalized_data?: Json | null
          raw_data?: Json | null
          status?: Database["public"]["Enums"]["row_status"] | null
        }
        Update: {
          conflict_key?: string | null
          created_at?: string | null
          entity_type?: string | null
          error_msg?: string | null
          id?: string
          import_id?: string | null
          normalized_data?: Json | null
          raw_data?: Json | null
          status?: Database["public"]["Enums"]["row_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "staging_import_rows_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "staging_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      staging_imports: {
        Row: {
          created_at: string | null
          created_by: string | null
          error_summary: Json | null
          id: string
          processing_time_ms: number | null
          rows_failed: number | null
          rows_ok: number | null
          rows_total: number | null
          status: Database["public"]["Enums"]["import_status"] | null
          throughput_rows_per_second: number | null
          type: Database["public"]["Enums"]["import_type"] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error_summary?: Json | null
          id?: string
          processing_time_ms?: number | null
          rows_failed?: number | null
          rows_ok?: number | null
          rows_total?: number | null
          status?: Database["public"]["Enums"]["import_status"] | null
          throughput_rows_per_second?: number | null
          type?: Database["public"]["Enums"]["import_type"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error_summary?: Json | null
          id?: string
          processing_time_ms?: number | null
          rows_failed?: number | null
          rows_ok?: number | null
          rows_total?: number | null
          status?: Database["public"]["Enums"]["import_status"] | null
          throughput_rows_per_second?: number | null
          type?: Database["public"]["Enums"]["import_type"] | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          kyc_completed_at: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          phone: string | null
          pro_member: boolean | null
          updated_at: string | null
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          kyc_completed_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
          pro_member?: boolean | null
          updated_at?: string | null
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          kyc_completed_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
          pro_member?: boolean | null
          updated_at?: string | null
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: []
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
      users: {
        Row: {
          actif: boolean | null
          created_at: string | null
          direction: string | null
          email: string
          id: string
          nom: string
          role: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          direction?: string | null
          email: string
          id?: string
          nom: string
          role?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          direction?: string | null
          email?: string
          id?: string
          nom?: string
          role?: string | null
        }
        Relationships: []
      }
      virement_lignes: {
        Row: {
          created_at: string | null
          facture_ref: string | null
          fournisseur_id: string | null
          id: string
          montant: number
          virement_id: string | null
        }
        Insert: {
          created_at?: string | null
          facture_ref?: string | null
          fournisseur_id?: string | null
          id?: string
          montant: number
          virement_id?: string | null
        }
        Update: {
          created_at?: string | null
          facture_ref?: string | null
          fournisseur_id?: string | null
          id?: string
          montant?: number
          virement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "virement_lignes_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      virements: {
        Row: {
          banque_emettrice: string
          banque_receptrice: string
          beneficiaire_compte: string | null
          beneficiaire_nom: string
          compte_emetteur: string | null
          compte_recepteur: string
          created_at: string | null
          created_by: string | null
          date_creation: string | null
          date_execution: string | null
          date_validation: string | null
          deleted_at: string | null
          executed_by: string | null
          frais_bancaires: number | null
          id: string
          montant: number
          numero: string
          objet: string | null
          reference_bancaire: string | null
          statut: string | null
          type_virement: string | null
          updated_at: string | null
          validated_by: string | null
          version: number | null
        }
        Insert: {
          banque_emettrice: string
          banque_receptrice: string
          beneficiaire_compte?: string | null
          beneficiaire_nom: string
          compte_emetteur?: string | null
          compte_recepteur: string
          created_at?: string | null
          created_by?: string | null
          date_creation?: string | null
          date_execution?: string | null
          date_validation?: string | null
          deleted_at?: string | null
          executed_by?: string | null
          frais_bancaires?: number | null
          id?: string
          montant: number
          numero: string
          objet?: string | null
          reference_bancaire?: string | null
          statut?: string | null
          type_virement?: string | null
          updated_at?: string | null
          validated_by?: string | null
          version?: number | null
        }
        Update: {
          banque_emettrice?: string
          banque_receptrice?: string
          beneficiaire_compte?: string | null
          beneficiaire_nom?: string
          compte_emetteur?: string | null
          compte_recepteur?: string
          created_at?: string | null
          created_by?: string | null
          date_creation?: string | null
          date_execution?: string | null
          date_validation?: string | null
          deleted_at?: string | null
          executed_by?: string | null
          frais_bancaires?: number | null
          id?: string
          montant?: number
          numero?: string
          objet?: string | null
          reference_bancaire?: string | null
          statut?: string | null
          type_virement?: string | null
          updated_at?: string | null
          validated_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      kpi_performance_globale: {
        Row: {
          avancement_moyen_projets: number | null
          budget_total_alloue: number | null
          budget_total_consomme: number | null
          courriers_traites: number | null
          derniere_maj: string | null
          diligences_dtdi: number | null
          diligences_prioritaires: number | null
          diligences_retard: number | null
          score_performance_diligences: number | null
          status_budget: string | null
          taux_consommation_budget: number | null
          taux_traitement_courriers: number | null
          total_courriers: number | null
          total_diligences: number | null
          total_projets: number | null
        }
        Relationships: []
      }
      mv_cheques_kpi: {
        Row: {
          en_attente: number | null
          fournisseurs_uniques: number | null
          montant_moyen: number | null
          montant_total: number | null
          month: string | null
          retires: number | null
          signes: number | null
          total_cheques: number | null
          traites_rapidement: number | null
        }
        Relationships: []
      }
      mv_import_performance: {
        Row: {
          avg_processing_time: number | null
          avg_throughput: number | null
          date_group: string | null
          failed_imports: number | null
          failed_rows: number | null
          successful_imports: number | null
          successful_rows: number | null
          total_imports: number | null
          total_rows: number | null
          type: Database["public"]["Enums"]["import_type"] | null
        }
        Relationships: []
      }
      v_cheques_status_corrections_summary: {
        Row: {
          correction_type: string | null
          derniere_correction: string | null
          nombre_corrections: number | null
          premiere_correction: string | null
        }
        Relationships: []
      }
      v_debug_dashboard: {
        Row: {
          avg_duration_ms: number | null
          completed_sessions: number | null
          date: string | null
          sessions_with_issues: number | null
          total_sessions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_default_values: {
        Args: { import_id_param: string }
        Returns: undefined
      }
      check_cheques_consistency: {
        Args: Record<PropertyKey, never>
        Returns: {
          inconsistencies: number
          last_check: string
          total_cheques: number
        }[]
      }
      cleanup_old_imports: {
        Args: { days_to_keep?: number; dry_run?: boolean }
        Returns: {
          action: string
          count: number
        }[]
      }
      deduplicate_import_rows: {
        Args: { import_id_param: string }
        Returns: number
      }
      detect_duplicates: {
        Args: { data: Json; entity_type: string; fuzzy_threshold?: number }
        Returns: {
          confidence: number
          match_field: string
          potential_duplicate_id: string
        }[]
      }
      fuzzy_search_fournisseurs: {
        Args:
          | { max_results?: number; search_term: string; threshold?: number }
          | { search_term: string }
        Returns: {
          id: string
          nom: string
          similarity: number
        }[]
      }
      get_ansut_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_import_statistics: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_processing_time_ms: number
          avg_throughput_rps: number
          failed_imports: number
          failed_rows: number
          import_type: string
          successful_imports: number
          successful_rows: number
          total_imports: number
          total_rows: number
        }[]
      }
      has_ansut_permission: {
        Args: { required_roles: string[] }
        Returns: boolean
      }
      has_ansut_role: {
        Args: { required_role: string }
        Returns: boolean
      }
      manual_process_import: {
        Args: { import_uuid: string }
        Returns: Json
      }
      optimize_import_performance: {
        Args: { import_id_param: string }
        Returns: undefined
      }
      refresh_cheques_kpi: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_import_performance_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_stuck_import: {
        Args: { import_id_param: string }
        Returns: boolean
      }
      retry_import: {
        Args: { import_id_param: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      trigger_import_processing: {
        Args: { import_uuid: string }
        Returns: Json
      }
      validate_import_data: {
        Args: { data: Json; entity_type: string }
        Returns: {
          errors: string[]
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "DG" | "FINANCE" | "AGENT" | "READONLY"
      audit_action: "INSERT" | "UPDATE" | "DELETE"
      cheque_status: "EN_ATTENTE" | "SIGNE" | "RETIRE"
      fournisseur_status: "ACTIF" | "INACTIF" | "SUSPENDU"
      import_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      import_type: "CHEQUES" | "FOURNISSEURS" | "VIREMENTS"
      kyc_status: "not_started" | "in_progress" | "completed" | "rejected"
      project_axe: "Infra" | "Services" | "Compétences" | "Gouvernance"
      project_status: "Planifié" | "En cours" | "Suspendu" | "Clôturé"
      row_status: "PENDING" | "READY" | "CONFLICT" | "PROCESSED" | "FAILED"
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
      cheque_status: ["EN_ATTENTE", "SIGNE", "RETIRE"],
      fournisseur_status: ["ACTIF", "INACTIF", "SUSPENDU"],
      import_status: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      import_type: ["CHEQUES", "FOURNISSEURS", "VIREMENTS"],
      kyc_status: ["not_started", "in_progress", "completed", "rejected"],
      project_axe: ["Infra", "Services", "Compétences", "Gouvernance"],
      project_status: ["Planifié", "En cours", "Suspendu", "Clôturé"],
      row_status: ["PENDING", "READY", "CONFLICT", "PROCESSED", "FAILED"],
      virement_status: ["PREPARATION", "APPROBATION", "EMISSION", "RAPPROCHE"],
    },
  },
} as const
