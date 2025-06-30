import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Share2, Lock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { IdeaCard } from '../components/IdeaCard';
import { ExtendedIdea } from '../types/social';
import { useSocialStore } from '../store/socialStore';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

export const IdeaBoard: React.FC = () => {
  const { user } = useUserStore();
  const { extendedIdeas, addExtendedIdea, updateExtendedIdea, removeExtendedIdea, saveToStorage } = useSocialStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'private' | 'shared'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    is_public: false,
    recruitment: false,
  });

  // Filter ideas
  const filteredIdeas = extendedIdeas.filter(idea => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterMode === 'all' ||
      (filterMode === 'private' && !idea.is_public) ||
      (filterMode === 'shared' && idea.is_public);
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateIdea = () => {
    if (!newIdea.title.trim() || !user) return;

    const idea: ExtendedIdea = {
      id: nanoid(),
      user_id: user.id,
      title: newIdea.title,
      content: newIdea.content,
      is_public: newIdea.is_public,
      recruitment: newIdea.recruitment,
      allowed_viewers: [],
      tags: newIdea.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addExtendedIdea(idea);
    setNewIdea({ title: '', content: '', tags: [], is_public: false, recruitment: false });
    setShowCreateForm(false);
    saveToStorage();
  };

  const handleUpdateIdea = (id: string, updates: Partial<ExtendedIdea>) => {
    updateExtendedIdea(id, { ...updates, updated_at: new Date().toISOString() });
    saveToStorage();
  };

  const handleDeleteIdea = (id: string) => {
    removeExtendedIdea(id);
    saveToStorage();
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="h-[calc(100vh-73px)] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Idea Board</h1>
              <p className="text-gray-600 mt-1">
                Capture, organize, and share your research insights
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Idea</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 'all'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Ideas
                </button>
                <button
                  onClick={() => setFilterMode('private')}
                  className={`inline-flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 'private'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>Private</span>
                </button>
                <button
                  onClick={() => setFilterMode('shared')}
                  className={`inline-flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 'shared'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Shared</span>
                </button>
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Create Idea Form */}
        {showCreateForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Idea</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Idea title..."
                  value={newIdea.title}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                
                <textarea
                  placeholder="Describe your idea... Use $formula$ for inline math or $$formula$$ for block math"
                  value={newIdea.content}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                />

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newIdea.is_public}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Share publicly</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newIdea.recruitment}
                      onChange={(e) => setNewIdea(prev => ({ ...prev, recruitment: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Open for collaboration</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCreateIdea}
                    disabled={!newIdea.title.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Idea
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ideas Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-xl mb-2">No ideas found</p>
              <p className="text-center mb-6">
                {extendedIdeas.length === 0
                  ? "Start capturing your research insights and breakthrough moments"
                  : "Try adjusting your search or filters"
                }
              </p>
              {extendedIdeas.length === 0 && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Idea</span>
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onUpdate={handleUpdateIdea}
                  onDelete={handleDeleteIdea}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};