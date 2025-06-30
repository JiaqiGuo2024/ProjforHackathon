import React, { useState } from 'react';
import { Plus, Search, Filter, Tag, Grid, List } from 'lucide-react';
import { Note } from '../types';
import { NoteItem } from './NoteItem';

interface NoteBookProps {
  notes: Note[];
  onNoteCreate: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => void;
  onNoteUpdate: (id: string, updates: Partial<Note>) => void;
  onNoteDelete: (id: string) => void;
}

export const NoteBook: React.FC<NoteBookProps> = ({
  notes,
  onNoteCreate,
  onNoteUpdate,
  onNoteDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  );

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return;

    onNoteCreate({
      user_id: 'current-user', // This should come from user context
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags,
    });

    setNewNote({ title: '', content: '', tags: [] });
    setShowCreateForm(false);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addTagToNewNote = (tag: string) => {
    if (!newNote.tags.includes(tag)) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTagFromNewNote = (tag: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

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

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Note Form */}
      {showCreateForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <textarea
              placeholder="Write your note..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
            />

            {/* Tags Input */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {newNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTagFromNewNote(tag)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allTags
                    .filter(tag => !newNote.tags.includes(tag))
                    .map(tag => (
                      <button
                        key={tag}
                        onClick={() => addTagToNewNote(tag)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateNote}
                disabled={!newNote.title.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Note
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
      )}

      {/* Notes Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg mb-2">No notes found</p>
            <p className="text-sm text-center">
              {notes.length === 0
                ? "Create your first note to get started"
                : "Try adjusting your search or filters"
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {filteredNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                viewMode={viewMode}
                onUpdate={onNoteUpdate}
                onDelete={onNoteDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};