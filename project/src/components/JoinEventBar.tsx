import React from 'react';
import { Users, Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../types/events';

interface JoinEventBarProps {
  event: Event;
  isParticipant: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onEnterRoom?: () => void;
}

export const JoinEventBar: React.FC<JoinEventBarProps> = ({
  event,
  isParticipant,
  onJoin,
  onLeave,
  onEnterRoom
}) => {
  const isUpcoming = new Date(event.start_ts) > new Date();
  const isLive = new Date(event.start_ts) <= new Date() && new Date(event.end_ts) >= new Date();
  const isPast = new Date(event.end_ts) < new Date();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const startDateTime = formatDateTime(event.start_ts);
  const endDateTime = formatDateTime(event.end_ts);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {startDateTime.date}
                {startDateTime.date !== endDateTime.date && ` - ${endDateTime.date}`}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {startDateTime.time} - {endDateTime.time}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {event.allow_public ? 'Public Event' : 'Private Event'}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            {isLive && (
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live Now
              </span>
            )}
            
            {isUpcoming && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Upcoming
              </span>
            )}
            
            {isPast && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Ended
              </span>
            )}
            
            {isParticipant && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Users className="h-3 w-3 mr-1" />
                Joined
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 ml-6">
          {!isPast && (
            <>
              {!isParticipant ? (
                <button
                  onClick={onJoin}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Join Event
                </button>
              ) : (
                <button
                  onClick={onLeave}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Leave Event
                </button>
              )}
            </>
          )}
          
          {isLive && event.type === 'meeting' && isParticipant && onEnterRoom && (
            <button
              onClick={onEnterRoom}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Enter Meeting Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};