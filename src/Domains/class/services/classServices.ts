import type {
  Class,
//   ClassCreateDto,
  ClassUpdateDto,
  ResponseCreateClassDto,
  AddResourceDto,
  CreateFromEnrollmentsDto,
} from '../types';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Get token from localStorage
 */
const getToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }
  return token;
};

/**
 * Get all classes
 */
export const getAllClasses = async (): Promise<Class[]> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch classes');
  }

  return res.json();
};

/**
 * Get my classes (classes associated with current user)
 */
export const getMyClasses = async (): Promise<Class[]> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch my classes');
  }

  return res.json();
};

/**
 * Get class by ID
 */
export const getClassById = async (
  classId: string
): Promise<Class> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch class');
  }

  return res.json();
};

/**
 * Update class
 */
export const updateClass = async (
  classId: string,
  data: ClassUpdateDto
): Promise<Class> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update class');
  }

  return res.json();
};

/**
 * Delete class
 */
export const deleteClass = async (
  classId: string
): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete class');
  }
};

/**
 * Create classes from pending enrollments
 */
export const createClassesFromEnrollments = async (
  data?: CreateFromEnrollmentsDto
): Promise<ResponseCreateClassDto[]> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/createFromEnrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error('Failed to create classes from enrollments');
  }

  return res.json();
};

/**
 * Add resource to class
 */
export const addResourceToClass = async (
  classId: string,
  data: AddResourceDto
): Promise<any> => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/classes/addResource/${classId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to add resource to class');
  }

  return res.json();
};
