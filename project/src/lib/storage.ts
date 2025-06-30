// Local storage utilities for offline-first approach
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

// Mock authentication for demo purposes
export const auth = {
  getCurrentUser: () => {
    return storage.get<any>('current_user');
  },

  signIn: async (email: string) => {
    // Mock user creation
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatarColor: getRandomColor(),
      created_at: new Date().toISOString()
    };
    storage.set('current_user', user);
    return user;
  },

  signOut: async () => {
    storage.remove('current_user');
  }
};

export const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};