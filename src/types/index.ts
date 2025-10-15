// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Chat Room Types
export interface Room {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  unread?: number;
  isAI?: boolean;
}

// Message Types
export interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

export interface FormattedMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI: boolean;
}

// AI State Types
export interface AIState {
  listening: boolean;
  analyzing: boolean;
  context: string;
  participants: string[];
}

// Team Member Types
export interface TeamMember {
  name: string;
  avatar: string;
  color: string;
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}