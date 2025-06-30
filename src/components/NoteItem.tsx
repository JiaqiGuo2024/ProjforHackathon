import React, { useState } from 'react';
import { Edit3, Trash2, Tag, Calendar, MoreHorizontal } from 'lucide-react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  viewMode,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
    tags: [...note.tags],
  });
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    onUpdate(note.id, {
      title: editedNote.title,
      content: editedNote.content,
      tags: editedNote.tags,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags],
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !editedNote.tags.includes(tag)) {
      setEditedNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedNote.title}
                  onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <textarea
                  value={editedNote.content}
                  onChange={(e) => setEditedNote(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.updated_at)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-fit">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote(prev => ({ ...prev, content: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
          
          <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
          
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatDate(note.updated_at)}</span>
          </div>
        </>
      )}
    </div>
  );
};