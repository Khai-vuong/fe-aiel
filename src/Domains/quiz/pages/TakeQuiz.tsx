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
  PlayCircle
} from 'lucide-react';

// Interface
interface Quiz {
  qid: string;
  name: string;
  description?: string;
  available_from?: string;
  available_until?: string;
  status: string;
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

  // State mở rộng lịch sử
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // State loading cho nút Take Quiz (để tránh double-click)
  const [creatingAttemptId, setCreatingAttemptId] = useState<string | null>(null);

  // 1. Lấy danh sách Quiz
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/quizzes/class/${clid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizzes(response.data);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (clid) fetchQuizzes();
  }, [clid]);

  // 2. Toggle xem lịch sử
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
      console.error('Failed to fetch history:', err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  // 3. XỬ LÝ NÚT TAKE QUIZ (Logic bạn yêu cầu)
  const handleTakeQuiz = async (quizId: string) => {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId');

    // Kiểm tra login kỹ càng
    if (!studentId || !token) {
      alert("Vui lòng đăng nhập lại để thực hiện bài thi.");
      return;
    }

    setCreatingAttemptId(quizId); // Bật trạng thái loading cho nút này

    try {
      // Gọi API tạo lượt làm bài mới
      const response = await axios.post(
        'http://localhost:3000/attempts',
        { quiz_id: quizId, student_id: studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // API trả về attempt mới tạo (có chứa atid)
      const newAttempt = response.data;
      
      // Điều hướng sang trang làm bài với ID vừa tạo
      navigate(`/take-quiz/${newAttempt.atid}`); 

    } catch (err: any) {
      console.error("Error creating attempt:", err);
      const msg = err.response?.data?.message || 'Không thể bắt đầu bài thi. Vui lòng thử lại.';
      alert(msg);
    } finally {
      setCreatingAttemptId(null); // Tắt loading
    }
  };

  if (loading) return <div className="text-center py-10">Loading quizzes...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[80vw] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Class Quizzes</h1>
        </div>

        <div className="space-y-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz.qid}
                className="bg-white rounded-xl shadow border overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Thông tin Quiz */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileCheck className="w-6 h-6 text-[#49BBBD]" />
                      <h3 className="font-bold text-lg text-gray-800">
                        {quiz.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                          quiz.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </div>
                    {quiz.description && (
                      <p className="text-gray-500 text-sm mb-2">
                        {quiz.description}
                      </p>
                    )}
                    {quiz.available_until && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <Clock size={12} /> Deadline:{' '}
                        {new Date(quiz.available_until).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Cụm nút thao tác */}
                  <div className="flex items-center gap-3">
                    {/* Nút Xem lịch sử */}
                    <button
                      onClick={() => handleToggleHistory(quiz.qid)}
                      className={`p-2 rounded-full transition-colors border border-gray-200 ${
                        expandedQuizId === quiz.qid 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'hover:bg-gray-50 text-gray-500'
                      }`}
                      title="View Attempt History"
                    >
                      {expandedQuizId === quiz.qid ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {/* NÚT TAKE QUIZ */}
                    <button
                      onClick={() => handleTakeQuiz(quiz.qid)}
                      disabled={creatingAttemptId === quiz.qid} // Disable khi đang loading
                      className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 ${
                        creatingAttemptId === quiz.qid
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-[#49BBBD] text-white hover:bg-[#3a9ea0]'
                      }`}
                    >
                      {creatingAttemptId === quiz.qid ? (
                        'Creating...'
                      ) : (
                        <>
                          <PlayCircle size={18} /> Take Quiz
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Phần Lịch sử Dropdown */}
                {expandedQuizId === quiz.qid && (
                  <div className="bg-gray-50 border-t p-6 animate-fadeIn">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4" /> History Attempts
                    </h4>

                    {loadingAttempts ? (
                      <p className="text-gray-500 text-sm">Loading history...</p>
                    ) : quizAttempts.length > 0 ? (
                      <div className="space-y-3">
                        {quizAttempts.map((att) => (
                          <div
                            key={att.atid}
                            className="bg-white p-4 rounded-lg border flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                Attempt #{att.attempt_number}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(att.started_at).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm font-bold text-[#49BBBD]">
                                <Award size={16} />
                                {att.score !== null ? att.score : '--'}{' '}
                                <span className="text-gray-400 font-normal">pts</span>
                              </div>
                              <span className={`text-xs font-medium ${
                                  att.status === 'submitted'
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                                }`}
                              >
                                {att.status === 'submitted' ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic bg-white p-4 rounded border text-center">
                        You haven't taken this quiz yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow border">
              <FileCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No quizzes available for this class</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}