import React, { useState } from 'react';
import { MessageCircle, Users, Coffee, Calendar, Send, Star } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

interface NetworkingMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  type: 'question' | 'discussion' | 'meetup';
  created_at: string;
  replies: NetworkingReply[];
}

interface NetworkingReply {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

interface EventNetworkingProps {
  eventId: string;
}

export const EventNetworking: React.FC<EventNetworkingProps> = ({ eventId }) => {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<NetworkingMessage[]>([
    {
      id: '1',
      sender_id: 'user1',
      sender_name: 'Dr. Sarah Chen',
      sender_avatar: '#3B82F6',
      content: 'Looking for collaborators on machine learning applications in healthcare. Anyone working in this area?',
      type: 'question',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      replies: [
        {
          id: 'r1',
          user_id: 'user2',
          user_name: 'Prof. Michael Johnson',
          user_avatar: '#10B981',
          content: 'I\'m working on similar projects! Would love to connect.',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: '2',
      sender_id: 'user3',
      sender_name: 'Dr. Emily Rodriguez',
      sender_avatar: '#F59E0B',
      content: 'Coffee meetup at 3 PM in the main lobby for anyone interested in discussing quantum computing applications!',
      type: 'meetup',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      replies: []
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'question' | 'discussion' | 'meetup'>('discussion');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: NetworkingMessage = {
      id: nanoid(),
      sender_id: user.id,
      sender_name: user.name,
      sender_avatar: user.avatarColor,
      content: newMessage,
      type: messageType,
      created_at: new Date().toISOString(),
      replies: []
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
  };

  const handleSendReply = (messageId: string) => {
    if (!replyContent.trim() || !user) return;

    const reply: NetworkingReply = {
      id: nanoid(),
      user_id: user.id,
      user_name: user.name,
      user_avatar: user.avatarColor,
      content: replyContent,
      created_at: new Date().toISOString()
    };

    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, replies: [...msg.replies, reply] }
        : msg
    ));

    setReplyContent('');
    setReplyingTo(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return <MessageCircle className="h-4 w-4" />;
      case 'meetup': return <Coffee className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'meetup': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Event Networking</h3>
          <p className="text-gray-600 text-sm">Connect with other researchers and attendees</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{messages.length} conversations</span>
        </div>
      </div>

      {/* Post New Message */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Start a Conversation</h4>
        
        <div className="space-y-4">
          {/* Message Type */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <div className="flex items-center space-x-2">
              {[
                { id: 'discussion', label: 'Discussion', icon: Users },
                { id: 'question', label: 'Question', icon: MessageCircle },
                { id: 'meetup', label: 'Meetup', icon: Coffee }
              ].map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setMessageType(type.id as any)}
                    className={`inline-flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      messageType === type.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Input */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Share a ${messageType}...`}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Be the first to start networking!</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Message Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: message.sender_avatar }}
                  >
                    {message.sender_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{message.sender_name}</h4>
                    <p className="text-sm text-gray-500">{formatTime(message.created_at)}</p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                  {getTypeIcon(message.type)}
                  <span className="capitalize">{message.type}</span>
                </span>
              </div>

              {/* Message Content */}
              <p className="text-gray-700 mb-4">{message.content}</p>

              {/* Replies */}
              {message.replies.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {message.replies.map(reply => (
                    <div key={reply.id} className="flex items-start space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: reply.user_avatar }}
                      >
                        {reply.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{reply.user_name}</span>
                          <span className="text-xs text-gray-500">{formatTime(reply.created_at)}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {replyingTo === message.id ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user?.avatarColor }}
                    >
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSendReply(message.id)}
                          disabled={!replyContent.trim()}
                          className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <button
                    onClick={() => setReplyingTo(message.id)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};