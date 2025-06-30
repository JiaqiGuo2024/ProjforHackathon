export interface User {
  id: string;
  email: string;
  name: string;
  avatarColor: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'paper' | 'note';
  content?: string;
  url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Annotation {
  id: string;
  document_id: string;
  user_id: string;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content: string;
  color: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  user_color: string;
  content: string;
  type: 'text' | 'voice';
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_shared: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  created_by: string;
  attendees: string[];
  created_at: string;
}

export interface WorkspaceRoom {
  id: string;
  name: string;
  type: 'pdf' | 'editor' | 'general';
  participants: User[];
}