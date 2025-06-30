import React, { useState } from 'react';
import { 
  MessageSquare, 
  Highlighter, 
  StickyNote, 
  User,
  Trash2,
  Edit3,
  Plus
} from 'lucide-react';
import { Annotation } from '../types';
import { useUserStore } from '../store/userStore';

interface AnnotationSidebarProps {
  annotations: Annotation[];
  onAnnotationAdd: (annotation: Partial<Annotation>) => void;
  onAnnotationUpdate: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete: (id: string) => void;
}

export const AnnotationSidebar: React.FC<AnnotationSidebarProps> = ({
  annotations,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  const { user } = useUserStore();
  const [newAnnotation, setNewAnnotation] = useState('');
  const [selectedType, setSelectedType] = useState<'highlight' | 'note'>('note');

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim() || !user) return;

    onAnnotationAdd({
      content: newAnnotation,
      color: selectedType === 'highlight' ? '#fef08a' : user.avatarColor,
      user_id: user.id,
      page: 1, // This should be the current page
      position: { x: 50, y: 50, width: 100, height: 20 },
    });

    setNewAnnotation('');
  };

  const groupedAnnotations = annotations.reduce((acc, annotation) => {
    const page = annotation.page;
    if (!acc[page]) acc[page] = [];
    acc[page].push(annotation);
    return acc;
  }, {} as Record<number, Annotation[]>);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Annotations</h3>
        
        {/* Annotation Type Selector */}
        <div className="flex items-center space-x-2 mb-3">
          <button
            onClick={() => setSelectedType('note')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'note'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <StickyNote className="h-4 w-4" />
            <span>Note</span>
          </button>
          <button
            onClick={() => setSelectedType('highlight')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'highlight'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Highlighter className="h-4 w-4" />
            <span>Highlight</span>
          </button>
        </div>

        {/* Add Annotation Input */}
        <div className="space-y-2">
          <textarea
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder={`Add a ${selectedType}...`}
            className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={handleAddAnnotation}
            disabled={!newAnnotation.trim()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add {selectedType}</span>
          </button>
        </div>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedAnnotations).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">No annotations yet</p>
            <p className="text-xs text-center mt-1">Click on the PDF to add your first annotation</p>
          </div>
        ) : (
          Object.entries(groupedAnnotations)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([page, pageAnnotations]) => (
              <div key={page} className="border-b border-gray-100 last:border-b-0">
                <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">Page {page}</h4>
                </div>
                
                <div className="p-4 space-y-4">
                  {pageAnnotations.map((annotation) => (
                    <div key={annotation.id} className="group">
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                          style={{ backgroundColor: annotation.color }}
                        >
                          <User className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-900">{annotation.content}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(annotation.created_at).toLocaleString()}
                            </span>
                            
                            {user?.id === annotation.user_id && (
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                                  <Edit3 className="h-3 w-3 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => onAnnotationDelete(annotation.id)}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};