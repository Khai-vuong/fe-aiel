import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:3000';

export interface ConversationSummary {
  conversationId: string;
  title: string | null;
  status: 'active' | 'archived';
  lastMessageAt: string | null;
  messageCount: number;
  preview: string | null;
  metadata: Record<string, unknown> | null;
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
}

export interface ConversationDetail {
  conversationId: string;
  title: string | null;
  status: 'active' | 'archived';
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  contentJson: Record<string, unknown> | null;
  parentMessageId: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  modelName: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationMessagesQuery {
  limit?: number;
  beforeMessageId?: string;
}

export interface GetConversationMessagesResponse {
  conversation: ConversationDetail;
  messages: Message[];
  totalMessages: number;
  hasMore: boolean;
}

export interface DeleteConversationResponse {
  message: string;
}

export interface RenameConversationRequest {
  title: string;
}

export interface RenameConversationResponse {
  message: string;
}

export interface ArchiveConversationRequest {
  archived: boolean;
}

export interface ArchiveConversationResponse {
  message: string;
}

export interface AiRequestDto {
  text: string;
  metadata?: any;
  conversationId?: string;
  context?: Record<string, unknown>;
  provider?: string;
  temperature?: number;
  customSystemPrompt?: string;
  serviceType?: 'SYSTEM_CONTROL' | 'STUDY_ANALYST' | 'TUTOR' | 'TEACHING_ASSISTANT';
}

export interface AiResponseDto {
  success: boolean;
  conversationId?: string;
  conversationTitle?: string;
  messageId?: string;
  text: string;
  error?: {
    message?: string;
    code?: string;
  };
  metadata?: {
    createdAt?: string;
    serviceType?: string;
    provider?: string;
    processingTime?: number;
  };
}

export class AiConversationService {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

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

  public async getConversations(
    query?: GetConversationsQuery,
  ): Promise<GetConversationsResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get<GetConversationsResponse>('/conversations', {
      params: query,
    });
    return response.data;
  }

  public async getConversationMessages(
    conversationId: string,
    query?: GetConversationMessagesQuery,
  ): Promise<GetConversationMessagesResponse> {
    const api = this.createAxiosInstance();
    const response = await api.get<GetConversationMessagesResponse>(
      `/conversations/${conversationId}/messages`,
      { params: query },
    );
    return response.data;
  }

  public async deleteConversation(
    conversationId: string,
  ): Promise<DeleteConversationResponse> {
    const api = this.createAxiosInstance();
    const response = await api.delete<DeleteConversationResponse>(
      `/conversations/${conversationId}`,
    );
    return response.data;
  }

  public async renameConversation(
    conversationId: string,
    data: RenameConversationRequest,
  ): Promise<RenameConversationResponse> {
    const api = this.createAxiosInstance();
    const response = await api.put<RenameConversationResponse>(
      `/conversations/${conversationId}/rename`,
      data,
    );
    return response.data;
  }

  public async archiveConversation(
    conversationId: string,
    data: ArchiveConversationRequest,
  ): Promise<ArchiveConversationResponse> {
    const api = this.createAxiosInstance();
    const response = await api.put<ArchiveConversationResponse>(
      `/conversations/${conversationId}/archive`,
      data,
    );
    return response.data;
  }

  public async sendChat(data: AiRequestDto): Promise<AiResponseDto> {
    const api = this.createAxiosInstance();
    const response = await api.post<AiResponseDto>('/chat', data);
    return response.data;
  }

  public async sendDirectChat(data: AiRequestDto): Promise<AiResponseDto> {
    const api = this.createAxiosInstance();
    const response = await api.post<AiResponseDto>('/chat/direct', data);
    return response.data;
  }
}

const aiConversationService = new AiConversationService();
export default aiConversationService;
