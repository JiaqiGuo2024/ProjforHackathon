import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { MediaUploader } from '../components/MediaUploader';
import { FeedList } from '../components/FeedList';
import { RecruitBanner } from '../components/RecruitBanner';
import { useSocialStore } from '../store/socialStore';
import { useUserStore } from '../store/userStore';
import { MediaPost } from '../types/social';
import { nanoid } from 'nanoid';

export const Feed: React.FC = () => {
  const { user } = useUserStore();
  const { 
    mediaPosts, 
    addMediaPost, 
    extendedIdeas, 
    updateExtendedIdea,
    saveToStorage 
  } = useSocialStore();
  const [caption, setCaption] = useState('');

  const recruitingIdeas = extendedIdeas.filter(idea => idea.recruitment && idea.is_public);

  const handleMediaUpload = (url: string, type: 'image' | 'video' | 'audio') => {
    if (!user) return;

    const post: MediaPost = {
      id: nanoid(),
      author: user.id,
      authorName: user.name,
      authorAvatar: user.avatarColor,
      url,
      type,
      caption: caption.trim(),
      reactions: {},
      created_at: new Date().toISOString()
    };

    addMediaPost(post);
    setCaption('');
    saveToStorage();
  };

  const handleJoinIdea = (ideaId: string) => {
    if (!user) return;

    const idea = extendedIdeas.find(i => i.id === ideaId);
    if (idea && !idea.allowed_viewers.includes(user.id)) {
      updateExtendedIdea(ideaId, {
        allowed_viewers: [...idea.allowed_viewers, user.id]
      });
      saveToStorage();
      alert('Successfully joined the project!');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view the feed</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Recruiting Projects Banner */}
        <RecruitBanner
          recruitingIdeas={recruitingIdeas}
          onJoinIdea={handleJoinIdea}
        />

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Share with the community</h2>
          
          <div className="space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind? Share your research progress, insights, or discoveries..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            
            <MediaUploader onUpload={handleMediaUpload} />
          </div>
        </div>

        {/* Feed */}
        <FeedList
          posts={mediaPosts}
          currentUserId={user.id}
          currentUserName={user.name}
          currentUserColor={user.avatarColor}
        />
      </div>
    </div>
  );
};