import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, FileText } from 'lucide-react';
import { Job, JobApplication } from '../types/jobs';
import { useJobStore } from '../store/jobStore';
import { useUserStore } from '../store/userStore';
import { nanoid } from 'nanoid';

interface JobApplyDrawerProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationForm {
  coverLetter: string;
  cvFile?: FileList;
}

export const JobApplyDrawer: React.FC<JobApplyDrawerProps> = ({
  job,
  isOpen,
  onClose
}) => {
  const { user } = useUserStore();
  const { addApplication, saveToStorage } = useJobStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplicationForm>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // In a real app, upload CV to storage service
      const cvUrl = cvFile ? URL.createObjectURL(cvFile) : undefined;

      const application: JobApplication = {
        id: nanoid(),
        job_id: job.id,
        applicant_id: user.id,
        cv_url: cvUrl,
        cover_letter: data.coverLetter,
        status: 'applied',
        created_at: new Date().toISOString()
      };

      addApplication(application);
      saveToStorage();

      // Reset form and close drawer
      reset();
      setCvFile(null);
      onClose();

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply for Position</h2>
            <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV/Resume (PDF) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                {cvFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{cvFile.name}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 font-medium">Upload your CV/Resume</p>
                    <p className="text-sm text-gray-500 mt-1">PDF format only, max 10MB</p>
                  </div>
                )}
              </label>
            </div>
            {!cvFile && (
              <p className="text-red-500 text-sm mt-1">CV/Resume is required</p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              {...register('coverLetter', { 
                required: 'Cover letter is required',
                minLength: { value: 100, message: 'Cover letter must be at least 100 characters' }
              })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={8}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
            />
            {errors.coverLetter && (
              <p className="text-red-500 text-sm mt-1">{errors.coverLetter.message}</p>
            )}
          </div>

          {/* Job Details Reminder */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Position Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Type:</strong> {job.paid ? 'Paid Position' : 'Unpaid/Volunteer'}</p>
              {job.paid && job.salary_min && (
                <p><strong>Salary:</strong> {job.currency || '$'}{job.salary_min.toLocaleString()}{job.salary_max ? ` - ${job.currency || '$'}${job.salary_max.toLocaleString()}` : '+'}</p>
              )}
              <p><strong>Location:</strong> {job.remote_ok ? 'Remote OK' : job.location || 'On-site'}</p>
              <p><strong>Application Deadline:</strong> {new Date(job.open_until).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !cvFile}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};