import { create } from 'zustand';
import { Document, Note, Idea, CalendarEvent } from '../types';

interface WorkspaceState {
  // Documents
  documents: Document[];
  currentDocument: Document | null;
  setDocuments: (documents: Document[]) => void;
  setCurrentDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;

  // Notes
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;

  // Ideas
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  removeIdea: (id: string) => void;

  // Calendar Events
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  // Documents
  documents: [],
  currentDocument: null,
  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (currentDocument) => set({ currentDocument }),
  addDocument: (document) => set(state => ({ 
    documents: [...state.documents, document] 
  })),
  updateDocument: (id, updates) => set(state => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ),
    currentDocument: state.currentDocument?.id === id 
      ? { ...state.currentDocument, ...updates }
      : state.currentDocument
  })),
  removeDocument: (id) => set(state => ({
    documents: state.documents.filter(doc => doc.id !== id),
    currentDocument: state.currentDocument?.id === id ? null : state.currentDocument
  })),

  // Notes
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set(state => ({ 
    notes: [...state.notes, note] 
  })),
  updateNote: (id, updates) => set(state => ({
    notes: state.notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    )
  })),
  removeNote: (id) => set(state => ({
    notes: state.notes.filter(note => note.id !== id)
  })),

  // Ideas
  ideas: [],
  setIdeas: (ideas) => set({ ideas }),
  addIdea: (idea) => set(state => ({ 
    ideas: [...state.ideas, idea] 
  })),
  updateIdea: (id, updates) => set(state => ({
    ideas: state.ideas.map(idea => 
      idea.id === id ? { ...idea, ...updates } : idea
    )
  })),
  removeIdea: (id) => set(state => ({
    ideas: state.ideas.filter(idea => idea.id !== id)
  })),

  // Calendar Events
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set(state => ({ 
    events: [...state.events, event] 
  })),
  updateEvent: (id, updates) => set(state => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  removeEvent: (id) => set(state => ({
    events: state.events.filter(event => event.id !== id)
  })),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));