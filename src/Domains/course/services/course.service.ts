import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
} from '../types';

// Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

/**
 * ===== COURSE SERVICE (NEW - AXIOS-BASED) =====
 * 
 * This is the new CourseService using Axios for HTTP requests.
 * It provides a class-based approach with better error handling and consistency.
 * 
 * USAGE:
 * ```typescript
 * import { courseServiceInstance, CourseService } from '../services';
 * 
 * // Use singleton instance (recommended)
 * const courses = await courseServiceInstance.getAllCourses();
 * 
 * // Or create custom instance
 * const customService = new CourseService('http://custom-api.com');
 * ```
 * 
 * NOTE: The old courseService (fetch-based) in courseService.ts is still available
 * for backward compatibility.
 */

/**
 * Enrollment with Student Info
 */
export interface EnrollmentWithStudent {
  ceid: string;
  enrolled_at: string;
  status: string;
  student: {
    sid: string;
    name: string;
    major?: string;
  };
}

/**
 * Enrollment with Course Info
 */
export interface EnrollmentWithCourse {
  ceid: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  course: {
    cid: string;
    code: string;
    name: string;
    credits: number;
  };
}

/**
 * Register/Unregister Response
 */
export interface EnrollmentResponse {
  enrollment: {
    ceid: string;
    student_id: string;
    course_id: string;
    enrolled_at?: string;
    status: string;
    student: {
      sid: string;
      name: string;
      major?: string;
    };
    course: {
      cid: string;
      code: string;
      name: string;
    };
  };
  message: string;
}

/**
 * Delete Course Response
 */
export interface DeleteCourseResponse {
  message: string;
}

/**
 * Course Service Class
 * Handles all course-related API calls
 */
export class CourseService {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Create axios instance with auth token
   */
  private createAxiosInstance(): AxiosInstance {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: `${this.baseURL}/courses`,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Lấy danh sách tất cả khóa học
   * @returns Array of courses
   */
  public async getAllCourses(): Promise<Course[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/');
    return response.data;
  }

  /**
   * Lấy thông tin chi tiết khóa học theo ID
   * @param courseId - Course ID
   * @returns Course information with enrollments and classes
   */
  public async getCourseById(courseId: string): Promise<Course> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/${courseId}`);
    return response.data;
  }

  /**
   * Tạo khóa học mới
   * @param data - Course creation data
   * @returns Created course
   */
  public async createCourse(data: CourseCreateRequest): Promise<Course> {
    const api = this.createAxiosInstance();
    const response = await api.post('/', data);
    return response.data;
  }

  /**
   * Cập nhật thông tin khóa học
   * @param courseId - Course ID
   * @param data - Updated course data
   * @returns Updated course
   */
  public async updateCourse(
    courseId: string,
    data: CourseUpdateRequest
  ): Promise<Course> {
    const api = this.createAxiosInstance();
    const response = await api.put(`/${courseId}`, data);
    return response.data;
  }

  /**
   * Xóa khóa học (không thể xóa nếu có enrollment)
   * @param courseId - Course ID
   * @returns Delete confirmation message
   */
  public async deleteCourse(courseId: string): Promise<DeleteCourseResponse> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/${courseId}`);
    return response.data;
  }

  /**
   * Lấy danh sách khóa học của giảng viên
   * @param lecturerId - Lecturer ID
   * @returns Array of courses
   */
  public async getCoursesByLecturer(lecturerId: string): Promise<Course[]> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/lecturer/${lecturerId}`);
    return response.data;
  }

  /**
   * Lấy danh sách sinh viên đã đăng ký khóa học
   * @param courseId - Course ID
   * @returns Array of enrollments with student info
   */
  public async getStudentsByCourse(
    courseId: string
  ): Promise<EnrollmentWithStudent[]> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/${courseId}/students`);
    return response.data;
  }

  /**
   * Đăng ký khóa học (Student only)
   * @param courseId - Course ID
   * @returns Enrollment response
   */
  public async registerCourse(
    courseId: string
  ): Promise<EnrollmentResponse> {
    const api = this.createAxiosInstance();
    const response = await api.post(`/${courseId}/register`);
    return response.data;
  }

  /**
   * Hủy đăng ký khóa học (Student only, soft delete)
   * @param courseId - Course ID
   * @returns Enrollment response
   */
  public async unregisterCourse(
    courseId: string
  ): Promise<EnrollmentResponse> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/${courseId}/unregister`);
    return response.data;
  }

  /**
   * Thêm giảng viên vào khóa học
   * @param courseId - Course ID
   * @param lecturerId - Lecturer ID
   * @returns Updated course with lecturers
   */
  public async addLecturerToCourse(
    courseId: string,
    lecturerId: string
  ): Promise<Course> {
    const api = this.createAxiosInstance();
    const response = await api.post(`/${courseId}/lecturers/${lecturerId}`);
    return response.data;
  }

  /**
   * Xóa giảng viên khỏi khóa học
   * @param courseId - Course ID
   * @param lecturerId - Lecturer ID
   * @returns Updated course with lecturers
   */
  public async removeLecturerFromCourse(
    courseId: string,
    lecturerId: string
  ): Promise<Course> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/${courseId}/lecturers/${lecturerId}`);
    return response.data;
  }

  /**
   * Lấy danh sách enrollment của sinh viên hiện tại
   * @returns Array of enrollments with course info
   */
  public async getMyEnrollments(): Promise<EnrollmentWithCourse[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/my/enrollments');
    return response.data;
  }

  /**
   * Lấy danh sách khóa học của giảng viên hoặc sinh viên hiện tại
   * @returns Array of courses
   */
  public async getMyCourses(): Promise<Course[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/my/courses');
    return response.data;
  }
}

// Export singleton instance
const courseServiceInstance = new CourseService();
export default courseServiceInstance;
