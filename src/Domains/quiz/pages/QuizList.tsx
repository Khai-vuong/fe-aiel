import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileCheck,
  ArrowLeft,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Award,
  PlayCircle,
  Percent,
} from 'lucide-react';

// Interface khớp với Prisma Schema & QuizzesService
interface Quiz {
  qid: string;
  name: string;
  description?: string;
  available_from?: string;
  available_until?: string;
  status: string;
  settings_json?: string; // Backend trả về chuỗi JSON
  _count?: {
    questions: number;
    attempts: number;
  };
}

interface Attempt {
  atid: string;
  attempt_number: number;
  score: number;
  max_score: number;
  started_at: string;
  status: string;
}

export default function QuizList() {
  const { clid } = useParams<{ clid: string }>();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State UI
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [creatingAttemptId, setCreatingAttemptId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        // Gọi API findQuizzesByClassId
        const response = await axios.get(
          `http://localhost:3000/quizzes/class/${clid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizzes(response.data);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        setError('Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    if (clid) fetchQuizzes();
  }, [clid]);

  // Xử lý xem lịch sử
  const handleToggleHistory = async (quizId: string) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      setQuizAttempts([]);
      return;
    }

    setExpandedQuizId(quizId);
    setLoadingAttempts(true);
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId');

    try {
      const response = await axios.get(
        `http://localhost:3000/attempts/quiz/${quizId}/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizAttempts(response.data);
    } catch (err) {
      console.error('Error fetching history', err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  // Xử lý tạo bài thi
  const handleTakeQuiz = async (quizId: string) => {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
      alert('Vui lòng đăng nhập lại.');
      return;
    }

    setCreatingAttemptId(quizId);

    try {
      // API Backend cần endpoint POST /attempts tạo bài thi mới
      const response = await axios.post(
        'http://localhost:3000/attempts',
        { quiz_id: quizId, student_id: studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newAttempt = response.data;
      navigate(`/take-quiz/${newAttempt.atid}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi tạo bài thi');
    } finally {
      setCreatingAttemptId(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[80vw] mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Class Quizzes</h1>
        </div>

        <div className="space-y-4">
          {quizzes.length > 0 ? (
            quizzes.map(quiz => {
              // Parse settings để lấy thời gian làm bài nếu cần hiển thị
              let timeLimit = null;
              try {
                if (quiz.settings_json) {
                  const settings = JSON.parse(quiz.settings_json);
                  timeLimit = settings.timeLimit;
                }
              } catch (e) {}

              return (
                <div
                  key={quiz.qid}
                  className="bg-white rounded-xl shadow border overflow-hidden"
                >
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCheck className="w-6 h-6 text-[#49BBBD]" />
                        <h3 className="font-bold text-lg text-gray-800">
                          {quiz.name}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {quiz.status}
                        </span>
                      </div>
                      {quiz.description && (
                        <p className="text-gray-500 text-sm mb-2">
                          {quiz.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        {quiz.available_until && (
                          <p className="flex items-center gap-1 text-red-500">
                            <Clock size={12} /> Deadline:{' '}
                            {new Date(
                              quiz.available_until
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {timeLimit && <p>Time Limit: {timeLimit} mins</p>}
                        {quiz._count && (
                          <p>Questions: {quiz._count.questions}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleHistory(quiz.qid)}
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                      >
                        {expandedQuizId === quiz.qid ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>

                      <button
                        onClick={() => handleTakeQuiz(quiz.qid)}
                        disabled={creatingAttemptId === quiz.qid}
                        className="px-6 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] flex items-center gap-2"
                      >
                        {creatingAttemptId === quiz.qid ? (
                          'Starting...'
                        ) : (
                          <>
                            <PlayCircle size={18} /> Take Quiz
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Lịch sử */}
                  {expandedQuizId === quiz.qid && (
                    <div className="bg-gray-50 border-t p-6">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <History size={16} /> Attempts History
                      </h4>
                      {loadingAttempts ? (
                        <p>Loading...</p>
                      ) : quizAttempts.length > 0 ? (
                        <div className="space-y-2">
                          {quizAttempts.map(att => (
                            <div
                              key={att.atid}
                              className="bg-white p-3 rounded border flex justify-between"
                            >
                              <div>
                                <span className="font-medium">
                                  Attempt #{att.attempt_number}
                                </span>
                                <span className="text-xs text-gray-500 block">
                                  {new Date(att.started_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-[#49BBBD]">
                                  {att.score ?? '--'} / {att.max_score}
                                </div>
                                <div className="text-xs">{att.status}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No attempts yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
