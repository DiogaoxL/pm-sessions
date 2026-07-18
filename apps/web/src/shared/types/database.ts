export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          auth_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          auth_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          auth_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      time_slots: {
        Row: {
          id: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity: number;
          status: 'OPEN' | 'FULL' | 'CLOSED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity?: number;
          status?: 'OPEN' | 'FULL' | 'CLOSED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          capacity?: number;
          status?: 'OPEN' | 'FULL' | 'CLOSED';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          time_slot_id: string;
          organizer_email: string;
          calendar_event_id: string | null;
          meet_url: string | null;
          capacity: number;
          current_participants: number;
          status: 'AVAILABLE' | 'FULL' | 'FINISHED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          time_slot_id: string;
          organizer_email: string;
          calendar_event_id?: string | null;
          meet_url?: string | null;
          capacity?: number;
          current_participants?: number;
          status?: 'AVAILABLE' | 'FULL' | 'FINISHED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          time_slot_id?: string;
          organizer_email?: string;
          calendar_event_id?: string | null;
          meet_url?: string | null;
          capacity?: number;
          current_participants?: number;
          status?: 'AVAILABLE' | 'FULL' | 'FINISHED';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_time_slot_id_fkey';
            columns: ['time_slot_id'];
            isOneToOne: false;
            referencedRelation: 'time_slots';
            referencedColumns: ['id'];
          },
        ];
      };
      participants: {
        Row: {
          id: string;
          session_id: string;
          name: string;
          email: string;
          phone: string | null;
          status: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'ABSENT';
          allocated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          name: string;
          email: string;
          phone?: string | null;
          status?: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'ABSENT';
          allocated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          status?: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'ABSENT';
          allocated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'participants_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
