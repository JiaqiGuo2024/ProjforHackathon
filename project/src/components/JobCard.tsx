import React from 'react';
import { MapPin, DollarSign, Clock, Building, Wifi, Users } from 'lucide-react';
import { Job } from '../types/jobs';
import { useJobStore } from '../store/jobStore';

interface JobCardProps {
  job: Job;
  onView: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onView }) => {
  const { getAverageRating, getJobApplications } = useJobStore();
  
  const averageRating = getAverageRating(job.id);
  const applicationCount = getJobApplications(job.id).length;

  const formatSalary = () => {
    if (!job.paid) return null;
    
    if (job.salary_min && job.salary_max) {
      return `${job.currency || '$'}${job.salary_min.toLocaleString()} - ${job.currency || '$'}${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `From ${job.currency || '$'}${job.salary_min.toLocaleString()}`;
    }
    return 'Competitive salary';
  };

  const isExpired = new Date(job.open_until) < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary-600" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            {job.paid ? (
              <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                <DollarSign className="h-3 w-3 mr-1" />
                PAID
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                UNPAID
              </span>
            )}
            
            {isExpired && (
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                <Clock className="h-3 w-3 mr-1" />
                EXPIRED
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">{job.description}</p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {job.paid && formatSalary() && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>{formatSalary()}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {job.remote_ok ? (
              <>
                <Wifi className="h-4 w-4" />
                <span>Remote OK</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                <span>{job.location || 'On-site'}</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Closes {new Date(job.open_until).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">★</span>
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{applicationCount} applicant{applicationCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <button
            onClick={() => onView(job.id)}
            disabled={isExpired}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};