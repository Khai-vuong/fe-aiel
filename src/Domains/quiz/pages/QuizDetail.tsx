import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  History,
  PlayCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Timer,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '../services/quiz.service';
import { attemptService } from '../services';
import type { Quiz, Attempt } from '../types';

export default function QuizDetail() {
  const { qid } = useParams<{ qid: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const quizNameFromState = location.state?.quizName;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // --- PHẦN 0: GỌI API LẤY THÔNG TIN QUIZ ---
  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const data = await quizService.getQuizById(qid!);
        setQuiz(data);
      } catch (error) {
        console.error('Lỗi tải thông tin quiz:', error);
        toast.error('Không thể tải thông tin bài thi.');
      }
    };

    if (qid) fetchQuizInfo();
  }, []);

  // --- PHẦN 1: GỌI API LẤY LỊCH SỬ ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const studentId = localStorage.getItem('roleId');

        if (!studentId || !qid) return;

        const data = await attemptService.getAttemptsByQuizAndStudent(qid, studentId);

        // Service trả về mảng Attempt trực tiếp
        const sortedAttempts = data.sort(
          (a: Attempt, b: Attempt) =>
            new Date(b.started_at).getTime() -
            new Date(a.started_at).getTime()
        );
        setAttempts(sortedAttempts);
      } catch (error) {
        console.error('Lỗi tải lịch sử:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- PHẦN 2: XỬ LÝ LÀM BÀI (GỌI API THẬT) ---
  const handleStartQuiz = async () => {
    const studentId = localStorage.getItem('roleId');

    if (!studentId) {
      toast.error('Lỗi: Không tìm thấy thông tin sinh viên.');
      return;
    }

    if (!qid) {
      toast.error('Lỗi: Không tìm thấy ID bài thi.');
      return;
    }

    setStarting(true);
    try {
      // Payload gửi lên backend
      const payload = {
        quiz_id: qid,
        student_id: studentId,
      };

      // Gọi API thật
      const response = await attemptService.createAttempt(payload);

      // Lấy ID bài thi từ response
      const newAttemptId = response.atid;

      if (newAttemptId) {
        // Chuyển sang trang làm bài với ID thật
        navigate(`/take-quiz/${newAttemptId}`);
      } else {
        toast.error('Không lấy được ID bài thi từ hệ thống.');
      }
    } catch (err: any) {
      console.error('❌ Lỗi tạo bài thi:', err);
      const message =
        err.response?.data?.message || 'Không thể bắt đầu bài thi.';
      toast.error(`Lỗi: ${message}`);
    } finally {
      setStarting(false);
    }
  };

  // Tính điểm cao nhất
  const bestScore = attempts.reduce(
    (max, att) => {
      const score = att.score ?? 0;
      return score > max ? score : max;
    },
    0
  );

  // Lấy thông tin quiz
  const quizName = quiz?.name || quizNameFromState || 'Chi tiết bài thi';
  const quizDescription = quiz?.description;

  // Parse settings
  let timeLimit = null;
  let maxAttempts = null;
  try {
    if (quiz?.settings_json) {
      const settings = typeof quiz.settings_json === 'string'
        ? JSON.parse(quiz.settings_json)
        : quiz.settings_json;
      timeLimit = settings?.timeLimit;
      maxAttempts = settings?.maxAttempts;
    }
  } catch (e) {
    console.error('Error parsing settings:', e);
  }

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#49BBBD] mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Quay lại danh sách
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#49BBBD] p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{quizName}</h1>
            {quizDescription && (
              <p className="text-white/90 mb-3">{quizDescription}</p>
            )}
            <div className="flex gap-6 opacity-90 text-sm flex-wrap">
              <span className="flex items-center gap-2">
                <History size={16} /> {attempts.length} lần thử
              </span>
              <span className="flex items-center gap-2">
                <Award size={16} /> Điểm cao nhất: {bestScore}
              </span>
              {timeLimit && (
                <span className="flex items-center gap-2">
                  <Timer size={16} /> Thời gian: {timeLimit} phút
                </span>
              )}
              {maxAttempts && (
                <span className="flex items-center gap-2">
                  <RotateCcw size={16} /> Tối đa: {maxAttempts} lượt
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Lịch sử làm bài
                </h2>
                {/* <p className="text-gray-500 text-sm mt-1">
                  ID Sinh viên: {localStorage.getItem('studentId')}
                </p> */}
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={starting}
                className="flex items-center gap-3 bg-[#49BBBD] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#3aa8aa] transition-all shadow-lg shadow-teal-100 active:scale-95 disabled:opacity-70"
              >
                {starting ? (
                  'Đang khởi tạo...'
                ) : (
                  <>
                    <PlayCircle size={24} /> Bắt đầu làm bài
                  </>
                )}
              </button>
            </div>

            {/* Bảng Lịch sử */}
            {attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-100">
                      <th className="py-3 font-medium">Lần thử</th>
                      <th className="py-3 font-medium">Trạng thái</th>
                      <th className="py-3 font-medium">Ngày bắt đầu</th>
                      <th className="py-3 font-medium">Điểm số</th>
                      <th className="py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {attempts.map(att => (
                      <tr
                        key={att.atid}
                        onClick={() => {
                          if (att.status === 'submitted' || att.status === 'graded') {
                            navigate(`/quiz-result/${att.atid}`);
                          }
                        }}
                        className={`border-b border-gray-50 transition-colors ${att.status === 'submitted' || att.status === 'graded'
                            ? 'hover:bg-teal-50 cursor-pointer'
                            : 'hover:bg-gray-50'
                          }`}
                      >
                        <td className="py-4 font-bold text-[#49BBBD]">
                          #{att.attempt_number}
                        </td>
                        <td className="py-4">
                          {att.status === 'submitted' ||
                            att.status === 'graded' ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded w-fit">
                              <CheckCircle size={14} /> Hoàn thành
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-orange-500 text-sm font-medium bg-orange-50 px-2 py-1 rounded w-fit">
                              <Clock size={14} /> Đang làm
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(att.started_at).toLocaleString('vi-VN')}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-lg text-gray-800">
                            {att.percentage != null ? `${att.percentage.toFixed(1)}%` : '--'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {(att.status === 'submitted' || att.status === 'graded') && (
                            <ChevronRight size={20} className="text-gray-400 inline-block" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-center text-sm text-gray-500 italic">
                  💡 Nhấp vào bài thi đã hoàn thành để xem chi tiết kết quả
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-300">
                  <History size={32} />
                </div>
                <p className="text-gray-500 font-medium">
                  Chưa có lịch sử làm bài.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
