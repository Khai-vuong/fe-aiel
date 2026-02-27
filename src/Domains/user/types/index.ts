export interface PersonalInfo {
  address?: string;
  phone?: string;
  dob?: string;
  [key: string]: any;
}

export interface RegisterRequestData {
  username: string;
  email: string;
  hashed_password: string;
  role: 'Student' | 'Lecturer' | 'Admin';
  name: string;
  personal_info_json?: string;
  major?: string;
}

export interface StudentInfo {
  sid: string;
  name: string;
  major: string;
  personal_info_json: PersonalInfo;
}

export interface RegisterResponse {
  uid: string;
  username: string;
  status: string;
  role: string;
  Student?: StudentInfo;
}

export interface UpdateProfileData {
  status?: string;
  major?: string;
  personal_info_json?: string;
}

// Additional types for users.service.ts

export interface LoginDto {
  username: string;
  hashed_password: string;
}

export interface LoginResponse {
  userToken: string;
  role: string;
  roleId: string;
}

export interface RegisterDto {
  username: string;
  hashed_password: string;
  email: string;
  role: 'Student' | 'Lecturer' | 'Admin';
  name: string;
  major?: string;
  personal_info_json: string; // Must be JSON string, not object
}

export interface LecturerInfo {
  lid: string;
  name: string;
  personal_info_json?: string | PersonalInfo;
}

export interface AdminInfo {
  aid: string;
  name: string;
  personal_info?: string | PersonalInfo;
}

export type UserStatus = 'Active' | 'Logged_out' | 'Expelled' | 'Graduated' | 'Deleted';

export interface User {
  uid: string;
  username: string;
  status: UserStatus;
  role: 'Student' | 'Lecturer' | 'Admin';
  created_at?: string;
  updated_at?: string;
  Student?: StudentInfo;
  Lecturer?: LecturerInfo;
  Admin?: AdminInfo;
}

export interface UpdateUserDto {
  hashed_password?: string;
  status?: UserStatus;
  major?: string;
  personal_info_json?: string; // Must be JSON string, not object
}
