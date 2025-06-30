import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { Event } from '../types/events';

interface CalendarSyncBtnProps {
  event: Event;
  className?: string;
}

export const CalendarSyncBtn: React.FC<CalendarSyncBtnProps> = ({
  event,
  className = ''
}) => {
  const generateICS = () => {
    const startDate = new Date(event.start_ts);
    const endDate = new Date(event.end_ts);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Research Workspace//Event//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@research-workspace.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.type === 'meeting' ? 'Online Meeting Room' : 'Conference Venue'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateICS}
      className={`inline-flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      title="Add to Calendar"
    >
      <Calendar className="h-4 w-4" />
      <span>Add to Calendar</span>
    </button>
  );
};