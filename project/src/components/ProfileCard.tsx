import React from 'react';
import { User, MapPin, Building, Tag, Edit3 } from 'lucide-react';
import { Profile } from '../types/social';

interface ProfileCardProps {
  profile: Profile;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isOwner = false,
  onEdit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="h-24 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Edit Button */}
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Edit3 className="h-4 w-4 text-gray-600" />
          </button>
        )}

        {/* Profile Info */}
        <div className="pt-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
          
          {profile.headline && (
            <p className="text-lg text-gray-600 mb-4">{profile.headline}</p>
          )}

          {profile.bio && (
            <p className="text-gray-700 mb-4 leading-relaxed">{profile.bio}</p>
          )}

          {/* Institution & Field */}
          <div className="space-y-2 mb-4">
            {profile.institution && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="h-4 w-4" />
                <span>{profile.institution}</span>
              </div>
            )}
            
            {profile.field && (
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>{profile.field}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};