import { nanoid } from 'nanoid';

export interface UploadResult {
  url: string;
  type: 'image' | 'video' | 'audio';
}

export const uploadMedia = async (file: File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      const type = getMediaType(file.type);
      
      // In a real app, this would upload to a storage service
      // For demo, we'll use data URLs
      resolve({
        url: result,
        type
      });
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const getMediaType = (mimeType: string): 'image' | 'video' | 'audio' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image'; // fallback
};

export const validateMediaFile = (file: File): boolean => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mp3', 'audio/wav', 'audio/ogg'
  ];
  
  return file.size <= maxSize && allowedTypes.includes(file.type);
};