import type { Course, CourseCreateRequest, CourseUpdateRequest } from '../types';

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

export const courseService = {
  /**
   * Fetch all courses
   */
  async getCourses(): Promise<Course[]> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return res.json();
  },

  /**
   * Get a single course by ID
   */
  async getCourse(id: string): Promise<Course> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch course');
    }
    
    return res.json();
  },

  /**
   * Create a new course
   */
  async createCourse(course: CourseCreateRequest): Promise<Course> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(course),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create course');
    }
    
    return res.json();
  },

  /**
   * Update an existing course
   */
  async updateCourse(id: string, course: CourseUpdateRequest): Promise<Course> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(course),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update course');
    }
    
    return res.json();
  },

  /**
   * Delete a course
   */
//   async detoken = getToken();
//     const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
    
//     if (!res.ok) {
//       throw new Error('Failed to delete course'
//       throw new Error(`Failed to delete course: ${res.statusText}`);
//     }
//   },
};
