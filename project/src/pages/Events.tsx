import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, TrendingUp } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'participants'>('rating');
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showAnnualBest, setShowAnnualBest] = useState(false);

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

  // Annual best events (top rated events from this year)
  const currentYear = new Date().getFullYear();
  const annualBestEvents = events
    .filter(event => {
      const eventYear = new Date(event.start_ts).getFullYear();
      return eventYear === currentYear && getAverageRating(event.id) >= 4.0;
    })
    .sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id))
    .slice(0, 5);

  const handleJoinEvent = (eventId: string) => {
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
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnnualBest(!showAnnualBest)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAnnualBest
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Annual Best</span>
            </button>
            
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
        </div>

        {/* Annual Best Events Banner */}
        {showAnnualBest && annualBestEvents.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">🏆 {currentYear} Annual Best Events</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Top-rated events of the year based on participant reviews and ratings
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {annualBestEvents.map((event, index) => (
                <div key={event.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{getAverageRating(event.id).toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <button
                    onClick={() => handleViewEvent(event.id)}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Event →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredEvents.length} of {events.length} event{events.length !== 1 ? 's' : ''}
                {sortBy === 'rating' && ' • Sorted by highest rated'}
                {sortBy === 'participants' && ' • Sorted by most popular'}
                {sortBy === 'date' && ' • Sorted by date'}
              </p>
              
              {sortBy === 'rating' && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>Quality-first ranking</span>
                </div>
              )}
            </div>

            {/* Events Grid */}
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
          </>
        )}
      </div>
    </div>
  );
};