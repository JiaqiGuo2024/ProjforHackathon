import React, { useState } from 'react';
import { FeedCard } from './FeedCard';
import { ChatPanel } from './ChatPanel';
import { MediaPost, Comment } from '../types/social';
import { useSocialStore } from '../store/socialStore';
import { nanoid } from 'nanoid';

interface FeedListProps {
  posts: MediaPost[];
  currentUserId: string;
  currentUserName: string;
  currentUserColor: string;
}

export const FeedList: React.FC<FeedListProps> = ({
  posts,
  currentUserId,
  currentUserName,
  currentUserColor
}) => {
  const { comments, addComment } = useSocialStore();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleCommentSend = (content: string) => {
    if (!selectedPostId) return;

    const comment: Comment = {
      id: nanoid(),
      post_id: selectedPostId,
      user_id: currentUserId,
      user_name: currentUserName,
      user_color: currentUserColor,
      content,
      created_at: new Date().toISOString()
    };

    addComment(comment);
  };

  const getCommentsForPost = (postId: string) => {
    return comments.filter(comment => comment.post_id === postId);
  };

  return (
    <div className="flex">
      {/* Feed */}
      <div className={`${selectedPostId ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to share something with the community!</p>
            </div>
          ) : (
            posts.map(post => (
              <FeedCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onComment={handleComment}
              />
            ))
          )}
        </div>
      </div>

      {/* Comments Sidebar */}
      {selectedPostId && (
        <div className="w-1/3 ml-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit sticky top-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Comments</h3>
              <button
                onClick={() => setSelectedPostId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <ChatPanel
                messages={getCommentsForPost(selectedPostId).map(comment => ({
                  id: comment.id,
                  document_id: comment.post_id,
                  user_id: comment.user_id,
                  user_name: comment.user_name,
                  user_color: comment.user_color,
                  content: comment.content,
                  type: 'text' as const,
                  created_at: comment.created_at
                }))}
                onMessageSend={handleCommentSend}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};