import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Download, Trash2 } from 'lucide-react';
import { SharedFile } from '../types/events';

interface FileShareAreaProps {
  files: SharedFile[];
  onFileUpload: (file: File) => void;
  onFileDelete: (fileId: string) => void;
  currentUserId: string;
}

export const FileShareArea: React.FC<FileShareAreaProps> = ({
  files,
  onFileUpload,
  onFileDelete,
  currentUserId
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      onFileUpload(file);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const downloadFile = (file: SharedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-4">Shared Files</h3>
      
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mb-4 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Share documents, images, or any files with participants
            </p>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files shared yet</p>
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3 flex-1">
                <File className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    Shared by {file.uploaded_by === currentUserId ? 'You' : 'Participant'} • {' '}
                    {new Date(file.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadFile(file)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                {file.uploaded_by === currentUserId && (
                  <button
                    onClick={() => onFileDelete(file.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};