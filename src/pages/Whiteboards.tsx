import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Palette, Users, Share2, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';
import { useProjectStore } from '../store/projectStore';
import { useUserStore } from '../store/userStore';
import { Whiteboard } from '../types/projects';
import { nanoid } from 'nanoid';

export const Whiteboards: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const { 
    whiteboards, 
    addWhiteboard, 
    initialize, 
    saveToStorage 
  } = useProjectStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<Whiteboard | null>(null);
  const [newWhiteboard, setNewWhiteboard] = useState({
    title: '',
    description: '',
    background_color: '#ffffff',
    is_public: false
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (id) {
      const whiteboard = whiteboards.find(w => w.id === id);
      if (whiteboard) {
        setSelectedWhiteboard(whiteboard);
      }
    }
  }, [id, whiteboards]);

  const userWhiteboards = whiteboards.filter(whiteboard => 
    whiteboard.owner_id === user?.id || 
    whiteboard.collaborators.includes(user?.id || '') ||
    whiteboard.is_public
  );

  const handleCreateWhiteboard = () => {
    if (!newWhiteboard.title.trim() || !user) return;

    const whiteboard: Whiteboard = {
      id: nanoid(),
      title: newWhiteboard.title,
      description: newWhiteboard.description,
      owner_id: user.id,
      collaborators: [],
      is_public: newWhiteboard.is_public,
      background_color: newWhiteboard.background_color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addWhiteboard(whiteboard);
    setNewWhiteboard({ title: '', description: '', background_color: '#ffffff', is_public: false });
    setShowCreateForm(false);
    navigate(`/whiteboards/${whiteboard.id}`);
    saveToStorage();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access whiteboards</h1>
        </div>
      </div>
    );
  }

  // If viewing a specific whiteboard
  if (selectedWhiteboard) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        <div className="h-[calc(100vh-73px)] flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/whiteboards')}
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Whiteboards</span>
                </button>
                
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{selectedWhiteboard.title}</h1>
                  {selectedWhiteboard.description && (
                    <p className="text-gray-600 text-sm">{selectedWhiteboard.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {selectedWhiteboard.collaborators.length + 1} collaborator{selectedWhiteboard.collaborators.length !== 0 ? 's' : ''}
                  </span>
                </div>
                
                {selectedWhiteboard.is_public && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Public
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Whiteboard Canvas */}
          <div className="flex-1">
            <WhiteboardCanvas whiteboard={selectedWhiteboard} />
          </div>
        </div>
      </div>
    );
  }

  // Whiteboard list view
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Whiteboards</h1>
            <p className="text-gray-600">
              Collaborative digital whiteboards for brainstorming and visual thinking
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Whiteboard</span>
          </button>
        </div>

        {/* Create Whiteboard Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Whiteboard</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Whiteboard title..."
                  value={newWhiteboard.title}
                  onChange={(e) => setNewWhiteboard(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the purpose of this whiteboard..."
                  value={newWhiteboard.description}
                  onChange={(e) => setNewWhiteboard(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={newWhiteboard.background_color}
                      onChange={(e) => setNewWhiteboard(prev => ({ ...prev, background_color: e.target.value }))}
                      className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      {['#ffffff', '#f3f4f6', '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3'].map(color => (
                        <button
                          key={color}
                          onClick={() => setNewWhiteboard(prev => ({ ...prev, background_color: color }))}
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newWhiteboard.is_public}
                      onChange={(e) => setNewWhiteboard(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Make this whiteboard public</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={handleCreateWhiteboard}
                  disabled={!newWhiteboard.title.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Whiteboard
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Whiteboards Grid */}
        {userWhiteboards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No whiteboards yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first whiteboard to start collaborating visually
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Whiteboard</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userWhiteboards.map(whiteboard => (
              <div
                key={whiteboard.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                onClick={() => navigate(`/whiteboards/${whiteboard.id}`)}
              >
                {/* Preview */}
                <div 
                  className="h-32 border-b border-gray-200"
                  style={{ backgroundColor: whiteboard.background_color }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{whiteboard.title}</h3>
                    {whiteboard.is_public && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Public
                      </span>
                    )}
                  </div>
                  
                  {whiteboard.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{whiteboard.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{whiteboard.collaborators.length + 1}</span>
                    </div>
                    <span>{new Date(whiteboard.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};