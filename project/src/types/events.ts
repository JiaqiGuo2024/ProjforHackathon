export interface Event {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  type: 'meeting' | 'conference';
  start_ts: string;
  end_ts: string;
  host: string;
  poster_urls: string[];
  tags: string[];
  allow_public: boolean;
  created_at: string;
}

export interface EventParticipant {
  event_id: string;
  user_id: string;
  role: 'host' | 'speaker' | 'attendee';
}

export interface EventRating {
  id: string;
  event_id: string;
  user_id: string;
  score: number;
  comment: string;
  anonymous: boolean;
  created_at: string;
}

export interface MeetingRoom {
  id: string;
  event_id: string;
  owner: string;
  allow_screen: boolean;
  allow_file: boolean;
  participants: string[];
  created_at: string;
}

export interface SharedFile {
  id: string;
  room_id: string;
  filename: string;
  url: string;
  uploaded_by: string;
  created_at: string;
}