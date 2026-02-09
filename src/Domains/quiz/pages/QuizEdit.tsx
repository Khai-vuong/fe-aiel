import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

interface Question {
  ques_id: string;
  content: string;
  options_json: string | any;
  points: number;
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

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Gọi API lấy thông tin Quiz
        const res = await axios.get(`http://localhost:3000/quizzes/${qid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const quiz = res.data;

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

        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          return new Date(dateStr).toISOString().slice(0, 16);
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

        if (quiz.questions && Array.isArray(quiz.questions)) {
          setQuestions(quiz.questions);
        }
      } catch (err) {
        console.error('Lỗi fetch quiz:', err);
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
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
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

      await axios.put(`http://localhost:3000/quizzes/${qid}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Cập nhật thành công!');
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

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestions(prev => prev.filter(q => q.ques_id !== questionId));
      toast.success('Đã xóa câu hỏi.');
    } catch (error) {
      console.error(error);
      toast.error('Không thể xóa câu hỏi.');
    }
  };

  if (loading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM SỬA THÔNG TIN */}
        <div className="lg:col-span-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#49BBBD] mb-6"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#49BBBD] p-6 text-white flex items-center gap-3">
              <Settings size={24} />
              <h1 className="text-xl font-bold">Cài đặt bài thi</h1>
            </div>

            <form onSubmit={handleSaveInfo} className="p-8 space-y-6">
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
                    className="w-full p-3 border rounded-lg bg-white"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Công khai</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Clock size={16} /> Thời gian (phút)
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
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#49BBBD] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#3aa8aa] shadow-lg shadow-teal-100 disabled:opacity-70"
                >
                  {saving ? 'Đang lưu...' : 'Lưu cài đặt'}{' '}
                  <Save size={20} className="inline ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#49BBBD]" />
                Câu hỏi ({questions.length})
              </h2>
              <button
                onClick={() =>
                  toast.info('Tính năng thêm câu hỏi đang phát triển')
                }
                className="text-xs bg-[#49BBBD] text-white px-3 py-1.5 rounded-full hover:bg-[#3aa8aa] flex items-center gap-1 font-bold"
              >
                <PlusCircle size={14} /> Thêm
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2 space-y-2">
              {questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div
                    key={q.ques_id}
                    className="bg-white border border-gray-100 p-3 rounded-lg hover:shadow-md transition-shadow relative group"
                  >
                    <div className="pr-8">
                      <span className="text-xs font-bold text-[#49BBBD] bg-teal-50 px-2 py-0.5 rounded mr-2">
                        #{idx + 1}
                      </span>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {q.content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.ques_id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có câu hỏi.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
s;
