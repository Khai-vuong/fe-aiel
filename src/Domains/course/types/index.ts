export type Course = {
  cid: string;
  code: string;
  name: string;
  description?: string;
  credits?: number;
  lecturer_id?: string;
  created_at?: string;
  updated_at?: string;
  lecturer?: any;
  _count?: {
    enrollments?: number;
    classes?: number;
  };
};

export type CourseCreateRequest = {
  name: string;
  code: string;
  description?: string;
  credits?: number;
  lecturer_id?: string;
};

export type CourseUpdateRequest = Partial<CourseCreateRequest>;
