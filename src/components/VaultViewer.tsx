import React, { useState } from 'react';
import { Lock, Unlock, Download, Trash2, Upload } from 'lucide-react';
import { VaultItem } from '../types/social';
import { crypto } from '../lib/crypto';

interface VaultViewerProps {
  items: VaultItem[];
  onUpload: (file: File, password: string) => void;
  onDelete: (id: string) => void;
}

export const VaultViewer: React.FC<VaultViewerProps> = ({
  items,
  onUpload,
  onDelete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPassword, setUploadPassword] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || !uploadPassword) return;

    await onUpload(selectedFile, uploadPassword);
    setSelectedFile(null);
    setUploadPassword('');
    setShowUploadForm(false);
  };

  const handleDecrypt = async (item: VaultItem) => {
    if (!decryptPassword) {
      alert('Please enter the decryption password');
      return;
    }

    try {
      setDecryptingId(item.id);
      const decryptedData = await crypto.decrypt(item.encrypted_blob, decryptPassword);
      
      // Create download link
      const blob = new Blob([decryptedData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.filename;
      a.click();
      URL.revokeObjectURL(url);
      
      setDecryptPassword('');
    } catch (error) {
      alert('Decryption failed. Please check your password.');
    } finally {
      setDecryptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔒 Private Vault</h3>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </button>
        </div>

        {showUploadForm && (
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Password
                </label>
                <input
                  type="password"
                  value={uploadPassword}
                  onChange={(e) => setUploadPassword(e.target.value)}
                  placeholder="Enter a strong password..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !uploadPassword}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Encrypt & Upload
                </button>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Encrypted Files</h4>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No files in vault</p>
            <p className="text-sm mt-1">Upload your first encrypted file to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{item.filename}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    placeholder="Password"
                    value={decryptPassword}
                    onChange={(e) => setDecryptPassword(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={() => handleDecrypt(item)}
                    disabled={decryptingId === item.id}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Decrypt & Download"
                  >
                    {decryptingId === item.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};