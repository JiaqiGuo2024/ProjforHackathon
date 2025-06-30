import React from 'react';
import { Lock, Users, Globe, UserPlus } from 'lucide-react';

interface IdeaPrivacyBarProps {
  isPublic: boolean;
  recruitment: boolean;
  allowedViewers: string[];
  onVisibilityChange: (isPublic: boolean) => void;
  onRecruitmentChange: (recruitment: boolean) => void;
}

export const IdeaPrivacyBar: React.FC<IdeaPrivacyBarProps> = ({
  isPublic,
  recruitment,
  allowedViewers,
  onVisibilityChange,
  onRecruitmentChange
}) => {
  const getVisibilityIcon = () => {
    if (isPublic) return Globe;
    if (allowedViewers.length > 0) return Users;
    return Lock;
  };

  const getVisibilityText = () => {
    if (isPublic) return 'Public';
    if (allowedViewers.length > 0) return `Team (${allowedViewers.length})`;
    return 'Private';
  };

  const VisibilityIcon = getVisibilityIcon();

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Visibility Selector */}
        <div className="flex items-center space-x-2">
          <VisibilityIcon className="h-4 w-4 text-gray-600" />
          <select
            value={isPublic ? 'public' : allowedViewers.length > 0 ? 'team' : 'private'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'public') {
                onVisibilityChange(true);
              } else {
                onVisibilityChange(false);
                // In a real app, you'd handle team selection here
              }
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="private">Private</option>
            <option value="team">Team-only</option>
            <option value="public">Public</option>
          </select>
        </div>

        {/* Recruitment Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={recruitment}
            onChange={(e) => onRecruitmentChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <UserPlus className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">Recruiting</span>
        </label>
      </div>

      <div className="text-xs text-gray-500">
        {recruitment && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Open for collaboration
          </span>
        )}
      </div>
    </div>
  );
};