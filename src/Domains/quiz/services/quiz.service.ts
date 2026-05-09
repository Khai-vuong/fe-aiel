import axios from 'axios';
import type {
  Quiz,
  QuizCreateRequest,
  QuizUpdateRequest,
} from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

class QuizService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * GET /quizzes
   * Lay danh sach tat ca bai kiem tra
   */
  async getAllQuizzes(): Promise<Quiz[]> {
    const response = await axios.get(`${BASE_URL}/quizzes`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * GET /quizzes/:id
   * Lay thong tin chi tiet bai kiem tra theo ID
   */
  async getQuizById(id: string): Promise<Quiz> {
    const response = await axios.get(`${BASE_URL}/quizzes/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * GET /quizzes/class/:clid
   * Lay danh sach bai kiem tra cua mot lop hoc
   */
  async getQuizzesByClass(clid: string): Promise<Quiz[]> {
    const response = await axios.get(`${BASE_URL}/quizzes/class/${clid}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * POST /quizzes
   * Tao bai kiem tra moi
   */
  async createQuiz(data: QuizCreateRequest): Promise<Quiz> {
    const response = await axios.post(`${BASE_URL}/quizzes`, data, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * PUT /quizzes/:qid
   * Cap nhat thong tin bai kiem tra
   */
  async updateQuiz(qid: string, data: QuizUpdateRequest): Promise<Quiz> {
    const response = await axios.put(`${BASE_URL}/quizzes/${qid}`, data, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * DELETE /quizzes/:id
   * Xoa bai kiem tra (soft delete - chuyen sang archived)
   */
  async deleteQuiz(id: string): Promise<Quiz> {
    const response = await axios.delete(`${BASE_URL}/quizzes/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }
}

// Export singleton instance
export const quizService = new QuizService();
export default quizService;
