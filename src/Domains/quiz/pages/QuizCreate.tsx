import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Sparkles,
  SendHorizontal,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '../services/quiz.service';
import type { QuizCreateRequest } from '../types';
import quizGenService, {
  type QuizProvider,
  type QuizQuestion,
} from '../../ai/services/QuizGen.service';

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

interface AiPromptHistoryItem {
  id: number;
  prompt: string;
  addedCount: number;
  provider: QuizProvider;
}

interface DefaultSchedule {
  start: string;
  end: string;
}

const createDraftId = () => Date.now() + Math.floor(Math.random() * 1000000);

const toDateTimeLocalValue = (date: Date): string => {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const addMinutesToDateTimeLocal = (start: string, minutes: number): string => {
  const parsedDate = start ? new Date(start) : new Date();
  const safeStartDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  return toDateTimeLocalValue(new Date(safeStartDate.getTime() + minutes * 60 * 1000));
};

const getDefaultSchedule = (durationMinutes: number): DefaultSchedule => {
  const now = new Date();
  const start = toDateTimeLocalValue(now);
  const end = toDateTimeLocalValue(
    new Date(now.getTime() + durationMinutes * 60 * 1000),
  );

  return { start, end };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJsonLike = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeOptions = (optionsJson: unknown): string[] => {
  const parsed = parseJsonLike(optionsJson);

  if (Array.isArray(parsed)) {
    return parsed.map(item => String(item ?? '').trim()).filter(Boolean);
  }

  if (isRecord(parsed)) {
    return Object.entries(parsed)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => String(value ?? '').trim())
      .filter(Boolean);
  }

  return [];
};

const extractCorrectToken = (answerKeyJson: unknown): string | null => {
  const parsed = parseJsonLike(answerKeyJson);

  if (Array.isArray(parsed)) {
    const firstValue = parsed[0];
    return firstValue != null ? String(firstValue).trim() : null;
  }

  if (isRecord(parsed)) {
    const byCorrect = parsed.correct;
    if (byCorrect != null) return String(byCorrect).trim();

    const firstEntry = Object.values(parsed)[0];
    return firstEntry != null ? String(firstEntry).trim() : null;
  }

  if (typeof parsed === 'string') return parsed.trim();
  return null;
};

const mapAiQuestionToDraft = (question: QuizQuestion): QuestionDraft => {
  const normalizedOptions = normalizeOptions(question.options_json);
  const fallbackOptions = ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'];
  const finalOptions = normalizedOptions.length > 0 ? normalizedOptions : fallbackOptions;

  const correctToken = extractCorrectToken(question.answer_key_json);
  let correctIndex = 0;

  if (correctToken) {
    const upperToken = correctToken.toUpperCase();
    if (/^[A-Z]$/.test(upperToken)) {
      correctIndex = upperToken.charCodeAt(0) - 65;
    } else {
      const matchedByText = finalOptions.findIndex(
        option => option.toLowerCase() === correctToken.toLowerCase(),
      );
      if (matchedByText >= 0) correctIndex = matchedByText;
    }
  }

  if (correctIndex < 0 || correctIndex >= finalOptions.length) {
    correctIndex = 0;
  }

  return {
    id: createDraftId(),
    text: question.content?.trim() || '',
    points: typeof question.points === 'number' && !Number.isNaN(question.points)
      ? question.points
      : 1,
    options: finalOptions.map((optionText, index) => ({
      text: optionText,
      is_correct: index === correctIndex,
    })),
  };
};

export default function QuizCreate() {
  const { clid } = useParams<{ clid: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [generatingByAi, setGeneratingByAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [preferredProvider, setPreferredProvider] = useState<'auto' | QuizProvider>('auto');
  const [aiHistory, setAiHistory] = useState<AiPromptHistoryItem[]>([]);

  // --- STATE 1: THÔNG TIN CƠ BẢN ---
  const [quizInfo, setQuizInfo] = useState(() => {
    const defaultTimeLimit = 30;
    const schedule = getDefaultSchedule(defaultTimeLimit);

    return {
      name: '',
      description: '',
      status: 'published',
      available_from: schedule.start,
      available_until: schedule.end,
      timeLimit: defaultTimeLimit, // Default 30 mins
      maxAttempts: 1,
    };
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

  const handleTimeLimitChange = (minutes: number) => {
    const safeMinutes = Number.isFinite(minutes) && minutes >= 0 ? minutes : 0;
    setQuizInfo(prev => ({
      ...prev,
      timeLimit: safeMinutes,
      available_until: addMinutesToDateTimeLocal(prev.available_from, safeMinutes),
    }));
  };

  const handleAvailableFromChange = (start: string) => {
    setQuizInfo(prev => ({
      ...prev,
      available_from: start,
      available_until: addMinutesToDateTimeLocal(start, Number(prev.timeLimit) || 0),
    }));
  };

  const handleGenerateQuestionsWithAi = async () => {
    const prompt = aiPrompt.trim();
    if (!prompt) {
      toast.warning('Vui lòng nhập prompt để tạo câu hỏi với AI.');
      return;
    }

    setGeneratingByAi(true);

    try {
      const response = await quizGenService.generateQuiz({
        text: prompt,
        ...(preferredProvider !== 'auto' ? { provider: preferredProvider } : {}),
      });

      const generatedDrafts = response.questions
        .map(mapAiQuestionToDraft)
        .filter(question => question.text.trim().length > 0 && question.options.length > 0);

      if (generatedDrafts.length === 0) {
        toast.warning('AI không trả về câu hỏi hợp lệ. Hãy thử prompt chi tiết hơn.');
        return;
      }

      setQuestions(prevQuestions => {
        const hasOnlyEmptySkeleton =
          prevQuestions.length === 1 &&
          !prevQuestions[0].text.trim() &&
          prevQuestions[0].options.every(option => !option.text.trim());

        return hasOnlyEmptySkeleton
          ? generatedDrafts
          : [...prevQuestions, ...generatedDrafts];
      });

      setAiHistory(prev => [
        {
          id: createDraftId(),
          prompt,
          addedCount: generatedDrafts.length,
          provider: response.provider,
        },
        ...prev,
      ].slice(0, 6));

      toast.success(`Đã thêm ${generatedDrafts.length} câu hỏi từ AI.`);
      setAiPrompt('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể tạo câu hỏi từ AI.';
      toast.error(msg);
    } finally {
      setGeneratingByAi(false);
    }
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
      const creatorId =
        localStorage.getItem('roleId');

      if (!creatorId) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      // 3. Chuẩn bị Payload theo API format
      const payload: QuizCreateRequest = {
        name: quizInfo.name,
        description: quizInfo.description,
        clid: clid!,
        creator_id: creatorId,
        status: quizInfo.status as 'draft' | 'published' | 'archived',
        available_from: quizInfo.available_from
          ? new Date(quizInfo.available_from).toISOString()
          : null,
        available_until: quizInfo.available_until
          ? new Date(quizInfo.available_until).toISOString()
          : null,

        // Settings JSON - stringify to string
        settings_json: JSON.stringify({
          timeLimit: Number(quizInfo.timeLimit),
          maxAttempts: Number(quizInfo.maxAttempts),
          shuffleQuestions: true,
        }),

        // Convert questions to API format
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
            content: q.text,
            options_json: JSON.stringify(optionsObj),
            answer_key_json: JSON.stringify(answerKeyObj),
            points: q.points,
          };
        }),
      };

      console.log('📦 Creating Quiz Payload:', payload);

      // 4. Gọi API thông qua service
      await quizService.createQuiz(payload);

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
      <div className="max-w-7xl mx-auto">
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

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="space-y-8">
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
                      onChange={e => handleTimeLimitChange(Number(e.target.value))}
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
                      onChange={e => handleAvailableFromChange(e.target.value)}
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
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-[#49BBBD] outline-none"
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

                {/* Nút thêm câu hỏi */}
                <div className="flex justify-end  ">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-[#49BBBD] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all shadow-sm"
                  >
                    <PlusCircle size={18} /> Thêm câu hỏi
                  </button>
                </div>


              </div>

              {/* --- FOOTER ACTIONS --- */}
              <div className=" bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
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
            </div>

            <aside className="xl:sticky xl:top-6 self-start">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                  <Sparkles className="text-[#49BBBD]" size={18} />
                  <h3 className="font-bold text-gray-700">AI Quiz Assistant</h3>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prompt tạo câu hỏi
                    </label>
                    <textarea
                      rows={6}
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="Ví dụ: Tạo 5 câu hỏi trắc nghiệm về OOP cho sinh viên năm 2, mức độ trung bình"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provider ưu tiên
                    </label>
                    <select
                      value={preferredProvider}
                      onChange={e =>
                        setPreferredProvider(e.target.value as 'auto' | QuizProvider)
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none bg-white text-sm"
                    >
                      <option value="auto">Tự động fallback</option>
                      <option value="gemini">Gemini</option>
                      <option value="groq">Groq</option>
                      <option value="openai">OpenAI</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateQuestionsWithAi}
                    disabled={generatingByAi}
                    className="w-full bg-[#49BBBD] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#3aa8aa] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <SendHorizontal size={16} />
                    {generatingByAi ? 'AI đang tạo câu hỏi...' : 'Gửi prompt cho AI'}
                  </button>

                  <div className="rounded-lg border border-[#49BBBD]/30 bg-[#49BBBD]/5 p-3 text-xs text-gray-600">
                    Các câu hỏi AI trả về sẽ được chèn vào danh sách bên trái và bạn có thể chỉnh sửa/xóa trực tiếp trước khi lưu.
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Lịch sử prompt gần đây</h4>
                    {aiHistory.length === 0 && (
                      <p className="text-xs text-gray-500">Chưa có lượt tạo câu hỏi nào.</p>
                    )}
                    {aiHistory.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3 text-xs bg-gray-50">
                        <p className="text-gray-700 line-clamp-2">{item.prompt}</p>
                        <p className="mt-2 text-gray-500">
                          +{item.addedCount} câu hỏi | provider: {item.provider}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
