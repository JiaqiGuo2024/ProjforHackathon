import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, BarChart3, Clock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { useProjectStore } from '../store/projectStore';
import { useUserStore } from '../store/userStore';
import { Project } from '../types/projects';
import { nanoid } from 'nanoid';

export const ProjectTimelines: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { 
    projects, 
    addProject, 
    getProjectProgress,
    initialize, 
    saveToStorage 
  } = useProjectStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    tags: [] as string[]
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const userProjects = projects.filter(project => 
    project.owner_id === user?.id || project.collaborators.includes(user?.id || '')
  );

  const handleCreateProject = () => {
    if (!newProject.title.trim() || !user) return;

    const project: Project = {
      id: nanoid(),
      title: newProject.title,
      description: newProject.description,
      owner_id: user.id,
      collaborators: [],
      status: 'planning',
      start_date: newProject.start_date,
      end_date: newProject.end_date,
      tags: newProject.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addProject(project);
    setNewProject({ title: '', description: '', start_date: '', end_date: '', tags: [] });
    setShowCreateForm(false);
    setSelectedProject(project);
    saveToStorage();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view projects</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex">
          {/* Sidebar - Project List */}
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 mr-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                </button>
              </div>

              {/* Create Project Form */}
              {showCreateForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Create New Project</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project title..."
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <textarea
                      placeholder="Description..."
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        placeholder="Start date"
                        value={newProject.start_date}
                        onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="date"
                        placeholder="End date"
                        value={newProject.end_date}
                        onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCreateProject}
                        disabled={!newProject.title.trim()}
                        className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project List */}
            <div className="p-4">
              {userProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No projects yet</p>
                  <p className="text-xs mt-1">Create your first project to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userProjects.map(project => {
                    const progress = getProjectProgress(project.id);
                    const isSelected = selectedProject?.id === project.id;

                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm">{project.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">{project.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(project.start_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-primary-600 h-1 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Timeline */}
          <div className="flex-1">
            {selectedProject ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h1>
                    <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {Math.round(getProjectProgress(selectedProject.id))}%
                      </div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <ProjectTimeline project={selectedProject} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Project</h3>
                <p className="text-gray-600">
                  Choose a project from the sidebar to view its timeline and manage milestones
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};