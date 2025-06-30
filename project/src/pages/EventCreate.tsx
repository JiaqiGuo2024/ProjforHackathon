import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { MediaUploader } from '../components/MediaUploader';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { Event, EventParticipant } from '../types/events';
import { nanoid } from 'nanoid';

export const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { addEvent, addParticipant, saveToStorage } = useEventStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting' as 'meeting' | 'conference',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    tags: [] as string[],
    allow_public: true,
    coverUrl: '',
    poster_urls: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to create events</h1>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.start_date || !formData.start_time || !formData.end_date || !formData.end_time) {
      alert('Please fill in all required fields');
      return;
    }

    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }

    const eventId = nanoid();
    
    const event: Event = {
      id: eventId,
      title: formData.title,
      description: formData.description,
      coverUrl: formData.coverUrl,
      type: formData.type,
      start_ts: startDateTime.toISOString(),
      end_ts: endDateTime.toISOString(),
      host: user.id,
      poster_urls: formData.poster_urls,
      tags: formData.tags,
      allow_public: formData.allow_public,
      created_at: new Date().toISOString()
    };

    // Add host as participant
    const hostParticipant: EventParticipant = {
      event_id: eventId,
      user_id: user.id,
      role: 'host'
    };

    addEvent(event);
    addParticipant(hostParticipant);
    saveToStorage();

    navigate(`/events/${eventId}`);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCoverUpload = (url: string) => {
    setFormData(prev => ({ ...prev, coverUrl: url }));
  };

  const handlePosterUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      poster_urls: [...prev.poster_urls, url]
    }));
  };

  const removePoster = (index: number) => {
    setFormData(prev => ({
      ...prev,
      poster_urls: prev.poster_urls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 mt-1">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(stepNumber => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNumber < step ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Media & Posters</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter event title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe your event..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'meeting' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.type === 'meeting'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">Meeting</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Interactive session with video calls and screen sharing
                    </p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'conference' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.type === 'conference'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">Conference</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Large-scale event with presentations and posters
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-primary-500 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media & Posters</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                {formData.coverUrl ? (
                  <div className="relative">
                    <img
                      src={formData.coverUrl}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, coverUrl: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <MediaUploader onUpload={handleCoverUpload} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Posters
                </label>
                
                {formData.poster_urls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {formData.poster_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Poster ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePoster(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <MediaUploader onUpload={handlePosterUpload} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Settings</h2>
              
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.allow_public}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_public: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Public Event</span>
                    <p className="text-sm text-gray-600">
                      Allow anyone to view and join this event
                    </p>
                  </div>
                </label>
              </div>

              {/* Event Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Event Summary</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-900">{formData.title}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{formData.type}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.start_date} {formData.start_time} - {formData.end_date} {formData.end_time}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Visibility:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.allow_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Create Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};