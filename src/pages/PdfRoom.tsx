import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PdfViewer } from '../components/PdfViewer';
import { AnnotationSidebar } from '../components/AnnotationSidebar';
import { ChatPanel } from '../components/ChatPanel';
import { Annotation, ChatMessage } from '../types';
import { useUserStore } from '../store/userStore';
import { createYjsConnection } from '../lib/yjs';

export const PdfRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'annotations' | 'chat'>('annotations');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [yjsConnection, setYjsConnection] = useState<any>(null);

  // Use a reliable PDF URL that supports CORS
  const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

  useEffect(() => {
    if (id && user) {
      // Initialize Yjs connection for real-time collaboration
      const connection = createYjsConnection(`pdf-room-${id}`, user.id);
      setYjsConnection(connection);

      // Set up real-time data sync
      const annotationsArray = connection.doc.getArray('annotations');
      const messagesArray = connection.doc.getArray('messages');

      // Listen for changes
      annotationsArray.observe(() => {
        setAnnotations(annotationsArray.toArray());
      });

      messagesArray.observe(() => {
        setMessages(messagesArray.toArray());
      });

      return () => {
        connection.disconnect();
      };
    }
  }, [id, user]);

  const handleAnnotationAdd = (annotation: Partial<Annotation>) => {
    if (!user || !yjsConnection) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      document_id: id!,
      user_id: user.id,
      page: annotation.page || 1,
      position: annotation.position || { x: 50, y: 50, width: 100, height: 20 },
      content: annotation.content || '',
      color: annotation.color || user.avatarColor,
      created_at: new Date().toISOString(),
    };

    const annotationsArray = yjsConnection.doc.getArray('annotations');
    annotationsArray.push([newAnnotation]);
  };

  const handleAnnotationUpdate = (annotationId: string, updates: Partial<Annotation>) => {
    if (!yjsConnection) return;

    const annotationsArray = yjsConnection.doc.getArray('annotations');
    const currentAnnotations = annotationsArray.toArray();
    const index = currentAnnotations.findIndex((a: Annotation) => a.id === annotationId);
    
    if (index !== -1) {
      const updatedAnnotation = { ...currentAnnotations[index], ...updates };
      annotationsArray.delete(index, 1);
      annotationsArray.insert(index, [updatedAnnotation]);
    }
  };

  const handleAnnotationDelete = (annotationId: string) => {
    if (!yjsConnection) return;

    const annotationsArray = yjsConnection.doc.getArray('annotations');
    const currentAnnotations = annotationsArray.toArray();
    const index = currentAnnotations.findIndex((a: Annotation) => a.id === annotationId);
    
    if (index !== -1) {
      annotationsArray.delete(index, 1);
    }
  };

  const handleMessageSend = (content: string, type: 'text' | 'voice' = 'text') => {
    if (!user || !yjsConnection) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      document_id: id!,
      user_id: user.id,
      user_name: user.name,
      user_color: user.avatarColor,
      content,
      type,
      created_at: new Date().toISOString(),
    };

    const messagesArray = yjsConnection.doc.getArray('messages');
    messagesArray.push([newMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="h-[calc(100vh-73px)] flex">
        {/* PDF Viewer */}
        <div className="flex-1 lg:w-3/4">
          <PdfViewer 
            url={pdfUrl}
            onAnnotationAdd={handleAnnotationAdd}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('annotations')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'annotations'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Annotations ({annotations.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Chat ({messages.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'annotations' ? (
              <AnnotationSidebar
                annotations={annotations}
                onAnnotationAdd={handleAnnotationAdd}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
              />
            ) : (
              <ChatPanel
                messages={messages}
                onMessageSend={handleMessageSend}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};