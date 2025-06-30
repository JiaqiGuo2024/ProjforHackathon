import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { JobCard } from '../components/JobCard';
import { JobFilterBar } from '../components/JobFilterBar';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';
import { Job } from '../types/jobs';

export const JobsBoard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { jobs, filters, setFilters, initialize } = useJobStore();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPaid = filters.paid === undefined || job.paid === filters.paid;
    const matchesRemote = filters.remote === undefined || job.remote_ok === filters.remote;
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.some(tag => job.tags.includes(tag));
    
    const matchesSalary = !filters.salaryMin || !filters.salaryMax || 
      (job.paid && job.salary_min && job.salary_max &&
       job.salary_min >= (filters.salaryMin || 0) &&
       job.salary_max <= (filters.salaryMax || Infinity));

    // Filter out expired jobs
    const isNotExpired = new Date(job.open_until) >= new Date();
    
    return matchesSearch && matchesPaid && matchesRemote && matchesTags && matchesSalary && isNotExpired;
  });

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Jobs & Internships</h1>
            <p className="text-gray-600">
              Discover research opportunities, internships, and academic positions
            </p>
          </div>
          
          {user && (
            <button
              onClick={() => navigate('/jobs/new')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Post a Job</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <JobFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {jobs.length === 0
                ? "No jobs have been posted yet"
                : "Try adjusting your search or filters"
              }
            </p>
            {user && jobs.length === 0 && (
              <button
                onClick={() => navigate('/jobs/new')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Post First Job</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={handleViewJob}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};