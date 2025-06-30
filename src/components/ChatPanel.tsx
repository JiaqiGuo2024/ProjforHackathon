import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Smile,
  User,
  Clock
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useUserStore } from '../store/userStore';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../lib/speech';

interface ChatPanelProps {
  messages: ChatMessage[];
  onMessageSend: (content: string, type?: 'text' | 'voice') => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onMessageSend }) => {
  const { user } = useUserStore();
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopRecording = useRef<(() => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    onMessageSend(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (isRecording) {
      // Stop recording
      if (stopRecording.current) {
        stopRecording.current();
      }
      setIsRecording(false);
    } else {
      // Start recording
      setIsRecording(true);
      
      const stop = startSpeechRecognition(
        (text) => {
          setNewMessage(prev => prev + ' ' + text);
          setIsRecording(false);
          stopRecording.current = null;
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsRecording(false);
          stopRecording.current = null;
        }
      );
      
      stopRecording.current = stop;
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😊', '👍', '👎', '❤️', '🔥', '💡', '🤔', '👏', '🎉'];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
        <p className="text-sm text-gray-500 mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <User className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">Start a discussion</p>
            <p className="text-xs text-center mt-1">Share your thoughts about this document</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: message.user_color }}
              >
                {message.user_name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.user_name}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(message.created_at)}
                  </span>
                  {message.type === 'voice' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Voice
                    </span>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
            />
          </div>

          <div className="flex items-center space-x-1">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Smile className="h-5 w-5 text-gray-600" />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="p-2 hover:bg-gray-100 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input */}
            <button
              onClick={handleVoiceInput}
              disabled={!isSpeechRecognitionSupported()}
              className={`p-2 rounded-md transition-colors ${
                isRecording
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-gray-100 text-gray-600 disabled:opacity-50'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm">Recording... Click mic to stop</span>
          </div>
        )}
      </div>
    </div>
  );
};