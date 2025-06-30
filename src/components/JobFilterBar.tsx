import React from 'react';
import Select from 'react-select';
import { Search, Filter, DollarSign, MapPin, Wifi } from 'lucide-react';
import { JobFilters } from '../types/jobs';

interface JobFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
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

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange
}) => {
  const selectedTags = tagOptions.filter(option => 
    filters.tags.includes(option.value)
  );

  const handleTagsChange = (selectedOptions: any) => {
    const tags = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    onFiltersChange({ ...filters, tags });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.paid === undefined}
                  onChange={() => onFiltersChange({ ...filters, paid: undefined })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.paid === true}
                  onChange={() => onFiltersChange({ ...filters, paid: true })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Paid
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.paid === false}
                  onChange={() => onFiltersChange({ ...filters, paid: false })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Unpaid/Volunteer</span>
              </label>
            </div>
          </div>

          {/* Remote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="remote"
                  checked={filters.remote === undefined}
                  onChange={() => onFiltersChange({ ...filters, remote: undefined })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="remote"
                  checked={filters.remote === true}
                  onChange={() => onFiltersChange({ ...filters, remote: true })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Wifi className="h-3 w-3 mr-1" />
                  Remote
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="remote"
                  checked={filters.remote === false}
                  onChange={() => onFiltersChange({ ...filters, remote: false })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  On-site
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Areas & Skills
            </label>
            <Select
              isMulti
              options={tagOptions}
              value={selectedTags}
              onChange={handleTagsChange}
              placeholder="Select tags..."
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Salary Range */}
        {filters.paid === true && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Salary
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={filters.salaryMin || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  salaryMin: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Salary
              </label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={filters.salaryMax || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  salaryMax: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};