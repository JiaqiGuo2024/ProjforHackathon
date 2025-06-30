// Simple encryption utilities for vault functionality
export const crypto = {
  encrypt: async (data: string, password: string): Promise<string> => {
    // In a real app, use proper encryption like Web Crypto API
    // For demo, we'll use simple base64 encoding with password salt
    const salt = password.split('').reverse().join('');
    const encoded = btoa(salt + data);
    return encoded;
  },

  decrypt: async (encryptedData: string, password: string): Promise<string> => {
    try {
      const salt = password.split('').reverse().join('');
      const decoded = atob(encryptedData);
      
      if (!decoded.startsWith(salt)) {
        throw new Error('Invalid password');
      }
      
      return decoded.substring(salt.length);
    } catch {
      throw new Error('Decryption failed');
    }
  }
};

export const generateVaultKey = (): string => {
  return Math.random().toString(36).substring(2, 15);
};