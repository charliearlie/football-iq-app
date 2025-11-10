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
      game_sessions: {
        Row: {
          current_question_index: number
          game_mode: Database["public"]["Enums"]["game_mode_type"]
          id: string
          last_activity_at: string
          pack_id: string
          score: number
          session_state: Json | null
          started_at: string
          user_id: string
        }
        Insert: {
          current_question_index?: number
          game_mode: Database["public"]["Enums"]["game_mode_type"]
          id?: string
          last_activity_at?: string
          pack_id: string
          score?: number
          session_state?: Json | null
          started_at?: string
          user_id: string
        }
        Update: {
          current_question_index?: number
          game_mode?: Database["public"]["Enums"]["game_mode_type"]
          id?: string
          last_activity_at?: string
          pack_id?: string
          score?: number
          session_state?: Json | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          accuracy_rate: number
          correct_answers: number
          id: string
          rank: number | null
          total_questions: number
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          correct_answers?: number
          id?: string
          rank?: number | null
          total_questions?: number
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          correct_answers?: number
          id?: string
          rank?: number | null
          total_questions?: number
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      packs: {
        Row: {
          created_at: string
          description: string | null
          difficulty_range: string | null
          id: string
          is_free: boolean
          name: string
          price: number | null
          question_count: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_range?: string | null
          id?: string
          is_free?: boolean
          name: string
          price?: number | null
          question_count?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_range?: string | null
          id?: string
          is_free?: boolean
          name?: string
          price?: number | null
          question_count?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          aliases: Json
          career_path: Json
          created_at: string
          difficulty: number
          full_name: string | null
          hints: Json | null
          id: string
          name: string
          nationality: string
          pack_id: string
          position: string | null
          updated_at: string
        }
        Insert: {
          aliases?: Json
          career_path: Json
          created_at?: string
          difficulty: number
          full_name?: string | null
          hints?: Json | null
          id?: string
          name: string
          nationality: string
          pack_id: string
          position?: string | null
          updated_at?: string
        }
        Update: {
          aliases?: Json
          career_path?: Json
          created_at?: string
          difficulty?: number
          full_name?: string | null
          hints?: Json | null
          id?: string
          name?: string
          nationality?: string
          pack_id?: string
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_packs: {
        Row: {
          id: string
          pack_id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          id?: string
          pack_id: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          id?: string
          pack_id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_packs_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          answered_correctly: boolean
          attempts: number
          completed_at: string
          game_mode: Database["public"]["Enums"]["game_mode_type"]
          id: string
          player_id: string
          score_earned: number
          user_id: string
        }
        Insert: {
          answered_correctly: boolean
          attempts?: number
          completed_at?: string
          game_mode: Database["public"]["Enums"]["game_mode_type"]
          id?: string
          player_id: string
          score_earned?: number
          user_id: string
        }
        Update: {
          answered_correctly?: boolean
          attempts?: number
          completed_at?: string
          game_mode?: Database["public"]["Enums"]["game_mode_type"]
          id?: string
          player_id?: string
          score_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pack_with_players: {
        Args: { p_slug: string }
        Returns: {
          pack_description: string
          pack_id: string
          pack_is_free: boolean
          pack_name: string
          pack_price: number
          pack_slug: string
          player_aliases: Json
          player_career_path: Json
          player_difficulty: number
          player_full_name: string
          player_hints: Json
          player_id: string
          player_name: string
          player_nationality: string
          player_position: string
        }[]
      }
      get_user_stats: {
        Args: { p_user_id: string }
        Returns: {
          accuracy_rate: number
          correct_answers: number
          global_rank: number
          packs_owned: number
          total_questions: number
          total_score: number
        }[]
      }
    }
    Enums: {
      game_mode_type:
        | "career_path_progressive"
        | "career_path_full"
        | "transfer"
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Table row types
export type Pack = Tables<'packs'>
export type Player = Tables<'players'>
export type UserPack = Tables<'user_packs'>
export type UserProgress = Tables<'user_progress'>
export type GameSession = Tables<'game_sessions'>
export type Leaderboard = Tables<'leaderboards'>

// Enum types
export type GameMode = Enums<'game_mode_type'>

// Extended types for frontend use
export interface PlayerWithCareer extends Player {
  career_path: string[]
  aliases: string[]
  hints?: {
    hint1?: string
    hint2?: string
    hint3?: string
  }
}

export interface PackWithPlayers extends Pack {
  players: PlayerWithCareer[]
}

export interface UserStats {
  total_score: number
  total_questions: number
  correct_answers: number
  accuracy_rate: number
  global_rank: number
  packs_owned: number
}
