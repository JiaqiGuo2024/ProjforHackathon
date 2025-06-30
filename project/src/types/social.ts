export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarColor: string;
  headline?: string;
  bio?: string;
  institution?: string;
  field?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface MediaPost {
  id: string;
  author: string;
  authorName: string;
  authorAvatar: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  caption: string;
  reactions: Record<string, string[]>; // emoji -> user IDs
  created_at: string;
}

export interface ExtendedIdea {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  recruitment: boolean;
  allowed_viewers: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface VaultItem {
  id: string;
  owner: string;
  filename: string;
  encrypted_blob: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_color: string;
  content: string;
  created_at: string;
}