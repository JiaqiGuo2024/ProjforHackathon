import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';
import { Job } from '../types/jobs';
import { nanoid } from 'nanoid';

interface JobForm {
  title: string;
  description: string;
  company: string;
  paid: boolean;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  remote_ok: boolean;
  location?: string;
  open_until: string;
}

const tagOptions = [
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'research', label: 'Research' },
  { value: 'phd', label: 'PhD' },
  { value: 'postdoc', label: 'Postdoc' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'biology', label: 'Biology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'engineering', label: 'Engineering' }
];

export const JobPost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { addJob, saveToStorage } = useJobStore();
  
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<JobForm>({
    defaultValues: {
      currency: 'USD',
      paid: false,
      remote_ok: false
    }
  });

  const watchPaid = watch('paid');
  const watchRemote = watch('remote_ok');

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to post jobs</h1>
        </div>
      </div>
    );
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: JobForm) => {
    const job: Job = {
      id: nanoid(),
      title: data.title,
      description: data.description,
      company: data.company,
      company_logo: logoPreview,
      tags: selectedTags.map(tag => tag.value),
      paid: data.paid,
      salary_min: data.paid ? data.salary_min : undefined,
      salary_max: data.paid ? data.salary_max : undefined,
      currency: data.paid ? data.currency : undefined,
      remote_ok: data.remote_ok,
      location: data.remote_ok ? undefined : data.location,
      poster_id: user.id,
      open_until: data.open_until,
      created_at: new Date().toISOString()
    };

    addJob(job);
    saveToStorage();
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
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
            <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
            <p className="text-gray-600 mt-1">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(stepNumber => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNumber < step ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Compensation</span>
            <span>Review & Publish</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    {...register('title', { required: 'Job title is required' })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Research Assistant in Machine Learning"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization *
                  </label>
                  <input
                    {...register('company', { required: 'Company name is required' })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g. Stanford University"
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Company logo"
                            className="w-16 h-16 object-cover rounded-lg mx-auto"
                          />
                        ) : (
                          <div>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">Upload logo</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyLogo(null);
                          setLogoPreview('');
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Job description is required' })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={6}
                    placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Areas & Skills
                  </label>
                  <Select
                    isMulti
                    options={tagOptions}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Select relevant tags..."
                    className="text-sm"
                    classNamePrefix="react-select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    {...register('open_until', { required: 'Application deadline is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.open_until && (
                    <p className="text-red-500 text-sm mt-1">{errors.open_until.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Compensation & Location</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Position Type *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('paid')}
                        value="false"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3">
                        <span className="font-medium">Unpaid/Volunteer</span>
                        <p className="text-sm text-gray-500">Research experience, academic credit, or volunteer opportunity</p>
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('paid')}
                        value="true"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3">
                        <span className="font-medium">Paid Position</span>
                        <p className="text-sm text-gray-500">Salary, stipend, or hourly compensation</p>
                      </span>
                    </label>
                  </div>
                </div>

                {watchPaid && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        {...register('currency')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Salary (Annual)
                        </label>
                        <input
                          type="number"
                          {...register('salary_min')}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Salary (Annual)
                        </label>
                        <input
                          type="number"
                          {...register('salary_max')}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="80000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Work Location *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('remote_ok')}
                        value="true"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3">
                        <span className="font-medium">Remote OK</span>
                        <p className="text-sm text-gray-500">Can be done remotely or hybrid</p>
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('remote_ok')}
                        value="false"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3">
                        <span className="font-medium">On-site</span>
                        <p className="text-sm text-gray-500">Must be performed at specific location</p>
                      </span>
                    </label>
                  </div>
                </div>

                {!watchRemote && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      {...register('location', { 
                        required: !watchRemote ? 'Location is required for on-site positions' : false 
                      })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g. Stanford, CA or New York, NY"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Publish</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Job Preview</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <span className="ml-2 text-gray-900">{watch('title')}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Company:</span>
                      <span className="ml-2 text-gray-900">{watch('company')}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-900">
                        {watchPaid ? 'Paid Position' : 'Unpaid/Volunteer'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-900">
                        {watchRemote ? 'Remote OK' : watch('location')}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Deadline:</span>
                      <span className="ml-2 text-gray-900">
                        {watch('open_until') ? new Date(watch('open_until')).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTags.map(tag => (
                            <span
                              key={tag.value}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Ready to publish?</h4>
                  <p className="text-blue-800 text-sm">
                    Your job posting will be visible to all researchers on the platform. 
                    You'll receive notifications when candidates apply.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Publish Job
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};