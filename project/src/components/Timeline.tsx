import React from 'react';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent } from '../types';
import { Clock, Users, MapPin } from 'lucide-react';

interface TimelineProps {
  events: CalendarEvent[];
  selectedDate: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ events, selectedDate }) => {
  const dayEvents = events
    .filter(event => isSameDay(new Date(event.start_time), selectedDate))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getEventForHour = (hour: number) => {
    return dayEvents.find(event => {
      const eventHour = new Date(event.start_time).getHours();
      return eventHour === hour;
    });
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = format(new Date(startTime), 'h:mm a');
    const end = format(new Date(endTime), 'h:mm a');
    return `${start} - ${end}`;
  };

  const getEventDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    return Math.max(1, Math.round(duration));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Timeline - {format(selectedDate, 'EEE, MMM d')}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {timeSlots.map(hour => {
            const event = getEventForHour(hour);
            const hourString = hour.toString().padStart(2, '0');
            const isCurrentHour = new Date().getHours() === hour && isSameDay(new Date(), selectedDate);

            return (
              <div key={hour} className="flex border-b border-gray-100 last:border-b-0">
                {/* Time */}
                <div className="w-20 flex-shrink-0 p-3 text-right border-r border-gray-100">
                  <span className={`text-sm ${isCurrentHour ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 min-h-[60px] relative">
                  {isCurrentHour && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full -ml-1 z-10"></div>
                  )}
                  
                  {event ? (
                    <div 
                      className="bg-blue-50 border-l-4 border-blue-400 rounded-r-md p-3 hover:bg-blue-100 transition-colors cursor-pointer"
                      style={{ 
                        minHeight: `${Math.max(60, getEventDuration(event.start_time, event.end_time) * 60)}px` 
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatEventTime(event.start_time, event.end_time)}</span>
                            </div>
                            
                            {event.attendees.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-3 flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {event.title.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-300 text-sm">
                      {/* Empty time slot */}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      {dayEvents.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">{dayEvents.length}</div>
              <div className="text-xs text-gray-500">Total Events</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(
                  dayEvents.reduce((total, event) => {
                    const duration = (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60);
                    return total + duration;
                  }, 0) * 10
                ) / 10}h
              </div>
              <div className="text-xs text-gray-500">Total Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};