import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard';
import { EventFilterBar } from '../components/EventFilterBar';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { Event } from '../types/events';

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { events, getAverageRating, getEventParticipants, initialize } = useEventStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'meeting' | 'conference'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'participants'>('date');
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || event.type === selectedType;
      
      const matchesUpcoming = !showUpcoming || new Date(event.start_ts) > new Date();
      
      return matchesSearch && matchesType && matchesUpcoming;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime();
        case 'rating':
          return getAverageRating(b.id) - getAverageRating(a.id);
        case 'participants':
          return getEventParticipants(b.id).length - getEventParticipants(a.id).length;
        default:
          return 0;
      }
    });

  const handleJoinEvent = (eventId: string) => {
    // In a real app, this would add the user as a participant
    console.log('Joining event:', eventId);
    navigate(`/events/${eventId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Events</h1>
            <p className="text-gray-600">
              Discover conferences, meetings, and research gatherings
            </p>
          </div>
          
          {user && (
            <button
              onClick={() => navigate('/events/new')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Event</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <EventFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showUpcoming={showUpcoming}
          onUpcomingToggle={setShowUpcoming}
        />

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {events.length === 0
                ? "No events have been created yet"
                : "Try adjusting your search or filters"
              }
            </p>
            {user && events.length === 0 && (
              <button
                onClick={() => navigate('/events/new')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create First Event</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onView={handleViewEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};