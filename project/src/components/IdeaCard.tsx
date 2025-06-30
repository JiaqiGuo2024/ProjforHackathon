import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Share2, 
  Lock, 
  Tag, 
  Calendar,
  MoreHorizontal,
  Heart,
  MessageCircle
} from 'lucide-react';
import { ExtendedIdea } from '../types/social';
import { IdeaPrivacyBar } from './IdeaPrivacyBar';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface IdeaCardProps {
  idea: ExtendedIdea;
  onUpdate: (id: string, updates: Partial<ExtendedIdea>) => void;
  onDelete: (id: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editedIdea, setEditedIdea] = useState({
    title: idea.title,
    content: idea.content,
    tags: [...idea.tags],
    is_public: idea.is_public,
    recruitment: idea.recruitment,
  });

  const handleSave = () => {
    onUpdate(idea.id, editedIdea);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedIdea({
      title: idea.title,
      content: idea.content,
      tags: [...idea.tags],
      is_public: idea.is_public,
      recruitment: idea.recruitment,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      onDelete(idea.id);
    }
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    onUpdate(idea.id, { is_public: isPublic });
  };

  const handleRecruitmentChange = (recruitment: boolean) => {
    onUpdate(idea.id, { recruitment });
  };

  const renderContent = (content: string) => {
    // Simple LaTeX parsing for display
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          return <BlockMath key={index} math={formula} />;
        } catch {
          return <span key={index} className="text-red-500">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        try {
          return <InlineMath key={index} math={formula} />;
        } catch {
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Privacy Bar */}
      <IdeaPrivacyBar
        isPublic={idea.is_public}
        recruitment={idea.recruitment}
        allowedViewers={idea.allowed_viewers}
        onVisibilityChange={handleVisibilityChange}
        onRecruitmentChange={handleRecruitmentChange}
      />

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedIdea.title}
              onChange={(e) => setEditedIdea(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Idea title..."
            />
            
            <textarea
              value={editedIdea.content}
              onChange={(e) => setEditedIdea(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={6}
              placeholder="Describe your idea... Use $formula$ for inline math or $$formula$$ for block math"
            />

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={!editedIdea.title.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
                {idea.recruitment && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Recruiting
                  </span>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mb-4 text-gray-700 leading-relaxed">
              {renderContent(idea.content)}
            </div>

            {/* Tags */}
            {idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {idea.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(idea.updated_at)}</span>
                </div>
                {idea.is_public && (
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>12</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>3</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  idea.is_public
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {idea.is_public ? 'Public' : 'Private'}
                </span>
                {idea.allowed_viewers.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {idea.allowed_viewers.length} collaborator{idea.allowed_viewers.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};