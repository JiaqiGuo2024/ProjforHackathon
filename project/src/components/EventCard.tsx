import React from 'react';
import { Calendar, Users, Star, MapPin, Clock, Eye } from 'lucide-react';
import { Event } from '../types/events';
import { useEventStore } from '../store/eventStore';

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  onView: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onJoin,
  onView
}) => {
  const { getAverageRating, getEventParticipants } = useEventStore();
  
  const averageRating = getAverageRating(event.id);
  const participants = getEventParticipants(event.id);
  const participantCount = participants.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const startDate = formatDate(event.start_ts);
  const endDate = formatDate(event.end_ts);

  const isUpcoming = new Date(event.start_ts) > new Date();
  const isLive = new Date(event.start_ts) <= new Date() && new Date(event.end_ts) >= new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Cover Image */}
      {event.coverUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={event.coverUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.type === 'meeting' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {event.type === 'meeting' ? 'Meeting' : 'Conference'}
              </span>
              
              {isLive && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </span>
              )}
              
              {event.allow_public && (
                <Eye className="h-4 w-4 text-gray-400" title="Public event" />
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
          </div>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center space-x-1 ml-4">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{startDate.date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{startDate.time} - {endDate.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onView(event.id)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          
          {isUpcoming && (
            <button
              onClick={() => onJoin(event.id)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Join Event
            </button>
          )}
          
          {isLive && event.type === 'meeting' && (
            <button
              onClick={() => onJoin(event.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Enter Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};