export interface Class {
  clid: string;
  cid: string;
  start_date?: string;
  end_date?: string;
  class_name: string;
  name?: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  course?: any;
  lecturer?: any;
  schedule_json?: any;
  location?: string;
  course_id?: string;
  lecturer_id?: string;
  students?: Student[];
  files?: ClassFile[];
  quizzes?: Quiz[];
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  sid: string;
  name: string;
  major: string;
  personal_info_json?: {
    address?: string;
    phone?: string;
    dob?: string;
    year?: string;
    [key: string]: any;
  };
}

export interface ClassFile {
  fid: string;
  filename: string;
  url: string;
  file_type: string;
  is_public: boolean;
  created_at?: string;
}

export interface Quiz {
  qid: string;
  name: string;
  description?: string;
  status: string;
  available_from?: string;
  available_until?: string;
}

export interface ClassCreateDto {
  cid: string;
  start_date?: string;
  end_date?: string;
  class_name: string;
  status?: 'Active' | 'Completed' | 'Cancelled';
}

export interface ResponseCreateClassDto {
  clid: string;
  cid: string;
  start_date?: string;
  end_date?: string;
  class_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClassUpdateDto {
  start_date?: string;
  end_date?: string;
  class_name?: string;
  status?: 'Active' | 'Completed' | 'Cancelled';
}

export interface AddResourceDto {
  resource_type?: string;
  resource_url?: string;
  resource_name?: string;
  [key: string]: any;
}

export interface ClassWithDetails extends Class {
  course_name?: string;
  instructor_name?: string;
  enrollment_count?: number;
}

export interface CreateFromEnrollmentsDto {
  courseId: string;
  className: string;
  startDate?: string;
  endDate?: string;
}
