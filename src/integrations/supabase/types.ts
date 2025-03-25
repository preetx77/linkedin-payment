export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
          status: 'draft' | 'published'
          reference_creators: string[] | null
          post_idea: string
          linkedin_post_id: string | null
          analytics: Json | null
          scheduled_for: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          content: string
          status?: 'draft' | 'published'
          reference_creators?: string[] | null
          post_idea: string
          linkedin_post_id?: string | null
          analytics?: Json | null
          scheduled_for?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
          status?: 'draft' | 'published'
          reference_creators?: string[] | null
          post_idea?: string
          linkedin_post_id?: string | null
          analytics?: Json | null
          scheduled_for?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          linkedin_token: string | null
          email_notifications: boolean
          default_post_style: string | null
          favorite_creators: string[] | null
          theme: 'light' | 'dark'
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          linkedin_token?: string | null
          email_notifications?: boolean
          default_post_style?: string | null
          favorite_creators?: string[] | null
          theme?: 'light' | 'dark'
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          linkedin_token?: string | null
          email_notifications?: boolean
          default_post_style?: string | null
          favorite_creators?: string[] | null
          theme?: 'light' | 'dark'
        }
      }
      analytics: {
        Row: {
          id: string
          post_id: string
          created_at: string
          views: number
          likes: number
          comments: number
          shares: number
          click_through_rate: number
          engagement_rate: number
        }
        Insert: {
          id?: string
          post_id: string
          created_at?: string
          views?: number
          likes?: number
          comments?: number
          shares?: number
          click_through_rate?: number
          engagement_rate?: number
        }
        Update: {
          id?: string
          post_id?: string
          created_at?: string
          views?: number
          likes?: number
          comments?: number
          shares?: number
          click_through_rate?: number
          engagement_rate?: number
        }
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
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export interface PostMetrics {
  id: string;
  post_id: string;
  user_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PostEngagement {
  id: string;
  post_id: string;
  user_id: string;
  engagement_type: 'like' | 'comment' | 'share' | 'click';
  created_at: string;
}

export interface PostLearningData {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  topic: string;
  tone: string;
  success_score: number;
  engagement_metrics: PostMetrics;
  created_at: string;
}
