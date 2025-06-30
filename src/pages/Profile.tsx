import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileEditor } from '../components/ProfileEditor';
import { useSocialStore } from '../store/socialStore';
import { useUserStore } from '../store/userStore';
import { Profile as ProfileType } from '../types/social';
import { Image, FileText, Lightbulb } from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const { 
    profiles, 
    mediaPosts, 
    extendedIdeas, 
    updateProfile,
    saveToStorage 
  } = useSocialStore();
  
  const [activeTab, setActiveTab] = useState<'about' | 'media' | 'ideas'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    if (id === 'me' && user) {
      // Create or find current user profile
      let userProfile = profiles.find(p => p.id === user.id);
      if (!userProfile) {
        userProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
          tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      setProfile(userProfile);
    } else if (id) {
      const foundProfile = profiles.find(p => p.id === id);
      setProfile(foundProfile || null);
    }
  }, [id, user, profiles]);

  const isOwner = user && profile && user.id === profile.id;
  const userPosts = mediaPosts.filter(post => post.author === profile?.id);
  const userIdeas = extendedIdeas.filter(idea => 
    idea.user_id === profile?.id && (idea.is_public || isOwner)
  );

  const handleProfileUpdate = (updates: Partial<ProfileType>) => {
    if (!profile) return;

    updateProfile(profile.id, updates);
    setProfile({ ...profile, ...updates });
    setIsEditing(false);
    saveToStorage();
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            {isEditing ? (
              <ProfileEditor
                profile={profile}
                onSave={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileCard
                profile={profile}
                isOwner={isOwner}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'about'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'media'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Media ({userPosts.length})
                </button>
                <button
                  onClick={() => setActiveTab('ideas')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'ideas'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Ideas ({userIdeas.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {profile.bio ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bio available</p>
                        {isOwner && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-primary-600 hover:text-primary-700 text-sm mt-2"
                          >
                            Add your bio
                          </button>
                        )}
                      </div>
                    )}

                    {profile.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div>
                    {userPosts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No media posts yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userPosts.map(post => (
                          <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden">
                            {post.type === 'image' && (
                              <img
                                src={post.url}
                                alt="Post"
                                className="w-full h-48 object-cover"
                              />
                            )}
                            {post.caption && (
                              <div className="p-3">
                                <p className="text-sm text-gray-700">{post.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ideas' && (
                  <div>
                    {userIdeas.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No public ideas yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userIdeas.map(idea => (
                          <div key={idea.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{idea.title}</h4>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{idea.content}</p>
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                                  <span className={`px-2 py-1 rounded-full ${
                                    idea.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {idea.is_public ? 'Public' : 'Private'}
                                  </span>
                                  {idea.recruitment && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      Recruiting
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};