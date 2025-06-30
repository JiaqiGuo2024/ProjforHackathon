export interface Job {
  id: string;
  title: string;
  description: string;
  tags: string[];
  paid: boolean;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  remote_ok: boolean;
  location?: string;
  poster_id: string;
  company: string;
  company_logo?: string;
  open_until: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cv_url?: string;
  cover_letter: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  created_at: string;
}

export interface EmployerReview {
  id: string;
  job_id: string;
  reviewer: string;
  score: number;
  comment: string;
  anonymous: boolean;
  created_at: string;
}

export interface JobFilters {
  paid?: boolean;
  remote?: boolean;
  tags: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
}