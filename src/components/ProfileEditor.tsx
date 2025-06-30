import React, { useState } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { Profile } from '../types/social';

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updates: Partial<Profile>) => void;
  onCancel: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    headline: profile.headline || '',
    bio: profile.bio || '',
    institution: profile.institution || '',
    field: profile.field || '',
    tags: [...profile.tags]
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updated_at: new Date().toISOString()
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline
          </label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
            placeholder="e.g., PhD Student in Machine Learning"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself and your research interests..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="University or Organization"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field
            </label>
            <input
              type="text"
              value={formData.field}
              onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
              placeholder="Research Field"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Research Tags
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};