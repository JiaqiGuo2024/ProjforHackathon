import React from 'react';
import { Navbar } from '../components/Navbar';
import { VaultViewer } from '../components/VaultViewer';
import { useSocialStore } from '../store/socialStore';
import { useUserStore } from '../store/userStore';
import { VaultItem } from '../types/social';
import { crypto } from '../lib/crypto';
import { nanoid } from 'nanoid';

export const Vault: React.FC = () => {
  const { user } = useUserStore();
  const { vaultItems, addVaultItem, removeVaultItem, saveToStorage } = useSocialStore();

  const userVaultItems = vaultItems.filter(item => item.owner === user?.id);

  const handleUpload = async (file: File, password: string) => {
    if (!user) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result as string;
        const encryptedBlob = await crypto.encrypt(fileContent, password);
        
        const vaultItem: VaultItem = {
          id: nanoid(),
          owner: user.id,
          filename: file.name,
          encrypted_blob: encryptedBlob,
          created_at: new Date().toISOString()
        };

        addVaultItem(vaultItem);
        saveToStorage();
        alert('File encrypted and uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this encrypted file? This action cannot be undone.')) {
      removeVaultItem(id);
      saveToStorage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your vault</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Private Vault</h1>
          <p className="text-gray-600">
            Securely store and encrypt your sensitive research files. Only you can decrypt them with your password.
          </p>
        </div>

        <VaultViewer
          items={userVaultItems}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};