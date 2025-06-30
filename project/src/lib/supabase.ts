import { storage, auth } from './storage';

// Mock Supabase client for offline-first approach
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: auth.getCurrentUser() } }),
    signInWithOtp: async ({ email }: { email: string }) => {
      const user = await auth.signIn(email);
      return { data: user, error: null };
    },
    signOut: async () => {
      await auth.signOut();
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock auth state change
      const user = auth.getCurrentUser();
      callback('SIGNED_IN', user ? { user } : null);
      
      // Return unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

export const getCurrentUser = async () => {
  return auth.getCurrentUser();
};

export const signIn = async (email: string) => {
  return auth.signIn(email);
};

export const signOut = async () => {
  return auth.signOut();
};

export const subscribeToAuth = (callback: (user: any) => void) => {
  const user = auth.getCurrentUser();
  callback(user);
  
  // Return mock subscription
  return { data: { subscription: { unsubscribe: () => {} } } };
};