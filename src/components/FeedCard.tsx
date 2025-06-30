import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import ReactPlayer from 'react-player';
import { MediaPost } from '../types/social';
import { useSocialStore } from '../store/socialStore';

interface FeedCardProps {
  post: MediaPost;
  currentUserId: string;
  onComment: (postId: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  currentUserId,
  onComment
}) => {
  const { updateMediaPost } = useSocialStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleReaction = (emoji: string) => {
    const currentReactions = post.reactions[emoji] || [];
    const hasReacted = currentReactions.includes(currentUserId);
    
    const updatedReactions = {
      ...post.reactions,
      [emoji]: hasReacted
        ? currentReactions.filter(id => id !== currentUserId)
        : [...currentReactions, currentUserId]
    };

    updateMediaPost(post.id, { reactions: updatedReactions });
  };

  const getTotalReactions = () => {
    return Object.values(post.reactions).reduce((total, users) => total + users.length, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-blue-100 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: post.authorAvatar }}
          >
            {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{post.authorName}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded hover:bg-gray-100 transition-colors relative"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-32">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Report
              </button>
              {post.author === currentUserId && (
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  Delete
                </button>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Media Content */}
      <div className="relative">
        {post.type === 'image' && (
          <img
            src={post.url}
            alt="Post media"
            className="w-full h-auto max-h-96 object-cover"
          />
        )}
        
        {post.type === 'video' && (
          <div className="aspect-video">
            <ReactPlayer
              url={post.url}
              width="100%"
              height="100%"
              controls
              light
            />
          </div>
        )}
        
        {post.type === 'audio' && (
          <div className="p-4 bg-gray-50">
            <ReactPlayer
              url={post.url}
              width="100%"
              height="50px"
              controls
            />
          </div>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="p-4">
          <p className="text-gray-900">{post.caption}</p>
        </div>
      )}

      {/* Reactions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {['😀', '👍', '🔬', '💡', '❤️'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                    post.reactions[emoji]?.includes(currentUserId) ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
            
            {getTotalReactions() > 0 && (
              <span className="text-sm text-gray-500">
                {getTotalReactions()} reaction{getTotalReactions() !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Comment</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Share className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};