import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Building, ExternalLink } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { JobStatusBadge } from '../components/JobStatusBadge';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';

export const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { jobs, getUserApplications, initialize } = useJobStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view applications</h1>
        </div>
      </div>
    );
  }

  const userApplications = getUserApplications(user.id);
  const applicationsWithJobs = userApplications.map(app => ({
    ...app,
    job: jobs.find(job => job.id === app.job_id)
  })).filter(app => app.job);

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Jobs</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">
              Track your job applications and their status
            </p>
          </div>
        </div>

        {/* Applications List */}
        {applicationsWithJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              Start applying to research positions and internships
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Briefcase className="h-5 w-5" />
              <span>Browse Jobs</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applicationsWithJobs.map(({ job, ...application }) => (
              <div key={application.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {job!.company_logo ? (
                        <img
                          src={job!.company_logo}
                          alt={job!.company}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job!.title}</h3>
                          <JobStatusBadge status={application.status} />
                        </div>
                        
                        <p className="text-gray-600 font-medium mb-2">{job!.company}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          {job!.paid ? (
                            <span className="text-emerald-600 font-medium">Paid Position</span>
                          ) : (
                            <span className="text-slate-600">Unpaid/Volunteer</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(`/jobs/${job!.id}`)}
                        className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Job</span>
                      </button>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cover Letter Preview</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {application.cover_letter}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Application Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Submitted</span>
                            <span className="text-green-600">✓</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Under Review</span>
                            <span className={application.status === 'applied' ? 'text-gray-400' : 'text-green-600'}>
                              {application.status === 'applied' ? '○' : '✓'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Interview</span>
                            <span className={['interview', 'offer'].includes(application.status) ? 'text-green-600' : 'text-gray-400'}>
                              {['interview', 'offer'].includes(application.status) ? '✓' : '○'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Decision</span>
                            <span className={['offer', 'rejected'].includes(application.status) ? 'text-green-600' : 'text-gray-400'}>
                              {['offer', 'rejected'].includes(application.status) ? '✓' : '○'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};