import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { CalendarGrid } from '../components/CalendarGrid';
import { Timeline } from '../components/Timeline';
import { CalendarEvent } from '../types';
import { useWorkspaceStore } from '../store/workspaceStore';

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, addEvent } = useWorkspaceStore();

  const handleEventCreate = (event: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    addEvent(newEvent);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="h-[calc(100vh-73px)] flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-6">
          <CalendarGrid
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventCreate={handleEventCreate}
          />
        </div>

        {/* Timeline Sidebar */}
        <div className="w-96 p-6">
          <Timeline
            events={events}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};