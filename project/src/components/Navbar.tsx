import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Lightbulb, 
  User, 
  Menu,
  LogOut,
  Settings,
  Users,
  Lock,
  CalendarDays,
  Briefcase,
  BarChart3,
  Palette
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { signOut } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const { sidebarOpen, setSidebarOpen } = useWorkspaceStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/workspace', icon: FileText, label: 'Dashboard' },
    { path: '/feed', icon: Users, label: 'Feed' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/events', icon: CalendarDays, label: 'Events' },
    { path: '/projects', icon: BarChart3, label: 'Projects' },
    { path: '/whiteboards', icon: Palette, label: 'Whiteboards' },
    { path: '/editor', icon: FileText, label: 'Editor' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/ideas', icon: Lightbulb, label: 'Ideas' },
    { path: '/vault', icon: Lock, label: 'Vault' },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              RS
            </div>
            <span className="text-xl font-semibold text-gray-900">Research Space</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/u/me"
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-2 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1">
          {navItems.slice(0, 9).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-gray-900 text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-lg"
        >
          <span>⚡</span>
          <span>Built with Bolt.new</span>
        </a>
      </div>
    </nav>
  );
};