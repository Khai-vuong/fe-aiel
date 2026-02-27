import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  Notification,
  CreateNotificationDto,
  CreateBulkNotificationDto,
  CreateClassNotificationDto,
  UpdateNotificationDto,
  NotificationQueryParams,
} from '../types';

// Base URL
const BASE_URL = 'http://localhost:3000';

/**
 * Notification Service Class
 * Handles all notification-related API calls
 */
export class NotiService {
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
      baseURL: `${this.baseURL}/notifications`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Lấy tất cả thông báo (Admin only)
   * @param params - Query parameters for filtering
   * @returns Array of notifications
   */
  public async getAllNotifications(
    params?: NotificationQueryParams
  ): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/', { params });
    return response.data;
  }

  /**
   * Lấy số lượng thông báo chưa đọc của user hiện tại
   * @returns Count object { count: number }
   */
  public async getUnreadNotificationsCount(): Promise<{ count: number }> {
    const api = this.createAxiosInstance();
    const response = await api.get('/unread/count');
    return response.data;
  }

  /**
   * Lấy tất cả thông báo chưa đọc của user hiện tại
   * @returns Array of unread notifications
   */
  public async getUnreadNotifications(): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/unread');
    return response.data;
  }

  /**
   * Lấy tất cả thông báo của user hiện tại
   * @param params - Query parameters for filtering
   * @returns Array of notifications
   */
  public async getMyNotifications(
    params?: NotificationQueryParams
  ): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.get('/me', { params });
    return response.data;
  }

  /**
   * Lấy tất cả thông báo của một user cụ thể (Admin only)
   * @param userId - ID of the user
   * @param params - Query parameters for filtering
   * @returns Array of notifications
   */
  public async getUserNotifications(
    userId: string,
    params?: NotificationQueryParams
  ): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/user/${userId}`, { params });
    return response.data;
  }

  /**
   * Lấy chi tiết một thông báo theo ID
   * @param nid - Notification ID
   * @returns Notification details
   */
  public async getNotificationById(nid: string): Promise<Notification> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/${nid}`);
    return response.data;
  }

  /**
   * Đánh dấu một thông báo là đã đọc
   * @param nid - Notification ID
   * @returns Updated notification
   */
  public async markNotificationAsRead(nid: string): Promise<Notification> {
    const api = this.createAxiosInstance();
    const response = await api.put(`/${nid}/mark-as-read`, {});
    return response.data;
  }

  /**
   * Đánh dấu tất cả thông báo của user hiện tại là đã đọc
   * @returns Count object { count: number }
   */
  public async markAllNotificationsAsRead(): Promise<{ count: number }> {
    const api = this.createAxiosInstance();
    const response = await api.put('/mark-as-read/all');
    return response.data;
  }

  /**
   * Tạo một thông báo mới (Lecturer, Admin)
   * @param data - Notification data
   * @returns Created notification
   */
  public async createNotification(
    data: CreateNotificationDto
  ): Promise<Notification> {
    const api = this.createAxiosInstance();
    const response = await api.post('/', data);
    return response.data;
  }

  /**
   * Tạo thông báo cho nhiều user cùng một lúc (Lecturer, Admin)
   * @param data - Bulk notification data
   * @returns Array of created notifications
   */
  public async createBulkNotifications(
    data: CreateBulkNotificationDto
  ): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.post('/bulk', data);
    return response.data;
  }

  /**
   * Tạo thông báo cho tất cả học sinh trong một lớp học (Lecturer, Admin)
   * @param clid - Class ID
   * @param data - Class notification data
   * @returns Array of created notifications
   */
  public async createClassNotifications(
    clid: string,
    data: CreateClassNotificationDto
  ): Promise<Notification[]> {
    const api = this.createAxiosInstance();
    const response = await api.post(`/bulk/class/${clid}`, data);
    return response.data;
  }

  /**
   * Cập nhật một thông báo (Lecturer, Admin)
   * @param nid - Notification ID
   * @param data - Updated notification data
   * @returns Updated notification
   */
  public async updateNotification(
    nid: string,
    data: UpdateNotificationDto
  ): Promise<Notification> {
    const api = this.createAxiosInstance();
    const response = await api.put(`/${nid}`, data);
    return response.data;
  }

  /**
   * Xóa một thông báo
   * @param nid - Notification ID
   * @returns Success message
   */
  public async deleteNotification(
    nid: string
  ): Promise<{ message: string }> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/${nid}`);
    return response.data;
  }
}

// Export singleton instance
const notificationService = new NotiService();
export default notificationService;
