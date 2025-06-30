import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, startOfDay } from 'date-fns';
import { CalendarEvent } from '../types';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventCreate: (event: Omit<CalendarEvent, 'id' | 'created_at'>) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  selectedDate,
  onDateSelect,
  onEventCreate,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    attendees: [] as string[],
  });

  const eventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.start_time || !newEvent.end_time) {
      return;
    }

    const startDate = new Date(selectedDate);
    const [startHour, startMinute] = newEvent.start_time.split(':');
    startDate.setHours(parseInt(startHour), parseInt(startMinute));

    const endDate = new Date(selectedDate);
    const [endHour, endMinute] = newEvent.end_time.split(':');
    endDate.setHours(parseInt(endHour), parseInt(endMinute));

    onEventCreate({
      title: newEvent.title,
      description: newEvent.description,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      created_by: 'current-user', // This should come from user context
      attendees: newEvent.attendees,
    });

    setNewEvent({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      attendees: [],
    });
    setShowCreateForm(false);
  };

  const modifiers = {
    hasEvents: (date: Date) => eventsForDate(date).length > 0,
  };

  const modifiersStyles = {
    hasEvents: {
      backgroundColor: '#dbeafe',
      border: '2px solid #3b82f6',
      borderRadius: '50%',
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        <style>
          {`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #3b82f6;
              --rdp-background-color: #dbeafe;
            }
            .rdp-months {
              display: flex;
              justify-content: center;
            }
            .rdp-month {
              margin: 0;
            }
            .rdp-table {
              width: 100%;
              max-width: none;
            }
            .rdp-head_cell {
              font-weight: 600;
              text-align: center;
              padding: 0.5rem;
              color: #374151;
            }
            .rdp-cell {
              text-align: center;
              padding: 2px;
            }
            .rdp-button {
              width: 40px;
              height: 40px;
              border-radius: 6px;
              border: none;
              background: none;
              cursor: pointer;
              transition: all 0.2s;
            }
            .rdp-button:hover {
              background-color: #f3f4f6;
            }
            .rdp-day_selected {
              background-color: #3b82f6 !important;
              color: white;
            }
            .rdp-day_today {
              font-weight: bold;
              color: #3b82f6;
            }
          `}
        </style>
        
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="w-full"
        />
      </div>

      {/* Selected Date Events */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-3">
          {eventsForDate(selectedDate).map(event => (
            <div key={event.id} className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                  <p className="text-sm text-blue-600 mt-1">
                    {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {event.attendees.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {eventsForDate(selectedDate).length === 0 && (
            <p className="text-gray-500 text-sm italic">No events scheduled for this date</p>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Event for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Event description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.title.trim() || !newEvent.start_time || !newEvent.end_time}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};