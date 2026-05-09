import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

/**
 * Log Interface
 */
export interface Log {
  logid?: string;
  lid?: string;
  id?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  entity_type?: string;
  entity_id?: string;
  user_id: string;
  userId?: string;
  details?: string;
  created_at: string;
  createdAt?: string;
  user?: {
    uid: string;
    username?: string;
    name?: string;
    role: string;
  };
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Log Response with Pagination
 */
export interface LogResponse {
  data: Log[];
  pagination: PaginationInfo;
}

/**
 * Query Parameters for GET /logs/class/:clid
 */
export interface GetClassLogsParams {
  page?: number;
  limit?: number;
  action?: string;
}

/**
 * Query Parameters for GET /logs (Admin)
 */
export interface GetAllLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
  userId?: string;
}

/**
 * Logs Service Class
 * Handles all log-related API calls
 */
export class LogsService {
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
      baseURL: `${this.baseURL}/logs`,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Lấy nhật ký hoạt động của một lớp học
   * @param clid - Class ID
   * @param params - Query parameters (page, limit, action)
   * @returns Log response with pagination
   */
  public async getClassLogs(
    clid: string,
    params?: GetClassLogsParams
  ): Promise<LogResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/class/${clid}`, { params });
    
    // Xử lý response để đảm bảo cấu trúc đúng
    if (Array.isArray(response.data)) {
      // Nếu API trả về array trực tiếp
      return {
        data: response.data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.data.length,
          totalPages: 1,
        },
      };
    }
    
    // Nếu API trả về object với data và pagination
    return response.data;
  }

  /**
   * Lấy tất cả nhật ký hệ thống (Admin only)
   * @param params - Query parameters (page, limit, action, resourceType, userId)
   * @returns Log response with pagination
   */
  public async getAllLogs(params?: GetAllLogsParams): Promise<LogResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get('/admin/all', { params });
    
    // Xử lý response để đảm bảo cấu trúc đúng
    if (Array.isArray(response.data)) {
      // Nếu API trả về array trực tiếp
      return {
        data: response.data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.data.length,
          totalPages: 1,
        },
      };
    }
    
    // Nếu API trả về object với data và pagination
    return response.data;
  }
}

// Export singleton instance
const logsService = new LogsService();
export default logsService;
