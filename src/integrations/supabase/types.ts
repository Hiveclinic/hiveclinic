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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_client_notes: {
        Row: {
          created_at: string
          created_by: string | null
          customer_email: string
          id: string
          note: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_email: string
          id?: string
          note: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_email?: string
          id?: string
          note?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          slot_duration_mins: number
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          slot_duration_mins?: number
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          slot_duration_mins?: number
          start_time?: string
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          addon_ids: string[] | null
          addon_total: number | null
          aftercare_sent: boolean
          booking_date: string
          booking_time: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          deposit_amount: number | null
          discount_amount: number | null
          discount_code_id: string | null
          duration_mins: number
          id: string
          notes: string | null
          package_id: string | null
          payment_status: string
          reminder_sent: boolean
          reschedule_count: number
          setmore_booking_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_price: number
          treatment_id: string
          updated_at: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          addon_ids?: string[] | null
          addon_total?: number | null
          aftercare_sent?: boolean
          booking_date: string
          booking_time: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          deposit_amount?: number | null
          discount_amount?: number | null
          discount_code_id?: string | null
          duration_mins: number
          id?: string
          notes?: string | null
          package_id?: string | null
          payment_status?: string
          reminder_sent?: boolean
          reschedule_count?: number
          setmore_booking_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price: number
          treatment_id: string
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          addon_ids?: string[] | null
          addon_total?: number | null
          aftercare_sent?: boolean
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          deposit_amount?: number | null
          discount_amount?: number | null
          discount_code_id?: string | null
          duration_mins?: number
          id?: string
          notes?: string | null
          package_id?: string | null
          payment_status?: string
          reminder_sent?: boolean
          reschedule_count?: number
          setmore_booking_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price?: number
          treatment_id?: string
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      client_images: {
        Row: {
          customer_email: string
          id: string
          image_type: string
          image_url: string
          notes: string | null
          treatment_name: string | null
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          customer_email: string
          id?: string
          image_type?: string
          image_url: string
          notes?: string | null
          treatment_name?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          customer_email?: string
          id?: string
          image_type?: string
          image_url?: string
          notes?: string | null
          treatment_name?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          contacted: boolean
          contacted_at: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          medical_notes: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id?: string
          medical_notes?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          medical_notes?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          applicable_treatments: string[] | null
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          max_uses: number | null
          min_spend: number | null
          used_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          applicable_treatments?: string[] | null
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          max_uses?: number | null
          min_spend?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          applicable_treatments?: string[] | null
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          max_uses?: number | null
          min_spend?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      gdpr_consents: {
        Row: {
          consent_type: string
          consented: boolean
          consented_at: string
          customer_email: string
          id: string
          ip_address: string | null
          withdrawn_at: string | null
        }
        Insert: {
          consent_type: string
          consented?: boolean
          consented_at?: string
          customer_email: string
          id?: string
          ip_address?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          consent_type?: string
          consented?: boolean
          consented_at?: string
          customer_email?: string
          id?: string
          ip_address?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      payment_plans: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          instalment_amount: number
          next_payment_date: string | null
          paid_instalments: number
          status: string
          stripe_subscription_id: string | null
          total_amount: number
          total_instalments: number
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          instalment_amount: number
          next_payment_date?: string | null
          paid_instalments?: number
          status?: string
          stripe_subscription_id?: string | null
          total_amount: number
          total_instalments?: number
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          instalment_amount?: number
          next_payment_date?: string | null
          paid_instalments?: number
          status?: string
          stripe_subscription_id?: string | null
          total_amount?: number
          total_instalments?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          announcement_active: boolean | null
          announcement_link: string | null
          announcement_text: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          announcement_active?: boolean | null
          announcement_link?: string | null
          announcement_text?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          announcement_active?: boolean | null
          announcement_link?: string | null
          announcement_text?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      treatment_addons: {
        Row: {
          active: boolean
          applicable_categories: string[] | null
          created_at: string
          description: string | null
          duration_mins: number
          id: string
          name: string
          price: number
          sort_order: number | null
        }
        Insert: {
          active?: boolean
          applicable_categories?: string[] | null
          created_at?: string
          description?: string | null
          duration_mins?: number
          id?: string
          name: string
          price?: number
          sort_order?: number | null
        }
        Update: {
          active?: boolean
          applicable_categories?: string[] | null
          created_at?: string
          description?: string | null
          duration_mins?: number
          id?: string
          name?: string
          price?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      treatment_packages: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          price_per_session: number
          sessions_count: number
          sort_order: number | null
          total_price: number
          treatment_id: string
          valid_days: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          price_per_session: number
          sessions_count?: number
          sort_order?: number | null
          total_price: number
          treatment_id: string
          valid_days?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          price_per_session?: number
          sessions_count?: number
          sort_order?: number | null
          total_price?: number
          treatment_id?: string
          valid_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "treatment_packages_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_variants: {
        Row: {
          active: boolean
          created_at: string
          deposit_amount: number | null
          duration_mins: number
          id: string
          name: string
          price: number
          sort_order: number | null
          treatment_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          deposit_amount?: number | null
          duration_mins?: number
          id?: string
          name: string
          price: number
          sort_order?: number | null
          treatment_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          deposit_amount?: number | null
          duration_mins?: number
          id?: string
          name?: string
          price?: number
          sort_order?: number | null
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_variants_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          active: boolean
          category: string
          created_at: string
          deposit_amount: number | null
          deposit_required: boolean
          description: string | null
          duration_mins: number
          id: string
          image_url: string | null
          name: string
          offer_label: string | null
          offer_price: number | null
          on_offer: boolean
          payment_type: string
          price: number
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          duration_mins?: number
          id?: string
          image_url?: string | null
          name: string
          offer_label?: string | null
          offer_price?: number | null
          on_offer?: boolean
          payment_type?: string
          price: number
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          duration_mins?: number
          id?: string
          image_url?: string | null
          name?: string
          offer_label?: string | null
          offer_price?: number | null
          on_offer?: boolean
          payment_type?: string
          price?: number
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
