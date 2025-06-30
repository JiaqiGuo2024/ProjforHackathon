import React from 'react';
import { Clock, Eye, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

interface JobStatusBadgeProps {
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  className?: string;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'applied':
        return {
          icon: Clock,
          label: 'Applied',
          className: 'bg-blue-100 text-blue-800'
        };
      case 'screening':
        return {
          icon: Eye,
          label: 'Under Review',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'interview':
        return {
          icon: MessageCircle,
          label: 'Interview',
          className: 'bg-purple-100 text-purple-800'
        };
      case 'offer':
        return {
          icon: CheckCircle,
          label: 'Offer',
          className: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          icon: XCircle,
          label: 'Rejected',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: Clock,
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.className} ${className}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
};