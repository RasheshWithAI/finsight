export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          description: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          description?: string | null
          id?: never
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          description?: string | null
          id?: never
          updated_at?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          bookmarked_at: string
          id: string
          notes: string | null
          stock_symbol: string
          user_id: string
        }
        Insert: {
          bookmarked_at?: string
          id?: string
          notes?: string | null
          stock_symbol: string
          user_id: string
        }
        Update: {
          bookmarked_at?: string
          id?: string
          notes?: string | null
          stock_symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_finances: {
        Row: {
          created_at: string
          financial_goals: string | null
          id: string
          net_worth: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          financial_goals?: string | null
          id?: string
          net_worth?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          financial_goals?: string | null
          id?: string
          net_worth?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_budgets: {
        Row: {
          budget_amount: number
          budget_period: string
          category: string
          created_at: string
          end_date: string
          id: string
          start_date: string
          user_id: string
        }
        Insert: {
          budget_amount: number
          budget_period: string
          category: string
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          user_id: string
        }
        Update: {
          budget_amount?: number
          budget_period?: string
          category?: string
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          id: string
          payment_status: string | null
          plan_type: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          payment_status?: string | null
          plan_type: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          payment_status?: string | null
          plan_type?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          currency: string
          id: string
          language: string | null
          notification_preferences: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          currency?: string
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          currency?: string
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
