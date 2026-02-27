import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
  UpdateUserDto,
} from '../types';

// Base URL
const BASE_URL = 'http://localhost:3000';

/**
 * Users Service Class
 * Handles all user-related API calls
 */
export class UsersService {
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
      baseURL: `${this.baseURL}/users`,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create axios instance without auth token (for public routes)
   */
  private createPublicAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: `${this.baseURL}/users`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Xác thực người dùng và nhận JWT token
   * @param data - Login credentials
   * @returns Login response with token and role
   */
  public async login(data: LoginDto): Promise<LoginResponse> {
    const api = this.createPublicAxiosInstance();
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  /**
   * Đăng ký tài khoản mới
   * @param data - Registration data
   * @returns Created user information
   */
  public async register(data: RegisterDto): Promise<User> {
    const api = this.createPublicAxiosInstance();
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  /**
   * Lấy danh sách tất cả người dùng (Admin only)
   * @returns Array of users
   */
  public async getAllUsers(): Promise<User[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/');
    return response.data;
  }

  /**
   * Lấy thông tin cá nhân của người dùng hiện tại
   * @returns Current user profile
   */
  public async getMyProfile(): Promise<User> {
    const api = this.createAxiosInstance();
    const response = await api.get('/profile');
    return response.data;
  }

  /**
   * Lấy thông tin người dùng theo ID
   * @param userId - User ID
   * @returns User information
   */
  public async getUserById(userId: string): Promise<User> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/${userId}`);
    return response.data;
  }

  /**
   * Cập nhật thông tin người dùng
   * @param userId - User ID
   * @param data - Updated user data
   * @returns Updated user information
   */
  public async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    const api = this.createAxiosInstance();
    const response = await api.put(`/update/${userId}`, data);
    return response.data;
  }

  /**
   * Xóa người dùng (soft delete - chuyển status thành Deleted) - Admin only
   * @param userId - User ID
   * @returns Updated user with Deleted status
   */
  public async deleteUser(userId: string): Promise<User> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/delete/${userId}`);
    return response.data;
  }
}

// Export singleton instance
const usersService = new UsersService();
export default usersService;
