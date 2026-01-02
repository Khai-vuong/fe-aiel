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
