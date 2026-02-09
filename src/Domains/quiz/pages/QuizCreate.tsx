import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Type,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  Target,
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- INTERFACES ---
interface OptionDraft {
  text: string;
  is_correct: boolean;
}

interface QuestionDraft {
  id: number; // ID tạm để render key
  text: string;
  points: number;
  options: OptionDraft[];
}

export default function QuizCreate() {
  const { clid } = useParams<{ clid: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // --- STATE 1: THÔNG TIN CƠ BẢN ---
  const [quizInfo, setQuizInfo] = useState({
    name: '',
    description: '',
    status: 'draft',
    available_from: '',
    available_until: '',
    timeLimit: 30, // Default 30 mins
    maxAttempts: 1,
  });

  // --- STATE 2: DANH SÁCH CÂU HỎI ---
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: Date.now(),
      text: '',
      points: 1,
      options: [
        { text: '', is_correct: true }, // Mặc định A đúng
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    },
  ]);

  // --- HANDLERS CHO CÂU HỎI ---

  // Thêm câu hỏi mới
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        points: 1,
        options: [
          { text: '', is_correct: true },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
      },
    ]);
  };

  // Xóa câu hỏi
  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.warning('Bài thi cần ít nhất 1 câu hỏi!');
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Cập nhật nội dung câu hỏi
  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  // Cập nhật điểm số
  const updateQuestionPoints = (index: number, points: number) => {
    const newQuestions = [...questions];
    newQuestions[index].points = points;
    setQuestions(newQuestions);
  };

  // Cập nhật nội dung đáp án
  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setQuestions(newQuestions);
  };

  // Chọn đáp án đúng
  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    // Reset tất cả về false
    newQuestions[qIndex].options.forEach(opt => (opt.is_correct = false));
    // Set cái được chọn thành true
    newQuestions[qIndex].options[oIndex].is_correct = true;
    setQuestions(newQuestions);
  };

  // --- SUBMIT ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate cơ bản
    if (!quizInfo.name.trim()) {
      toast.error('Vui lòng nhập tên bài thi!');
      return;
    }

    // 2. Validate câu hỏi
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        toast.error(`Câu hỏi số ${i + 1} chưa có nội dung!`);
        return;
      }
      const hasCorrect = questions[i].options.some(o => o.is_correct);
      if (!hasCorrect) {
        toast.error(`Câu hỏi số ${i + 1} chưa chọn đáp án đúng!`);
        return;
      }
      const emptyOption = questions[i].options.some(o => !o.text.trim());
      if (emptyOption) {
        toast.error(`Câu hỏi số ${i + 1} có đáp án trống!`);
        return;
      }
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const creatorId =
        localStorage.getItem('userId') || localStorage.getItem('lecturerId');

      if (!creatorId) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      // 3. Chuẩn bị Payload
      const payload = {
        name: quizInfo.name,
        description: quizInfo.description,
        class_id: clid,
        creator_id: creatorId,
        status: quizInfo.status,
        available_from: quizInfo.available_from
          ? new Date(quizInfo.available_from).toISOString()
          : null,
        available_until: quizInfo.available_until
          ? new Date(quizInfo.available_until).toISOString()
          : null,

        // Settings JSON
        settings_json: JSON.stringify({
          timeLimit: Number(quizInfo.timeLimit),
          maxAttempts: Number(quizInfo.maxAttempts),
          shuffleQuestions: true, // Mặc định trộn câu hỏi
        }),

        // Map questions bỏ field id tạm
        questions: questions.map(q => ({
          text: q.text,
          points: q.points,
          options: q.options.map(o => ({
            text: o.text,
            is_correct: o.is_correct,
          })),
        })),
      };

      console.log('📦 Creating Quiz Payload:', payload);

      // 4. Gọi API
      await axios.post('http://localhost:3000/quizzes', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Tạo bài thi và câu hỏi thành công!');
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Lỗi khi tạo bài thi.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#49BBBD] transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Tạo bài kiểm tra mới
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* --- SECTION 1: CẤU HÌNH CHUNG --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Type className="text-[#49BBBD]" size={20} />
              <h2 className="font-bold text-gray-700">Thông tin chung</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên bài kiểm tra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={quizInfo.name}
                  onChange={e =>
                    setQuizInfo({ ...quizInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  placeholder="VD: Kiểm tra cuối kỳ môn React..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mô tả / Hướng dẫn
                </label>
                <textarea
                  rows={2}
                  value={quizInfo.description}
                  onChange={e =>
                    setQuizInfo({ ...quizInfo, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  placeholder="Nhập hướng dẫn làm bài..."
                />
              </div>

              {/* Time Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock size={16} /> Thời gian làm bài (phút)
                </label>
                <input
                  type="number"
                  min="0"
                  value={quizInfo.timeLimit}
                  onChange={e =>
                    setQuizInfo({
                      ...quizInfo,
                      timeLimit: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Target size={16} /> Số lượt làm bài tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  value={quizInfo.maxAttempts}
                  onChange={e =>
                    setQuizInfo({
                      ...quizInfo,
                      maxAttempts: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                />
              </div>

              {/* Date Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar size={16} /> Mở từ ngày
                </label>
                <input
                  type="datetime-local"
                  value={quizInfo.available_from}
                  onChange={e =>
                    setQuizInfo({ ...quizInfo, available_from: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar size={16} /> Hạn chót nộp
                </label>
                <input
                  type="datetime-local"
                  value={quizInfo.available_until}
                  onChange={e =>
                    setQuizInfo({
                      ...quizInfo,
                      available_until: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={quizInfo.status}
                  onChange={e =>
                    setQuizInfo({ ...quizInfo, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none bg-white"
                >
                  <option value="draft">Bản nháp (Sinh viên không thấy)</option>
                  <option value="published">Công khai (Sinh viên thấy)</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- SECTION 2: DANH SÁCH CÂU HỎI --- */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="text-[#49BBBD]" /> Danh sách câu hỏi (
                {questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 bg-[#49BBBD] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all shadow-sm"
              >
                <PlusCircle size={18} /> Thêm câu hỏi
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn"
              >
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Câu hỏi {qIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Nội dung câu hỏi */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Nội dung câu hỏi
                      </label>
                      <textarea
                        rows={2}
                        value={q.text}
                        onChange={e =>
                          updateQuestionText(qIndex, e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none bg-gray-50"
                        placeholder="Nhập câu hỏi tại đây..."
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Điểm
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={q.points}
                        onChange={e =>
                          updateQuestionPoints(qIndex, Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none text-center"
                      />
                    </div>
                  </div>

                  {/* Các đáp án ABCD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${opt.is_correct ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="radio"
                            name={`correct-answer-${q.id}`} // Group radio buttons theo câu hỏi
                            checked={opt.is_correct}
                            onChange={() => setCorrectOption(qIndex, oIndex)}
                            className="w-5 h-5 text-[#49BBBD] cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-bold ${opt.is_correct ? 'text-green-700' : 'text-gray-500'}`}
                            >
                              Đáp án {String.fromCharCode(65 + oIndex)}
                            </span>
                            {opt.is_correct && (
                              <span className="text-[10px] text-white bg-green-600 px-2 py-0.5 rounded-full font-bold">
                                ĐÚNG
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={e =>
                              updateOptionText(qIndex, oIndex, e.target.value)
                            }
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#49BBBD] outline-none text-sm"
                            placeholder={`Nhập đáp án ${String.fromCharCode(65 + oIndex)}...`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <AlertCircle size={16} />
                Hãy kiểm tra kỹ đáp án đúng trước khi lưu.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#49BBBD] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all flex items-center gap-2 disabled:opacity-70 shadow-md"
                >
                  {saving ? 'Đang lưu...' : 'Lưu bài kiểm tra'}{' '}
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Spacer để nội dung không bị che bởi footer cố định */}
          <div className="h-20"></div>
        </form>
      </div>
    </div>
  );
}
