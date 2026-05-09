import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Trash2,
  PlusCircle,
  AlertCircle,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '../Domains/quiz/services/quiz.service';
import type { Quiz, QuizUpdateRequest } from '../Domains/quiz/types';

// Interface cho Question
interface Question {
  ques_id?: string;
  content: string;
  options_json?: string | any;
  points?: number;
}

export default function QuizEdit() {
  const { clid, qid } = useParams<{ clid: string; qid: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    available_from: '',
    available_until: '',
    timeLimit: 0,
    maxAttempts: 1,
  });
  // quíz
  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!qid) return;

        const quiz: Quiz = await quizService.getQuizById(qid);

        // Xử lý Settings JSON
        let settings: any = {};
        try {
          settings =
            typeof quiz.settings_json === 'string'
              ? JSON.parse(quiz.settings_json)
              : quiz.settings_json || {};
        } catch (e) {
          console.error('Lỗi parse settings', e);
        }

        // Helper format date cho input datetime-local
        const formatDate = (dateStr?: string | null) => {
          if (!dateStr) return '';
          return new Date(dateStr).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
        };

        setFormData({
          name: quiz.name || '',
          description: quiz.description || '',
          status: quiz.status || 'draft',
          available_from: formatDate(quiz.available_from),
          available_until: formatDate(quiz.available_until),
          timeLimit: settings.timeLimit || 0,
          maxAttempts: settings.maxAttempts || 1,
        });

        // Set danh sách câu hỏi nếu có
        if (quiz.questions && Array.isArray(quiz.questions)) {
          setQuestions(
            quiz.questions.map(question => ({
              ques_id: question.ques_id,
              content: question.content,
              options_json: question.options_json,
              points: question.points,
            }))
          );
        }
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải thông tin bài thi.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [qid, navigate]);

  // --- 2. UPDATE QUIZ INFO ---
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: QuizUpdateRequest = {
        name: formData.name,
        description: formData.description,
        clid: clid,
        status: formData.status as QuizUpdateRequest['status'],
        available_from: formData.available_from
          ? new Date(formData.available_from).toISOString()
          : null,
        available_until: formData.available_until
          ? new Date(formData.available_until).toISOString()
          : null,
        settings_json: JSON.stringify({
          timeLimit: Number(formData.timeLimit),
          maxAttempts: Number(formData.maxAttempts),
          shuffleQuestions: true,
        }),
      };

      if (!qid) return;

      await quizService.updateQuiz(qid, payload);

      toast.success('Cập nhật thông tin bài thi thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu bài thi.');
    } finally {
      setSaving(false);
    }
  };

  // --- 3. DELETE QUESTION ---
  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;

    // Backend hiện chưa có endpoint xóa câu hỏi, nên chỉ cập nhật UI tại client.
    setQuestions(prev => prev.filter(q => q.ques_id !== questionId));
    toast.success('Đã xóa câu hỏi khỏi danh sách.');
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#49BBBD]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: Form Sửa Thông Tin Chung --- */}
        <div className="lg:col-span-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#49BBBD] mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#49BBBD] p-6 text-white flex items-center gap-3">
              <Settings size={24} />
              <h1 className="text-xl font-bold">Cài đặt bài thi</h1>
            </div>

            <form onSubmit={handleSaveInfo} className="p-8 space-y-6">
              {/* Tên & Mô tả */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Tên bài thi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  />
                </div>
              </div>

              {/* Cài đặt thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-[#49BBBD]"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Công khai</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Clock size={16} /> Thời gian làm bài (phút)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.timeLimit}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        timeLimit: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Số lần thử tối đa
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttempts}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxAttempts: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  />
                </div>
              </div>

              {/* Thời hạn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Mở từ
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.available_from}
                    disabled
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Hạn chót
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.available_until}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        available_until: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#49BBBD] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-teal-100"
                >
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt'} <Save size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: Danh sách câu hỏi --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#49BBBD]" />
                Câu hỏi ({questions.length})
              </h2>
              {/* Nút thêm câu hỏi (Sẽ cần tạo route handleAddQuestion) */}
              <button
                onClick={() =>
                  toast.info('Tính năng thêm câu hỏi đang phát triển')
                } // Thay bằng handleAddQuestion khi đã có trang Add
                className="text-xs bg-[#49BBBD] text-white px-3 py-1.5 rounded-full hover:bg-[#3aa8aa] flex items-center gap-1 font-bold"
              >
                <PlusCircle size={14} /> Thêm
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2 space-y-2">
              {questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div
                    key={q.ques_id ?? `${idx}`}
                    className="bg-white border border-gray-100 p-3 rounded-lg hover:shadow-md transition-shadow group relative"
                  >
                    <div className="pr-8">
                      <span className="text-xs font-bold text-[#49BBBD] bg-teal-50 px-2 py-0.5 rounded mr-2">
                        Câu {idx + 1}
                      </span>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {q.content}
                      </p>
                    </div>
                    <button
                      onClick={() => q.ques_id && handleDeleteQuestion(q.ques_id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 px-4">
                  <AlertCircle className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có câu hỏi nào.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
