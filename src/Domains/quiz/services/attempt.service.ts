import axios from 'axios';
import type {
  Attempt,
  AttemptCreateRequest,
  AttemptSubmitRequest,
  AttemptUpdateRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:3000';

class AttemptService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * POST /attempts
   * Tao lan lam bai moi cho mot quiz (Student bat dau lam quiz)
   */
  async createAttempt(data: AttemptCreateRequest): Promise<Attempt> {
    const response = await axios.post(`${API_BASE_URL}/attempts`, data, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * PUT /attempts/:attemptId/submit
   * Nop bai lam va tu dong cham diem
   */
  async submitAttempt(
    attemptId: string,
    data: AttemptSubmitRequest
  ): Promise<Attempt> {
    const response = await axios.put(
      `${API_BASE_URL}/attempts/${attemptId}/submit`,
      data,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  /**
   * GET /attempts/quiz/:qid
   * Lay tat ca cac lan lam bai cua mot quiz
   */
  async getAttemptsByQuiz(qid: string): Promise<Attempt[]> {
    const response = await axios.get(`${API_BASE_URL}/attempts/quiz/${qid}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * GET /attempts/quiz/:qid/student/:sid
   * Lay cac lan lam bai cua mot student trong mot quiz cu the
   */
  async getAttemptsByQuizAndStudent(
    qid: string,
    sid: string
  ): Promise<Attempt[]> {
    const response = await axios.get(
      `${API_BASE_URL}/attempts/quiz/${qid}/student/${sid}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  /**
   * GET /attempts/:attemptId
   * Lay thong tin chi tiet mot lan lam bai
   */
  async getAttemptById(attemptId: string): Promise<Attempt> {
    const response = await axios.get(
      `${API_BASE_URL}/attempts/${attemptId}`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  /**
   * PUT /attempts/:attemptId
   * Cap nhat thong tin lan lam bai (thong thuong dung de cham diem thu cong)
   */
  async updateAttempt(
    attemptId: string,
    data: AttemptUpdateRequest
  ): Promise<Attempt> {
    const response = await axios.put(
      `${API_BASE_URL}/attempts/${attemptId}`,
      data,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }
}

// Export singleton instance
export const attemptService = new AttemptService();
export default attemptService;
