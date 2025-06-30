import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Lightbulb, 
  Users, 
  Plus,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useUserStore } from '../store/userStore';

export const Dashboard: React.FC = () => {
  const { user } = useUserStore();
  const { documents, notes, ideas, events, sidebarOpen } = useWorkspaceStore();

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For now, we'll use mock data
  }, []);

  const recentDocuments = documents.slice(0, 3);
  const upcomingEvents = events
    .filter(event => new Date(event.start_time) > new Date())
    .slice(0, 3);
  const recentIdeas = ideas.slice(0, 3);

  const stats = [
    {
      label: 'Documents',
      value: documents.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Notes',
      value: notes.length,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Ideas',
      value: ideas.length,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Events',
      value: events.length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const quickActions = [
    {
      title: 'Upload PDF',
      description: 'Start annotating a research paper',
      icon: FileText,
      href: '/pdf/new',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'New Paper',
      description: 'Begin writing a research paper',
      icon: FileText,
      href: '/editor/new',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Schedule Meeting',
      description: 'Plan a research discussion',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Capture Idea',
      description: 'Save a research insight',
      icon: Lightbulb,
      href: '/ideas',
      color: 'bg-yellow-600 hover:bg-yellow-700',
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-73px)]">
        {sidebarOpen && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Research Space, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Your bright-blue digital clubhouse for collaborative research is ready.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className={`${action.color} text-white p-6 rounded-lg transition-colors group`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className="h-6 w-6" />
                        <h3 className="font-semibold">{action.title}</h3>
                      </div>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
                    <Link
                      to="/workspace"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View all
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {recentDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {recentDocuments.map((doc) => (
                        <Link
                          key={doc.id}
                          to={doc.type === 'pdf' ? `/pdf/${doc.id}` : `/editor/${doc.id}`}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-primary-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(doc.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No documents yet</p>
                      <Link
                        to="/pdf/new"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Upload your first PDF
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    <Link
                      to="/calendar"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View calendar
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center space-x-3 p-3 rounded-md bg-blue-50">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.start_time).toLocaleDateString()} at{' '}
                              {new Date(event.start_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming events</p>
                      <Link
                        to="/calendar"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Schedule a meeting
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Ideas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Ideas</h3>
                    <Link
                      to="/ideas"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View all
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {recentIdeas.length > 0 ? (
                    <div className="space-y-4">
                      {recentIdeas.map((idea) => (
                        <div key={idea.id} className="p-3 rounded-md hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{idea.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {idea.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No ideas captured yet</p>
                      <Link
                        to="/ideas"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Capture your first idea
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-700">New annotation added to "Research Paper.pdf"</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-700">Document "Meeting Notes" was shared</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-700">New idea "Machine Learning Approach" created</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};