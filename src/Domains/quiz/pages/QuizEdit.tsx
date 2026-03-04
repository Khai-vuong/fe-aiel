import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Type,
  PlusCircle,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Target,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '../services/quiz.service';
import type { QuizUpdateRequest, Quiz } from '../types';

// --- INTERFACES ---
interface OptionDraft {
  text: string;
  is_correct: boolean;
}

interface QuestionDraft {
  id: number; // ID tạm để render key
  ques_id?: string; // ID thật từ DB (nếu có)
  text: string;
  points: number;
  options: OptionDraft[];
}

export default function QuizEdit() {
  const { clid, qid } = useParams<{ clid: string; qid: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- STATE 1: THÔNG TIN CƠ BẢN ---
  const [quizInfo, setQuizInfo] = useState({
    name: '',
    description: '',
    status: 'published',
    available_from: '',
    available_until: '',
    timeLimit: 30,
    maxAttempts: 1,
  });

  // --- STATE 2: DANH SÁCH CÂU HỎI ---
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  // --- LOAD DỮ LIỆU QUIZ ---
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!qid) return;

        const quiz: Quiz = await quizService.getQuizById(qid);

        // Parse settings
        let settings = { timeLimit: 30, maxAttempts: 1 };
        try {
          if (quiz.settings_json) {
            settings =
              typeof quiz.settings_json === 'string'
                ? JSON.parse(quiz.settings_json)
                : quiz.settings_json;
          }
        } catch (e) {
          console.error('Error parsing settings:', e);
        }

        // Format dates for datetime-local input
        const formatDateForInput = (dateStr: string | null | undefined) => {
          if (!dateStr) return '';
          try {
            const date = new Date(dateStr);
            // Format: YYYY-MM-DDTHH:mm
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          } catch (e) {
            return '';
          }
        };

        // Set quiz info
        setQuizInfo({
          name: quiz.name || '',
          description: quiz.description || '',
          status: quiz.status || 'published',
          available_from: formatDateForInput(quiz.available_from),
          available_until: formatDateForInput(quiz.available_until),
          timeLimit: settings.timeLimit || 30,
          maxAttempts: settings.maxAttempts || 1,
        });

        // Parse questions
        if (quiz.questions && quiz.questions.length > 0) {
          const parsedQuestions: QuestionDraft[] = quiz.questions.map(
            (q, idx) => {
              // Parse options_json
              let options: OptionDraft[] = [];
              try {
                const optionsData =
                  typeof q.options_json === 'string'
                    ? JSON.parse(q.options_json)
                    : q.options_json;

                if (typeof optionsData === 'object' && optionsData !== null) {
                  // Convert {"A": "text1", "B": "text2"} to array
                  options = Object.entries(optionsData).map(([key, value]) => ({
                    text: String(value),
                    is_correct: false, // Will set later
                  }));
                }
              } catch (e) {
                console.error('Error parsing options:', e);
                // Default 4 options
                options = [
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                ];
              }

              // Parse answer_key_json to find correct answer
              let correctLetter = 'A';
              try {
                const answerKey =
                  typeof q.answer_key_json === 'string'
                    ? JSON.parse(q.answer_key_json)
                    : q.answer_key_json;

                if (typeof answerKey === 'string') {
                  correctLetter = answerKey;
                } else if (answerKey?.correct) {
                  correctLetter = answerKey.correct;
                }
              } catch (e) {
                console.error('Error parsing answer key:', e);
              }

              // Set correct option
              const correctIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
              if (options[correctIndex]) {
                options[correctIndex].is_correct = true;
              }

              return {
                id: Date.now() + idx,
                ques_id: q.ques_id, // Lưu ques_id từ DB
                text: q.content || '',
                points: q.points || 1,
                options,
              };
            }
          );

          setQuestions(parsedQuestions);
        } else {
          // Default 1 question if no questions exist
          setQuestions([
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
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        toast.error('Không thể tải thông tin bài thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [qid]);

  // --- HANDLERS CHO CÂU HỎI ---

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

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.warning('Bài thi cần ít nhất 1 câu hỏi!');
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const updateQuestionPoints = (index: number, points: number) => {
    const newQuestions = [...questions];
    newQuestions[index].points = points;
    setQuestions(newQuestions);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach(opt => (opt.is_correct = false));
    newQuestions[qIndex].options[oIndex].is_correct = true;
    setQuestions(newQuestions);
  };

  // --- SUBMIT ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizInfo.name.trim()) {
      toast.error('Vui lòng nhập tên bài thi!');
      return;
    }

    // Validate questions
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
      // Prepare update payload WITH questions
      const payload: QuizUpdateRequest = {
        name: quizInfo.name,
        description: quizInfo.description,
        clid: clid,
        status: quizInfo.status as 'draft' | 'published' | 'archived',
        available_from: quizInfo.available_from
          ? new Date(quizInfo.available_from).toISOString()
          : null,
        available_until: quizInfo.available_until
          ? new Date(quizInfo.available_until).toISOString()
          : null,
        settings_json: JSON.stringify({
          timeLimit: Number(quizInfo.timeLimit),
          maxAttempts: Number(quizInfo.maxAttempts),
          shuffleQuestions: true,
        }),
        // Format questions theo API format
        questions: questions.map(q => {
          // Build options_json: {"A": "text1", "B": "text2", ...}
          const optionsObj: Record<string, string> = {};
          q.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            optionsObj[letter] = opt.text;
          });

          // Build answer_key_json: {"correct": "A"}
          const correctIndex = q.options.findIndex(opt => opt.is_correct);
          const correctLetter = String.fromCharCode(65 + correctIndex);
          const answerKeyObj = { correct: correctLetter };

          return {
            ques_id: q.ques_id, // Nếu có: UPDATE, nếu không: CREATE
            content: q.text,
            options_json: JSON.stringify(optionsObj),
            answer_key_json: JSON.stringify(answerKeyObj),
            points: q.points,
          };
        }),
      };

      await quizService.updateQuiz(qid!, payload);

      toast.success('Cập nhật bài thi và câu hỏi thành công!');
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Lỗi khi cập nhật bài thi.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#49BBBD]" size={48} />
          <p className="text-gray-600">Đang tải dữ liệu bài thi...</p>
        </div>
      </div>
    );
  }

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
            Chỉnh sửa bài kiểm tra
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
                <label className=" text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                <label className=" text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                <label className=" text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                <label className=" text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                className="bg-[#49BBBD] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all flex items-center gap-2"
              >
                <Plus size={20} /> Thêm câu hỏi
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Câu hỏi {qIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Nội dung câu hỏi
                      </label>
                      <textarea
                        rows={2}
                        value={q.text}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].text = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Điểm
                      </label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].points = parseFloat(e.target.value) || 0;
                          setQuestions(updated);
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {q.options.map((opt, oIndex) => (
                      <div
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${opt.is_correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                          }`}
                      >
                        <div className="flex items-center justify-center">
                          <input
                            type="radio"
                            checked={opt.is_correct}
                            onChange={() => {
                              const updated = [...questions];
                              updated[qIndex].options.forEach((o, i) => {
                                o.is_correct = i === oIndex;
                              });
                              setQuestions(updated);
                            }}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-bold ${opt.is_correct ? 'text-green-700' : 'text-gray-500'
                                }`}
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
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[qIndex].options[oIndex].text = e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#49BBBD] outline-none text-sm"
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
          <div className="bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
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
                  {saving ? 'Đang lưu...' : 'Cập nhật bài kiểm tra'}{' '}
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="h-20"></div>
        </form>
      </div>
    </div>
  );
}

