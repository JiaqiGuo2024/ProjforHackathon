import { create } from 'zustand';
import { User } from '../types';
import { getCurrentUser, subscribeToAuth } from '../lib/supabase';
import { getRandomColor } from '../lib/storage';

interface UserState {
  user: User | null;
  isLoading: boolean;
  initialize: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,

  initialize: () => {
    subscribeToAuth(async (authUser) => {
      if (authUser) {
        const user: User = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.name || authUser.email!.split('@')[0],
          avatarColor: authUser.avatarColor || getRandomColor(),
        };
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  },

  setUser: (user) => set({ user }),

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },
}));