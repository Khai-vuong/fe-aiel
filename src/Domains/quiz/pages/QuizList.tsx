import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Timer,
  RotateCcw,
  Edit,
  Trash2,
  Plus,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '../services/quiz.service';
import type { Quiz } from '../types';

export default function QuizList() {
  const { clid } = useParams<{ clid: string }>();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole');

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getQuizzesByClass(clid!);

        // Log dữ liệu ra để kiểm tra nếu cần
        console.log('Quiz Data:', data);

        setQuizzes(
          data
            .filter((q: Quiz) => q.status.toLowerCase() === 'published')
            .sort((a: Quiz, b: Quiz) => a.qid.localeCompare(b.qid))
        );
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    if (clid) fetchQuizzes();
  }, [clid]);

  // --- ACTIONS ---
  const handleViewDetail = (quizId: string, quizName: string) => {
    navigate(`/class/${clid}/quiz/${quizId}`, { state: { quizName } });
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/class/${clid}/quiz/${quizId}/edit`);
  };

  const handleCreateQuiz = () => {
    navigate(`/class/${clid}/quiz/create`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?')) return;
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.qid !== quizId));
      toast.success('Đã xóa bài kiểm tra.');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Lỗi khi xóa bài kiểm tra.');
    }
  };

  // 👇 HÀM CHECK DATE AN TOÀN TUYỆT ĐỐI
  // Trả về Date object nếu hợp lệ, trả về null nếu lỗi
  const getValidDate = (dateString: string | undefined | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Kiểm tra xem date có bị Invalid Date không
    if (isNaN(date.getTime())) return null;
    return date;
  };

  if (loading)
    return <div className="text-center py-5 text-gray-400">Đang tải...</div>;

  return (
    <div className="bg-white p-4 rounded-b-xl border border-t-0 border-gray-300 shadow-sm">
      {/* HEADER: NÚT TẠO MỚI CHO LECTURER */}
      {userRole === 'Lecturer' && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleCreateQuiz}
            className="flex items-center gap-2 bg-[#49BBBD] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all shadow-md active:scale-95"
          >
            <Plus size={20} /> Tạo bài thi mới
          </button>
        </div>
      )}

      <div className="space-y-3">
        {quizzes.length > 0 ? (
          quizzes
            .sort((a, b) => {
              // Sắp xếp theo available_from (quiz mở sớm nhất trước)
              if (!a.available_from && !b.available_from) return 0;
              if (!a.available_from) return 1; // Quiz không có ngày mở sẽ xuống cuối
              if (!b.available_from) return -1;
              return new Date(b.available_from).getTime() - new Date(a.available_from).getTime();
            })
            .map(quiz => {
              let timeLimit = null;
              let maxAttempts = null;

              try {
                if (quiz.settings_json) {
                  const s =
                    typeof quiz.settings_json === 'string'
                      ? JSON.parse(quiz.settings_json)
                      : quiz.settings_json;
                  if (s) {
                    timeLimit = s.timeLimit;
                    maxAttempts = s.maxAttempts;
                  }
                }
              } catch (e) { }

              const rawDeadline = quiz.available_until;
              const deadlineDate = getValidDate(rawDeadline);

              return (
                <div
                  key={quiz.qid}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-[#49BBBD]">
                      <FileCheck size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {quiz.name}
                        </span>
                        {/* <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${quiz.status === 'published'
                            ? 'bg-green-100 text-green-600 border-green-200'
                            : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {quiz.status}
                      </span> */}
                      </div>

                      {/* INFO ROW */}
                      <div className="flex items-center text-[12px] text-gray-500 mt-1 gap-3 flex-wrap">
                        {timeLimit && (
                          <span className="flex items-center gap-1">
                            <Timer size={12} /> {timeLimit}p
                          </span>
                        )}

                        {maxAttempts && (
                          <span className="flex items-center gap-1">
                            <RotateCcw size={12} /> {maxAttempts} lượt
                          </span>
                        )}

                        {/* 👇 CHỈ HIỂN THỊ NẾU DEADLINE HỢP LỆ (deadlineDate khác null) */}
                        {deadlineDate && (
                          <span className="flex items-center gap-1 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            <Calendar size={12} />
                            Hạn chót:{' '}
                            {deadlineDate.toLocaleString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {userRole === 'Lecturer' ? (
                      <>
                        <button
                          onClick={() => handleEditQuiz(quiz.qid)}
                          className="p-2 text-gray-500 hover:text-[#49BBBD]"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.qid)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleViewDetail(quiz.qid, quiz.name)}
                        className="bg-[#49BBBD] text-white px-4 py-1.5 rounded text-sm font-bold"
                      >
                        Làm bài
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <div className="text-center p-6 text-gray-400 text-sm italic">
            Chưa có bài tập nào.
          </div>
        )}
      </div>
    </div>
  );
}
