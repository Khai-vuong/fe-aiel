import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Base URL
const BASE_URL = 'http://localhost:3000';

// ===== Types =====

export type QuizProvider = 'gemini' | 'groq' | 'openai';

export type QuizJson = Record<string, unknown> | unknown[];

export interface QuizGenRequest {
  text: string;
  provider?: QuizProvider;
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
}

// Export singleton instance
const quizGenService = new QuizGenService();
export default quizGenService;
