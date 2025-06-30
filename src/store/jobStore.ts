import { create } from 'zustand';
import { Job, JobApplication, EmployerReview, JobFilters } from '../types/jobs';
import { storage } from '../lib/storage';

interface JobState {
  // Jobs
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;

  // Applications
  applications: JobApplication[];
  setApplications: (applications: JobApplication[]) => void;
  addApplication: (application: JobApplication) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;

  // Reviews
  reviews: EmployerReview[];
  setReviews: (reviews: EmployerReview[]) => void;
  addReview: (review: EmployerReview) => void;

  // Filters
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;

  // Actions
  initialize: () => void;
  saveToStorage: () => void;
  getJobApplications: (jobId: string) => JobApplication[];
  getJobReviews: (jobId: string) => EmployerReview[];
  getAverageRating: (jobId: string) => number;
  getUserApplications: (userId: string) => JobApplication[];
  getUserJobs: (userId: string) => Job[];
}

export const useJobStore = create<JobState>((set, get) => ({
  // Jobs
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set(state => ({ 
    jobs: [job, ...state.jobs] 
  })),
  updateJob: (id, updates) => set(state => ({
    jobs: state.jobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    )
  })),
  removeJob: (id) => set(state => ({
    jobs: state.jobs.filter(job => job.id !== id)
  })),

  // Applications
  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (application) => set(state => ({ 
    applications: [...state.applications, application] 
  })),
  updateApplication: (id, updates) => set(state => ({
    applications: state.applications.map(app => 
      app.id === id ? { ...app, ...updates } : app
    )
  })),

  // Reviews
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
  addReview: (review) => set(state => ({ 
    reviews: [...state.reviews, review] 
  })),

  // Filters
  filters: {
    tags: []
  },
  setFilters: (filters) => set({ filters }),

  // Actions
  initialize: () => {
    const jobs = storage.get<Job[]>('jobs') || [];
    const applications = storage.get<JobApplication[]>('jobApplications') || [];
    const reviews = storage.get<EmployerReview[]>('employerReviews') || [];

    set({ jobs, applications, reviews });
  },

  saveToStorage: () => {
    const state = get();
    storage.set('jobs', state.jobs);
    storage.set('jobApplications', state.applications);
    storage.set('employerReviews', state.reviews);
  },

  getJobApplications: (jobId) => {
    return get().applications.filter(app => app.job_id === jobId);
  },

  getJobReviews: (jobId) => {
    return get().reviews.filter(review => review.job_id === jobId);
  },

  getAverageRating: (jobId) => {
    const jobReviews = get().reviews.filter(review => review.job_id === jobId);
    if (jobReviews.length === 0) return 0;
    const sum = jobReviews.reduce((acc, review) => acc + review.score, 0);
    return sum / jobReviews.length;
  },

  getUserApplications: (userId) => {
    return get().applications.filter(app => app.applicant_id === userId);
  },

  getUserJobs: (userId) => {
    return get().jobs.filter(job => job.poster_id === userId);
  }
}));