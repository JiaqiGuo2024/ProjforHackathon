import React from 'react';
import { Search, Filter, Calendar, Star } from 'lucide-react';

interface EventFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: 'all' | 'meeting' | 'conference';
  onTypeChange: (type: 'all' | 'meeting' | 'conference') => void;
  sortBy: 'date' | 'rating' | 'participants';
  onSortChange: (sort: 'date' | 'rating' | 'participants') => void;
  showUpcoming: boolean;
  onUpcomingToggle: (upcoming: boolean) => void;
}

export const EventFilterBar: React.FC<EventFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  showUpcoming,
  onUpcomingToggle
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="meeting">Meetings</option>
            <option value="conference">Conferences</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="participants">Participants</option>
          </select>
        </div>

        {/* Upcoming Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUpcoming}
            onChange={(e) => onUpcomingToggle(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Upcoming only</span>
        </label>
      </div>
    </div>
  );
};