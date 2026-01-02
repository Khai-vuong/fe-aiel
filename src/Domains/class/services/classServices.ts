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
 * Get all classes
 */
export const getAllClasses = async (token: string): Promise<Class[]> => {
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
export const getMyClasses = async (token: string): Promise<Class[]> => {
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
  classId: string,
  token: string
): Promise<Class> => {
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
  token: string,
  data: ClassUpdateDto
): Promise<Class> => {
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
  classId: string,
  token: string
): Promise<void> => {
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
  token: string,
  data?: CreateFromEnrollmentsDto
): Promise<ResponseCreateClassDto[]> => {
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
  token: string,
  data: AddResourceDto
): Promise<any> => {
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
