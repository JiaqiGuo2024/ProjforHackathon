import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Clock, 
  Tag,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { documents, notes, sidebarOpen } = useWorkspaceStore();

  const recentDocuments = documents.slice(0, 5);
  const recentNotes = notes.slice(0, 3);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recent Documents */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Recent Documents</h3>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-2">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  to={doc.type === 'pdf' ? `/pdf/${doc.id}` : `/editor/${doc.id}`}
                  className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No recent documents</p>
            )}
          </div>
        </div>

        {/* Active Collaborations */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Active Collaborations</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Research Paper Draft</span>
              <span className="text-xs text-gray-500 ml-auto">3 users</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Meeting Notes</span>
              <span className="text-xs text-gray-500 ml-auto">2 users</span>
            </div>
          </div>
        </div>

        {/* Quick Notes */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Quick Notes</h3>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-2">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {note.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No quick notes</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">New annotation added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">Document shared</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-700">New idea created</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filter & Sort</span>
        </button>
      </div>
    </aside>
  );
};