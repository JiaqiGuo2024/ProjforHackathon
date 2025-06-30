import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Calendar, 
  Lightbulb, 
  Zap,
  ArrowRight,
  Play,
  Check,
  MessageSquare,
  Video,
  Share2
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { signIn } from '../lib/supabase';

export const Landing: React.FC = () => {
  const { user } = useUserStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    try {
      await signIn(email);
      alert('Check your email for the magic link!');
      setShowAuthForm(false);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Collaborative Papers',
      description: 'Upload PDFs, annotate together in real-time, and write research papers with your team.',
    },
    {
      icon: MessageSquare,
      title: 'Smart Discussions',
      description: 'Chat about papers, share voice notes, and keep all research conversations organized.',
    },
    {
      icon: Lightbulb,
      title: 'Idea Sparking',
      description: 'Capture breakthrough moments, share insights, and collaborate on research ideas with LaTeX support.',
    },
    {
      icon: Video,
      title: 'Virtual Meetings',
      description: 'Host research meetings with screen sharing, file sharing, and collaborative note-taking.',
    },
    {
      icon: Calendar,
      title: 'Research Calendar',
      description: 'Schedule deadlines, meetings, and conferences with your research team in a shared calendar.',
    },
    {
      icon: Share2,
      title: 'Team Workspace',
      description: 'Create a digital clubhouse where your research team can collaborate, share, and grow together.',
    },
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8">
              <Check className="h-4 w-4" />
              <span>Welcome back, {user.name}!</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to continue your research?
            </h1>
            
            <Link
              to="/workspace"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <span>Enter Research Space</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              RS
            </div>
            <span className="text-xl font-bold text-gray-900">Research Space</span>
          </div>
          
          <button
            onClick={() => setShowAuthForm(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Bright-Blue
            <span className="text-primary-600"> Digital Clubhouse</span>
            <br />for Research
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Upload papers, scribble notes together, spark ideas, chat, meet, and team-up 
            on the workspace platform designed for researchers who love to collaborate.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            {!showAuthForm ? (
              <button
                onClick={() => setShowAuthForm(true)}
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                <span>Join Research Space</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <form onSubmit={handleSignIn} className="flex items-center space-x-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
            
            <button className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Free to start • No credit card required • Magic link authentication
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for research collaboration
          </h2>
          <p className="text-lg text-gray-600">
            A digital clubhouse where researchers connect, collaborate, and create together
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to join the research community?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Connect with researchers worldwide in your bright-blue digital clubhouse
          </p>
          
          {!showAuthForm ? (
            <button
              onClick={() => setShowAuthForm(true)}
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <span>Join Research Space</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <form onSubmit={handleSignIn} className="flex items-center justify-center space-x-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="px-4 py-3 border border-gray-300 rounded-lg text-lg text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              RS
            </div>
            <span className="font-semibold text-gray-900">Research Space</span>
          </div>
          
          <div className="text-sm text-gray-500">
            Built with ❤️ for researchers
          </div>
        </div>
      </footer>
    </div>
  );
};