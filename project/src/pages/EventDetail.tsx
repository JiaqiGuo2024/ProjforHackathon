import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Clock, Tag } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { JoinEventBar } from '../components/JoinEventBar';
import { PosterGallery } from '../components/PosterGallery';
import { RatingPanel } from '../components/RatingPanel';
import { CalendarSyncBtn } from '../components/CalendarSyncBtn';
import { ChatPanel } from '../components/ChatPanel';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { EventParticipant } from '../types/events';
import { nanoid } from 'nanoid';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { 
    events, 
    getEventParticipants, 
    addParticipant, 
    removeParticipant,
    saveToStorage 
  } = useEventStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'posters' | 'chat' | 'ratings'>('overview');
  const [messages, setMessages] = useState<any[]>([]);

  const event = events.find(e => e.id === id);
  const participants = event ? getEventParticipants(event.id) : [];
  const isParticipant = user ? participants.some(p => p.user_id === user.id) : false;

  useEffect(() => {
    // In a real app, load chat messages for this event
    setMessages([]);
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => navigate('/events')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleJoin = () => {
    if (!user) return;

    const participant: EventParticipant = {
      event_id: event.id,
      user_id: user.id,
      role: 'attendee'
    };

    addParticipant(participant);
    saveToStorage();
  };

  const handleLeave = () => {
    if (!user) return;
    removeParticipant(event.id, user.id);
    saveToStorage();
  };

  const handleEnterRoom = () => {
    navigate(`/room/${event.id}`);
  };

  const handleMessageSend = (content: string) => {
    if (!user) return;

    const message = {
      id: nanoid(),
      document_id: event.id,
      user_id: user.id,
      user_name: user.name,
      user_color: user.avatarColor,
      content,
      type: 'text' as const,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {event.coverUrl && (
            <div className="h-64 bg-gray-200 overflow-hidden">
              <img
                src={event.coverUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'meeting' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type === 'meeting' ? 'Meeting' : 'Conference'}
                  </span>
                  
                  {event.allow_public && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Public
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
              </div>

              <div className="ml-8">
                <CalendarSyncBtn event={event} />
              </div>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Join Event Bar */}
        <div className="mb-8">
          <JoinEventBar
            event={event}
            isParticipant={isParticipant}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onEnterRoom={handleEnterRoom}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'posters', label: `Posters (${event.poster_urls.length})` },
              { id: 'chat', label: `Chat (${messages.length})` },
              { id: 'ratings', label: 'Ratings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Date</p>
                          <p className="text-gray-600">
                            {new Date(event.start_ts).toLocaleDateString()} - {new Date(event.end_ts).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Time</p>
                          <p className="text-gray-600">
                            {new Date(event.start_ts).toLocaleTimeString()} - {new Date(event.end_ts).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Participants</p>
                          <p className="text-gray-600">{participants.length} registered</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {event.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posters' && (
              <PosterGallery
                posterUrls={event.poster_urls}
                eventTitle={event.title}
              />
            )}

            {activeTab === 'chat' && (
              <div className="h-96">
                <ChatPanel
                  messages={messages}
                  onMessageSend={handleMessageSend}
                />
              </div>
            )}

            {activeTab === 'ratings' && (
              <RatingPanel eventId={event.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};