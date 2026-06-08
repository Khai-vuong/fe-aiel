import type {
  Class,
//   ClassCreateDto,
  ClassUpdateDto,
  AddResourceDto,
  CreateFromEnrollmentsDto,
  ProcessEnrollmentsResponseDto,
  ClassFileDownloadResponse,
} from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

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
  const res = await fetch(`${BASE_URL}/classes`, {
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
  const res = await fetch(`${BASE_URL}/classes/me`, {
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
  const res = await fetch(`${BASE_URL}/classes/${classId}`, {
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
  const res = await fetch(`${BASE_URL}/classes/${classId}`, {
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
  const res = await fetch(`${BASE_URL}/classes/${classId}`, {
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
  data: CreateFromEnrollmentsDto
): Promise<ProcessEnrollmentsResponseDto> => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/classes/process-enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create classes from enrollments');
  }

  return res.json();
};

/**
 * Process pending enrollments -> create classes
 * Docs: POST /classes/process-enrollments
 */
export const processEnrollments = async (
  data: CreateFromEnrollmentsDto
): Promise<ProcessEnrollmentsResponseDto> => {
  return createClassesFromEnrollments(data);
};

/**
 * Upload file to class
 * Docs: POST /classes/upload/:clid
 */
export const uploadClassFile = async (
  clid: string,
  file: File
  ,
  options?: {
    fileType?: string;
    isPublic?: boolean;
  }
): Promise<unknown> => {
  const token = getToken();

  const formData = new FormData();
  formData.append('file', file);
  if (options?.fileType) {
    formData.append('file_type', options.fileType);
  }
  if (typeof options?.isPublic === 'boolean') {
    formData.append('is_public', String(options.isPublic));
  }

  const res = await fetch(`${BASE_URL}/classes/upload/${clid}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload class file');
  }

  return res.json();
};

export type DownloadClassFileResult = ClassFileDownloadResponse | Blob;

/**
 * Download file from class
 * Docs: GET /classes/download/:clid/:fid
 * - Local mode: returns binary
 * - Production mode: returns JSON with signed downloadUrl
 */
export const downloadClassFile = async (
  clid: string,
  fid: string
): Promise<DownloadClassFileResult> => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/classes/download/${clid}/${fid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to download class file');
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  return res.blob();
};

/**
 * Soft delete file from a class
 * Docs: DELETE /classes/file/:fid
 */
export const deleteClassFile = async (fid: string): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/classes/file/${fid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete class file');
  }
};

/**
 * Add resource to class
 */
export const addResourceToClass = async (
  classId: string,
  data: AddResourceDto
): Promise<any> => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/classes/addResource/${classId}`, {
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
