import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Base URL
const BASE_URL = 'http://localhost:3000';

// ===== Types =====

export interface ConversationSummary {
  conversationId: string;
  title: string | null;
  status: 'active' | 'archived';
  lastMessageAt: string | null;
  messageCount: number;
  preview: string | null;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: ConversationSummary[];
  total: number;
  hasMore: boolean;
}

export interface GetConversationsQuery {
  limit?: number;
  offset?: number;
  status?: 'active' | 'archived';
}

export interface ConversationDetail {
  conversationId: string;
  title: string | null;
  status: 'active' | 'archived';
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  contentJson: any | null;
  parentMessageId: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  modelName: string | null;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationDetailResponse {
  conversation: ConversationDetail;
  messages: Message[];
  totalMessages: number;
  hasMore: boolean;
}

export interface GetConversationDetailQuery {
  limit?: number;
  beforeMessageId?: string;
}

export interface UpdateConversationDto {
  title?: string;
  status?: 'active' | 'archived';
}

export interface UpdateConversationResponse {
  acid: string;
  title: string | null;
  status: 'active' | 'archived';
  user_id: string;
  last_message_at: string | null;
  metadata_json: any | null;
  created_at: string;
  updated_at: string;
}

export interface DeleteConversationResponse {
  message: string;
}

export interface DirectChatRequest {
  text: string;
  conversationId?: string;
}

export interface DirectChatResponse {
  success: boolean;
  conversationId: string;
  messageId: string;
  role: string;
  text: string;
  metadata: {
    createdAt: string;
    serviceType: string;
    provider: string;
    processingTime: number;
  };
}

// ===== Service =====

/**
 * AI Conversation Service Class
 * Handles all AI conversation-related API calls
 */
export class AiConversationService {
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
      baseURL: `${this.baseURL}/ai`,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Lấy danh sách tất cả conversations của user hiện tại
   * @param query - Query parameters (limit, offset, status)
   * @returns List của conversations kèm pagination info
   */
  public async getConversations(
    query?: GetConversationsQuery,
  ): Promise<GetConversationsResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get('/conversations', { params: query });
    return response.data;
  }

  /**
   * Lấy chi tiết một conversation cùng với tất cả messages
   * @param conversationId - Conversation ID
   * @param query - Query parameters (limit, beforeMessageId)
   * @returns Chi tiết conversation và danh sách messages
   */
  public async getConversationById(
    conversationId: string,
    query?: GetConversationDetailQuery,
  ): Promise<GetConversationDetailResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get(`/conversations/${conversationId}`, {
      params: query,
    });
    return response.data;
  }

  /**
   * Cập nhật thông tin conversation (title hoặc status)
   * @param conversationId - Conversation ID
   * @param data - Dữ liệu cần cập nhật (title và/hoặc status)
   * @returns Conversation đã được cập nhật
   */
  public async updateConversation(
    conversationId: string,
    data: UpdateConversationDto,
  ): Promise<UpdateConversationResponse> {
    const api = this.createAxiosInstance();
    const response = await api.put(`/conversations/${conversationId}`, data);
    return response.data;
  }

  /**
   * Archive một conversation (ẩn khỏi danh sách chính)
   * @param conversationId - Conversation ID
   * @returns Conversation đã được archive
   */
  public async archiveConversation(
    conversationId: string,
  ): Promise<UpdateConversationResponse> {
    return this.updateConversation(conversationId, { status: 'archived' });
  }

  /**
   * Khôi phục conversation đã archive về trạng thái active
   * @param conversationId - Conversation ID
   * @returns Conversation đã được active lại
   */
  public async restoreConversation(
    conversationId: string,
  ): Promise<UpdateConversationResponse> {
    return this.updateConversation(conversationId, { status: 'active' });
  }

  /**
   * Đổi tên conversation
   * @param conversationId - Conversation ID
   * @param title - Tên mới
   * @returns Conversation đã được cập nhật tên
   */
  public async renameConversation(
    conversationId: string,
    title: string,
  ): Promise<UpdateConversationResponse> {
    return this.updateConversation(conversationId, { title });
  }

  /**
   * Xóa vĩnh viễn một conversation (hard delete)
   * Lưu ý: Thao tác này không thể hoàn tác, nên dùng archiveConversation thay thế
   * @param conversationId - Conversation ID
   * @returns Thông báo xóa thành công
   */
  public async deleteConversation(
    conversationId: string,
  ): Promise<DeleteConversationResponse> {
    const api = this.createAxiosInstance();
    const response = await api.delete(`/conversations/${conversationId}`);
    return response.data;
  }

  /**
   * Gửi message trực tiếp và nhận phản hồi từ AI
   * @param data - Request data (text và conversationId tùy chọn)
   * @returns Phản hồi từ AI kèm thông tin conversation và message
   */
  public async sendDirectChat(
    data: DirectChatRequest,
  ): Promise<DirectChatResponse> {
    const api = this.createAxiosInstance();
    const response = await api.post('/chat/direct', data);
    return response.data;
  }
}

// Export singleton instance
const aiConversationService = new AiConversationService();
export default aiConversationService;