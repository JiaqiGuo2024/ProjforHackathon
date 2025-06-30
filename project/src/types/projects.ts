export interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  collaborators: string[];
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  start_date: string;
  end_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  completed_at?: string;
  assigned_to: string[];
  created_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface WhiteboardElement {
  id: string;
  whiteboard_id: string;
  type: 'text' | 'shape' | 'image' | 'drawing' | 'sticky-note';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    strokeWidth?: number;
    strokeColor?: string;
  };
  created_by: string;
  created_at: string;
}

export interface Whiteboard {
  id: string;
  project_id?: string;
  title: string;
  description: string;
  owner_id: string;
  collaborators: string[];
  is_public: boolean;
  background_color: string;
  created_at: string;
  updated_at: string;
}