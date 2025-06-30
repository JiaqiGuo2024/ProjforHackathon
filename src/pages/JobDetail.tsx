import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Wifi, Users, Calendar } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { JobApplyDrawer } from '../components/JobApplyDrawer';
import { EmployerRating } from '../components/EmployerRating';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { 
    jobs, 
    getJobApplications, 
    getUserApplications,
    initialize 
  } = useJobStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [showApplyDrawer, setShowApplyDrawer] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const job = jobs.find(j => j.id === id);
  const applications = job ? getJobApplications(job.id) : [];
  const userApplications = user ? getUserApplications(user.id) : [];
  const hasApplied = userApplications.some(app => app.job_id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(job.open_until) < new Date();
  const isOwner = user?.id === job.poster_id;

  const formatSalary = () => {
    if (!job.paid) return 'Unpaid/Volunteer Position';
    
    if (job.salary_min && job.salary_max) {
      return `${job.currency || '$'}${job.salary_min.toLocaleString()} - ${job.currency || '$'}${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `From ${job.currency || '$'}${job.salary_min.toLocaleString()}`;
    }
    return 'Competitive salary';
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs</span>
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-primary-600" />
                  </div>
                )}
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 font-medium">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {job.paid ? (
                  <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    PAID
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                    UNPAID
                  </span>
                )}
                
                {isExpired && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    EXPIRED
                  </span>
                )}
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Compensation</p>
                  <p className="text-gray-600">{formatSalary()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {job.remote_ok ? (
                  <>
                    <Wifi className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Work Type</p>
                      <p className="text-gray-600">Remote OK</p>
                    </div>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{job.location || 'On-site'}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Application Deadline</p>
                  <p className="text-gray-600">{new Date(job.open_until).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Applicants</p>
                  <p className="text-gray-600">{applications.length} applied</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Apply Button */}
            {user && !isOwner && !isExpired && (
              <div className="flex items-center space-x-4">
                {hasApplied ? (
                  <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Application Submitted</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyDrawer(true)}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Apply for this Position
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/jobs/my')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View My Applications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Job Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Employer Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
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
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.company}</h4>
                        <p className="text-gray-600">Research Organization</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
                      <p><strong>Application Deadline:</strong> {new Date(job.open_until).toLocaleDateString()}</p>
                      <p><strong>Current Applicants:</strong> {applications.length}</p>
                      {job.paid && (
                        <p><strong>Compensation:</strong> {formatSalary()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <EmployerRating jobId={job.id} />
            )}
          </div>
        </div>
      </div>

      {/* Apply Drawer */}
      <JobApplyDrawer
        job={job}
        isOpen={showApplyDrawer}
        onClose={() => setShowApplyDrawer(false)}
      />
    </div>
  );
};