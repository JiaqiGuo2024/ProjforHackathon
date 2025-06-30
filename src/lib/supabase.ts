import { storage, auth } from './storage';

// Simplified authentication without magic links
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: auth.getCurrentUser() } }),
    signInWithEmail: async ({ email }: { email: string }) => {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
      
      const user = await auth.signIn(email);
      return { data: user, error: null };
    },
    signOut: async () => {
      await auth.signOut();
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const user = auth.getCurrentUser();
      callback('SIGNED_IN', user ? { user } : null);
      
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
  
  return { data: { subscription: { unsubscribe: () => {} } } };
};