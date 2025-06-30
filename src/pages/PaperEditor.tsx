import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Navbar } from '../components/Navbar';
import { EditorToolbar } from '../components/EditorToolbar';
import { useUserStore } from '../store/userStore';
import { createYjsConnection } from '../lib/yjs';
import { Save, Users, Eye, UserPlus, Send } from 'lucide-react';

export const PaperEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const [yjsConnection, setYjsConnection] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (id && user) {
      // Initialize Yjs connection
      const connection = createYjsConnection(`paper-editor-${id}`, user.id);
      setYjsConnection(connection);

      // Track collaborators
      connection.provider.awareness.on('change', () => {
        const states = Array.from(connection.provider.awareness.getStates().values());
        setCollaborators(states.filter((state: any) => state.user?.id !== user.id));
      });

      return () => {
        connection.disconnect();
      };
    }
  }, [id, user]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ...(yjsConnection ? [
        Collaboration.configure({
          document: yjsConnection.doc,
        }),
        CollaborationCursor.configure({
          provider: yjsConnection.provider,
          user: {
            name: user?.name || 'Anonymous',
            color: user?.avatarColor || '#3B82F6',
          },
        }),
      ] : []),
    ],
    content: '<h1>Research Paper Title</h1><p>Start writing your research paper here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      // In a real app, save to storage
      console.log('Saving content:', content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-paper.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim()) return;
    
    // In a real app, send invitation
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="h-[calc(100vh-73px)] flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">Research Paper</h1>
            
            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: collaborator.user?.color }}
                    title={collaborator.user?.name}
                  >
                    {collaborator.user?.name?.charAt(0).toUpperCase()}
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-sm">Invite</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <EditorToolbar
          editor={editor}
          onSave={handleSave}
          canUndo={editor?.can().undo()}
          canRedo={editor?.can().redo()}
        />

        {/* Editor */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@university.edu"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteCollaborator}
                  disabled={!inviteEmail.trim()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Editor */}
      <style>
        {`
          .ProseMirror {
            outline: none;
            line-height: 1.6;
          }
          
          .ProseMirror h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1f2937;
          }
          
          .ProseMirror h2 {
            font-size: 1.875rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #374151;
          }
          
          .ProseMirror h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #374151;
          }
          
          .ProseMirror p {
            margin-bottom: 1rem;
            color: #4b5563;
          }
          
          .ProseMirror blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #6b7280;
          }
          
          .ProseMirror ul, .ProseMirror ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          
          .ProseMirror li {
            margin-bottom: 0.5rem;
          }
          
          .ProseMirror code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
          }
          
          .collaboration-cursor__caret {
            border-left: 1px solid #0D9488;
            border-right: 1px solid #0D9488;
            margin-left: -1px;
            margin-right: -1px;
            pointer-events: none;
            position: relative;
            word-break: normal;
          }
          
          .collaboration-cursor__label {
            border-radius: 3px 3px 3px 0;
            color: #0D9488;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            left: -1px;
            line-height: normal;
            padding: 0.1rem 0.3rem;
            position: absolute;
            top: -1.4em;
            user-select: none;
            white-space: nowrap;
          }
        `}
      </style>
    </div>
  );
};