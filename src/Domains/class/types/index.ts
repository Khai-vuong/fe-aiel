export interface Class {
  clid: string;
  cid: string;
  start_date?: string;
  end_date?: string;
  class_name: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  course? : any;
  lecturer? : any;
  schedule_json? : any;
  location? : string
  created_at?: string;
  updated_at?: string;
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
