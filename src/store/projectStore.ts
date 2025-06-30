import { create } from 'zustand';
import { Project, ProjectMilestone, ProjectTask, Whiteboard, WhiteboardElement } from '../types/projects';
import { storage } from '../lib/storage';

interface ProjectState {
  // Projects
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Milestones
  milestones: ProjectMilestone[];
  setMilestones: (milestones: ProjectMilestone[]) => void;
  addMilestone: (milestone: ProjectMilestone) => void;
  updateMilestone: (id: string, updates: Partial<ProjectMilestone>) => void;
  removeMilestone: (id: string) => void;

  // Tasks
  tasks: ProjectTask[];
  setTasks: (tasks: ProjectTask[]) => void;
  addTask: (task: ProjectTask) => void;
  updateTask: (id: string, updates: Partial<ProjectTask>) => void;
  removeTask: (id: string) => void;

  // Whiteboards
  whiteboards: Whiteboard[];
  setWhiteboards: (whiteboards: Whiteboard[]) => void;
  addWhiteboard: (whiteboard: Whiteboard) => void;
  updateWhiteboard: (id: string, updates: Partial<Whiteboard>) => void;
  removeWhiteboard: (id: string) => void;

  // Whiteboard Elements
  whiteboardElements: WhiteboardElement[];
  setWhiteboardElements: (elements: WhiteboardElement[]) => void;
  addWhiteboardElement: (element: WhiteboardElement) => void;
  updateWhiteboardElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  removeWhiteboardElement: (id: string) => void;

  // Actions
  initialize: () => void;
  saveToStorage: () => void;
  getProjectMilestones: (projectId: string) => ProjectMilestone[];
  getProjectTasks: (projectId: string) => ProjectTask[];
  getMilestoneProgress: (milestoneId: string) => number;
  getProjectProgress: (projectId: string) => number;
  getWhiteboardElements: (whiteboardId: string) => WhiteboardElement[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Projects
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set(state => ({ 
    projects: [project, ...state.projects] 
  })),
  updateProject: (id, updates) => set(state => ({
    projects: state.projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    )
  })),
  removeProject: (id) => set(state => ({
    projects: state.projects.filter(project => project.id !== id)
  })),

  // Milestones
  milestones: [],
  setMilestones: (milestones) => set({ milestones }),
  addMilestone: (milestone) => set(state => ({ 
    milestones: [...state.milestones, milestone] 
  })),
  updateMilestone: (id, updates) => set(state => ({
    milestones: state.milestones.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    )
  })),
  removeMilestone: (id) => set(state => ({
    milestones: state.milestones.filter(milestone => milestone.id !== id)
  })),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set(state => ({ 
    tasks: [...state.tasks, task] 
  })),
  updateTask: (id, updates) => set(state => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  removeTask: (id) => set(state => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  // Whiteboards
  whiteboards: [],
  setWhiteboards: (whiteboards) => set({ whiteboards }),
  addWhiteboard: (whiteboard) => set(state => ({ 
    whiteboards: [whiteboard, ...state.whiteboards] 
  })),
  updateWhiteboard: (id, updates) => set(state => ({
    whiteboards: state.whiteboards.map(whiteboard => 
      whiteboard.id === id ? { ...whiteboard, ...updates } : whiteboard
    )
  })),
  removeWhiteboard: (id) => set(state => ({
    whiteboards: state.whiteboards.filter(whiteboard => whiteboard.id !== id)
  })),

  // Whiteboard Elements
  whiteboardElements: [],
  setWhiteboardElements: (whiteboardElements) => set({ whiteboardElements }),
  addWhiteboardElement: (element) => set(state => ({ 
    whiteboardElements: [...state.whiteboardElements, element] 
  })),
  updateWhiteboardElement: (id, updates) => set(state => ({
    whiteboardElements: state.whiteboardElements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    )
  })),
  removeWhiteboardElement: (id) => set(state => ({
    whiteboardElements: state.whiteboardElements.filter(element => element.id !== id)
  })),

  // Actions
  initialize: () => {
    const projects = storage.get<Project[]>('projects') || [];
    const milestones = storage.get<ProjectMilestone[]>('projectMilestones') || [];
    const tasks = storage.get<ProjectTask[]>('projectTasks') || [];
    const whiteboards = storage.get<Whiteboard[]>('whiteboards') || [];
    const whiteboardElements = storage.get<WhiteboardElement[]>('whiteboardElements') || [];

    set({ projects, milestones, tasks, whiteboards, whiteboardElements });
  },

  saveToStorage: () => {
    const state = get();
    storage.set('projects', state.projects);
    storage.set('projectMilestones', state.milestones);
    storage.set('projectTasks', state.tasks);
    storage.set('whiteboards', state.whiteboards);
    storage.set('whiteboardElements', state.whiteboardElements);
  },

  getProjectMilestones: (projectId) => {
    return get().milestones.filter(milestone => milestone.project_id === projectId);
  },

  getProjectTasks: (projectId) => {
    return get().tasks.filter(task => task.project_id === projectId);
  },

  getMilestoneProgress: (milestoneId) => {
    const milestoneTasks = get().tasks.filter(task => task.milestone_id === milestoneId);
    if (milestoneTasks.length === 0) return 0;
    const completedTasks = milestoneTasks.filter(task => task.status === 'done');
    return (completedTasks.length / milestoneTasks.length) * 100;
  },

  getProjectProgress: (projectId) => {
    const projectTasks = get().tasks.filter(task => task.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === 'done');
    return (completedTasks.length / projectTasks.length) * 100;
  },

  getWhiteboardElements: (whiteboardId) => {
    return get().whiteboardElements.filter(element => element.whiteboard_id === whiteboardId);
  }
}));