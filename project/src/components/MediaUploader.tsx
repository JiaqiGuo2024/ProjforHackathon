import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, Video, Music } from 'lucide-react';
import { uploadMedia, validateMediaFile } from '../lib/media';

interface MediaUploaderProps {
  onUpload: (url: string, type: 'image' | 'video' | 'audio') => void;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  className = ''
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (validateMediaFile(file)) {
        try {
          const result = await uploadMedia(file);
          onUpload(result.url, result.type);
        } catch (error) {
          console.error('Upload failed:', error);
          alert('Upload failed. Please try again.');
        }
      } else {
        alert(`File ${file.name} is not supported or too large (max 50MB)`);
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 text-gray-400">
          <Upload className="h-6 w-6" />
          <Image className="h-5 w-5" />
          <Video className="h-5 w-5" />
          <Music className="h-5 w-5" />
        </div>
        
        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium">
              Drag & drop media files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports images, videos, and audio files (max 50MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};