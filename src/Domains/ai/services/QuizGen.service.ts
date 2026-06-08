import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

// ===== Types =====

export type QuizProvider = 'gemini' | 'groq' | 'openai';

export type QuizJson = Record<string, unknown> | unknown[];

export interface QuizGenRequest {
  text: string;
  provider?: QuizProvider;
  metadata?: {
    classId?: string;
  };
}

export interface QuizQuestion {
  content: string;
  options_json?: QuizJson;
  answer_key_json: QuizJson;
  points: number;
}

export interface QuizGenResponse {
  text: string;
  questions: QuizQuestion[];
  provider: QuizProvider;
  rawText: string;
}

export interface QuizGenErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// ===== Service =====

/**
 * Quiz Generation Service Class
 * Handles API calls for AI quiz generation
 */
export class QuizGenService {
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
   * Generate quiz questions from AI
   * @param data - Prompt text and optional preferred provider
   * @returns Generated quiz payload
   */
  public async generateQuiz(data: QuizGenRequest): Promise<QuizGenResponse> {
    const api = this.createAxiosInstance();
    const response = await api.post('/quizgen', data);
    return response.data;
  }

  /**
   * Stream quiz generation via SSE if backend supports it.
   * Handlers receive progress events and final response.
   */
  public async streamGenerateQuiz(
    data: QuizGenRequest,
    handlers: {
      onProgress?: (event: { stage?: string; message?: string; data?: Record<string, unknown> }) => void;
      onFinal?: (resp: QuizGenResponse) => void;
    } = {},
  ): Promise<QuizGenResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/ai/quizgen?stream=true`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`QuizGen failed with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!response.body || !contentType.includes('text/event-stream')) {
      return (await response.json()) as QuizGenResponse;
    }

    const decoder = new TextDecoder('utf-8');
    const reader = response.body.getReader();
    let buffer = '';
    let finalResp: QuizGenResponse | null = null;

    const handleBlock = (rawBlock: string) => {
      const block = rawBlock.trim();
      if (!block) return;

      const lines = block.split('\n');
      let eventName = 'message';
      const dataLines: string[] = [];

      lines.forEach((line) => {
        if (line.startsWith('event:')) {
          eventName = line.slice(6).trim();
          return;
        }
        if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      });

      if (dataLines.length === 0) return;

      const payloadText = dataLines.join('\n');

      try {
        const payload = JSON.parse(payloadText) as any;

        if (eventName === 'progress') {
          handlers.onProgress?.(payload as { stage?: string; message?: string; data?: Record<string, unknown> });
          return;
        }

        if (eventName === 'final') {
          finalResp = payload as QuizGenResponse;
          handlers.onFinal?.(finalResp);
        }
      } catch (error) {
        // ignore parse errors for non-JSON chunks
        console.error('Failed to parse QuizGen stream event:', error);
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

        let separatorIndex = buffer.indexOf('\n\n');
        while (separatorIndex >= 0) {
          const block = buffer.slice(0, separatorIndex);
          buffer = buffer.slice(separatorIndex + 2);
          handleBlock(block);
          separatorIndex = buffer.indexOf('\n\n');
        }
      }

      buffer += decoder.decode().replace(/\r\n/g, '\n');
      if (buffer.trim()) handleBlock(buffer);
    } finally {
      reader.releaseLock();
    }

    if (finalResp) return finalResp;
    throw new Error('QuizGen stream ended without a final response');
  }
}

// Export singleton instance
const quizGenService = new QuizGenService();
export default quizGenService;
