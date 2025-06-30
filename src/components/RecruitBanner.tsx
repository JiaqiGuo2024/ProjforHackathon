import React from 'react';
import { UserPlus, Users, Calendar } from 'lucide-react';
import { ExtendedIdea } from '../types/social';

interface RecruitBannerProps {
  recruitingIdeas: ExtendedIdea[];
  onJoinIdea: (ideaId: string) => void;
}

export const RecruitBanner: React.FC<RecruitBannerProps> = ({
  recruitingIdeas,
  onJoinIdea
}) => {
  if (recruitingIdeas.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <UserPlus className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">Projects Seeking Collaborators</h3>
      </div>
      
      <div className="space-y-3">
        {recruitingIdeas.slice(0, 3).map(idea => (
          <div key={idea.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{idea.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-1">{idea.content}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{idea.allowed_viewers.length} member{idea.allowed_viewers.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onJoinIdea(idea.id)}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Join Project
            </button>
          </div>
        ))}
        
        {recruitingIdeas.length > 3 && (
          <p className="text-sm text-gray-600 text-center">
            +{recruitingIdeas.length - 3} more projects seeking collaborators
          </p>
        )}
      </div>
    </div>
  );
};