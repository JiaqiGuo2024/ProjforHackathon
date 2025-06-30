import { create } from 'zustand';
import { Event, EventParticipant, EventRating, MeetingRoom, SharedFile } from '../types/events';
import { storage } from '../lib/storage';

interface EventState {
  // Events
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;

  // Participants
  participants: EventParticipant[];
  setParticipants: (participants: EventParticipant[]) => void;
  addParticipant: (participant: EventParticipant) => void;
  removeParticipant: (eventId: string, userId: string) => void;

  // Ratings
  ratings: EventRating[];
  setRatings: (ratings: EventRating[]) => void;
  addRating: (rating: EventRating) => void;
  updateRating: (id: string, updates: Partial<EventRating>) => void;

  // Meeting Rooms
  meetingRooms: MeetingRoom[];
  setMeetingRooms: (rooms: MeetingRoom[]) => void;
  addMeetingRoom: (room: MeetingRoom) => void;
  updateMeetingRoom: (id: string, updates: Partial<MeetingRoom>) => void;

  // Shared Files
  sharedFiles: SharedFile[];
  setSharedFiles: (files: SharedFile[]) => void;
  addSharedFile: (file: SharedFile) => void;
  removeSharedFile: (id: string) => void;

  // Actions
  initialize: () => void;
  saveToStorage: () => void;
  getEventParticipants: (eventId: string) => EventParticipant[];
  getEventRatings: (eventId: string) => EventRating[];
  getAverageRating: (eventId: string) => number;
  getRoomFiles: (roomId: string) => SharedFile[];
}

export const useEventStore = create<EventState>((set, get) => ({
  // Events
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set(state => ({ 
    events: [event, ...state.events] 
  })),
  updateEvent: (id, updates) => set(state => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  removeEvent: (id) => set(state => ({
    events: state.events.filter(event => event.id !== id)
  })),

  // Participants
  participants: [],
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) => set(state => ({ 
    participants: [...state.participants, participant] 
  })),
  removeParticipant: (eventId, userId) => set(state => ({
    participants: state.participants.filter(p => 
      !(p.event_id === eventId && p.user_id === userId)
    )
  })),

  // Ratings
  ratings: [],
  setRatings: (ratings) => set({ ratings }),
  addRating: (rating) => set(state => ({ 
    ratings: [...state.ratings, rating] 
  })),
  updateRating: (id, updates) => set(state => ({
    ratings: state.ratings.map(rating => 
      rating.id === id ? { ...rating, ...updates } : rating
    )
  })),

  // Meeting Rooms
  meetingRooms: [],
  setMeetingRooms: (meetingRooms) => set({ meetingRooms }),
  addMeetingRoom: (room) => set(state => ({ 
    meetingRooms: [...state.meetingRooms, room] 
  })),
  updateMeetingRoom: (id, updates) => set(state => ({
    meetingRooms: state.meetingRooms.map(room => 
      room.id === id ? { ...room, ...updates } : room
    )
  })),

  // Shared Files
  sharedFiles: [],
  setSharedFiles: (sharedFiles) => set({ sharedFiles }),
  addSharedFile: (file) => set(state => ({ 
    sharedFiles: [...state.sharedFiles, file] 
  })),
  removeSharedFile: (id) => set(state => ({
    sharedFiles: state.sharedFiles.filter(file => file.id !== id)
  })),

  // Actions
  initialize: () => {
    const events = storage.get<Event[]>('events') || [];
    const participants = storage.get<EventParticipant[]>('eventParticipants') || [];
    const ratings = storage.get<EventRating[]>('eventRatings') || [];
    const meetingRooms = storage.get<MeetingRoom[]>('meetingRooms') || [];
    const sharedFiles = storage.get<SharedFile[]>('sharedFiles') || [];

    set({ events, participants, ratings, meetingRooms, sharedFiles });
  },

  saveToStorage: () => {
    const state = get();
    storage.set('events', state.events);
    storage.set('eventParticipants', state.participants);
    storage.set('eventRatings', state.ratings);
    storage.set('meetingRooms', state.meetingRooms);
    storage.set('sharedFiles', state.sharedFiles);
  },

  getEventParticipants: (eventId) => {
    return get().participants.filter(p => p.event_id === eventId);
  },

  getEventRatings: (eventId) => {
    return get().ratings.filter(r => r.event_id === eventId);
  },

  getAverageRating: (eventId) => {
    const eventRatings = get().ratings.filter(r => r.event_id === eventId);
    if (eventRatings.length === 0) return 0;
    const sum = eventRatings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / eventRatings.length;
  },

  getRoomFiles: (roomId) => {
    return get().sharedFiles.filter(f => f.room_id === roomId);
  }
}));