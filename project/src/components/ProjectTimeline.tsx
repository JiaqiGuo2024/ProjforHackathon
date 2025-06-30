import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Circle, Users, Flag, Clock } from 'lucide-react';
import { Project, ProjectMilestone, ProjectTask } from '../types/projects';
import { useProjectStore } from '../store/projectStore';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

interface ProjectTimelineProps {
  project: Project;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const { user } = useUserStore();
  const { 
    getProjectMilestones, 
    getProjectTasks, 
    getMilestoneProgress,
    addMilestone, 
    addTask,
    updateMilestone,
    updateTask,
    saveToStorage 
  } = useProjectStore();

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', due_date: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });

  const milestones = getProjectMilestones(project.id).sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );
  const tasks = getProjectTasks(project.id);

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim() || !user) return;

    const milestone: ProjectMilestone = {
      id: nanoid(),
      project_id: project.id,
      title: newMilestone.title,
      description: newMilestone.description,
      due_date: newMilestone.due_date,
      completed: false,
      assigned_to: [user.id],
      created_at: new Date().toISOString()
    };

    addMilestone(milestone);
    setNewMilestone({ title: '', description: '', due_date: '' });
    setShowAddMilestone(false);
    saveToStorage();
  };

  const handleAddTask = (milestoneId?: string) => {
    if (!newTask.title.trim() || !user) return;

    const task: ProjectTask = {
      id: nanoid(),
      project_id: project.id,
      milestone_id: milestoneId,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assigned_to: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addTask(task);
    setNewTask({ title: '', description: '', priority: 'medium' });
    setShowAddTask(null);
    saveToStorage();
  };

  const toggleMilestoneComplete = (milestone: ProjectMilestone) => {
    updateMilestone(milestone.id, {
      completed: !milestone.completed,
      completed_at: !milestone.completed ? new Date().toISOString() : undefined
    });
    saveToStorage();
  };

  const updateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    updateTask(taskId, { 
      status,
      updated_at: new Date().toISOString()
    });
    saveToStorage();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
        <button
          onClick={() => setShowAddMilestone(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add Milestone Form */}
      {showAddMilestone && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Add New Milestone</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Milestone title..."
              value={newMilestone.title}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description..."
              value={newMilestone.description}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
            />
            <input
              type="date"
              value={newMilestone.due_date}
              onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddMilestone}
                disabled={!newMilestone.title.trim() || !newMilestone.due_date}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Milestone
              </button>
              <button
                onClick={() => setShowAddMilestone(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No milestones yet</p>
            <p className="text-sm mt-1">Add your first milestone to start tracking progress</p>
          </div>
        ) : (
          milestones.map((milestone, index) => {
            const progress = getMilestoneProgress(milestone.id);
            const milestoneTasks = tasks.filter(task => task.milestone_id === milestone.id);
            const isOverdue = new Date(milestone.due_date) < new Date() && !milestone.completed;

            return (
              <div key={milestone.id} className="relative">
                {/* Timeline Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                )}

                {/* Milestone */}
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => toggleMilestoneComplete(milestone)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-green-600 text-white'
                        : isOverdue
                        ? 'bg-red-100 text-red-600 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>

                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-semibold ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {new Date(milestone.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      {milestoneTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                task.status === 'done'
                                  ? 'bg-green-600 border-green-600 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {task.status === 'done' && <CheckCircle className="h-3 w-3" />}
                            </button>
                            <span className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Add Task */}
                      {showAddTask === milestone.id ? (
                        <div className="p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Task title..."
                              value={newTask.title}
                              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <div className="flex items-center space-x-2">
                              <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <button
                                onClick={() => handleAddTask(milestone.id)}
                                disabled={!newTask.title.trim()}
                                className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setShowAddTask(null)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTask(milestone.id)}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors text-sm"
                        >
                          + Add Task
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};