import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Menu,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- INTERFACES ---
interface Option {
  id: string; // Ví dụ: "A", "B", "C", "D"
  content: string; // Nội dung đáp án
}

interface Question {
  ques_id: string;
  content: string;
  options_json: string; // Chuỗi JSON từ DB: '{"A": "...", "B": "..."}'
  parsedOptions?: Option[]; // Mảng sau khi xử lý để hiển thị
}

interface QuizInfo {
  name: string;
  timeLimit: number; // Phút
}

interface AttemptInfo {
  atid: string;
  started_at: string;
  quiz_id: string;
  status: string;
}

export default function TakeQuiz() {
  const { atid } = useParams<{ atid: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

  // Trạng thái làm bài
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { ques_id: "A" }

  // Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. KHỞI TẠO DỮ LIỆU ---
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        if (!atid) return;

        // B1: Lấy thông tin Attempt
        const attemptRes = await axios.get(
          `http://localhost:3000/attempts/${atid}`,
          { headers }
        );
        const attemptData: AttemptInfo = attemptRes.data;

        // Check trạng thái
        if (
          attemptData.status === 'completed' ||
          attemptData.status === 'submitted'
        ) {
          toast.info('Bài thi này đã được nộp.');
          navigate(`/quiz-result/${atid}`, { replace: true });
          return;
        }

        // B2: Lấy thông tin Quiz
        const quizRes = await axios.get(
          `http://localhost:3000/quizzes/${attemptData.quiz_id}`,
          { headers }
        );
        const quizData = quizRes.data;

        // Parse timeLimit
        let limit = 0;
        try {
          const settings =
            typeof quizData.settings_json === 'string'
              ? JSON.parse(quizData.settings_json)
              : quizData.settings_json;
          limit = settings?.timeLimit || 0;
        } catch (e) {
          // Ignore error
        }
        setQuizInfo({ name: quizData.name, timeLimit: limit });

        // B3: Lấy danh sách câu hỏi (QUAN TRỌNG NHẤT)
        const questionsRes = await axios.get(
          `http://localhost:3000/questions/quiz/${attemptData.quiz_id}`,
          { headers }
        );

        const rawQuestions: Question[] = questionsRes.data;

        // 👇 LOGIC XỬ LÝ OPTIONS_JSON KHỚP VỚI DATABASE CỦA BẠN
        const processedQuestions = rawQuestions.map(q => {
          let opts: Option[] = [];
          try {
            // DB trả về: {"A": "var x", "B": "const x"}
            const parsedObj = JSON.parse(q.options_json);

            // Chuyển Object thành Array: [{id: "A", content: "var x"}, ...]
            opts = Object.entries(parsedObj).map(([key, value]) => ({
              id: key, // Key là A, B, C...
              content: String(value), // Value là nội dung
            }));

            // Sắp xếp lại cho chắc chắn A, B, C, D theo thứ tự
            opts.sort((a, b) => a.id.localeCompare(b.id));
          } catch (error) {
            console.error(`Lỗi parse options câu ${q.ques_id}`, error);
            opts = [];
          }
          return { ...q, parsedOptions: opts };
        });

        setQuestions(processedQuestions);

        // B4: Sync Timer
        if (limit > 0) {
          const startTime = new Date(attemptData.started_at).getTime();
          const endTime = startTime + limit * 60 * 1000;
          const now = Date.now();
          const remainSeconds = Math.floor((endTime - now) / 1000);

          if (remainSeconds <= 0) {
            handleAutoSubmit();
          } else {
            setTimeLeft(remainSeconds);
          }
        }
      } catch (err) {
        console.error('Lỗi init quiz:', err);
        toast.error('Lỗi tải dữ liệu bài thi.');
      } finally {
        setLoading(false);
      }
    };

    initQuiz();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [atid]);

  // --- 2. TIMER EFFECT ---
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleAutoSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  // --- 3. HANDLERS ---
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    if (isSubmitting) return;
    toast.warning('Hết giờ! Đang nộp bài...');
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (isSubmitting) return;

    if (!isAuto) {
      const confirm = window.confirm('Bạn có chắc chắn muốn nộp bài?');
      if (!confirm) return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      // Format payload: { "question_id": "...", "answer_json": "{\"selected\":\"A\"}" }
      const payloadAnswers = Object.entries(answers).map(([qid, oid]) => ({
        question_id: qid,
        answer_json: JSON.stringify({ selected: oid }),
      }));

      // Gọi API nộp bài
      const res = await axios.put(
        `http://localhost:3000/attempts/${atid}/submit`,
        { answers: payloadAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Nộp bài thành công!');
      // Chuyển sang trang kết quả
      navigate(`/quiz-result/${atid}`, { state: { result: res.data } });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Nộp bài thất bại.');
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Đang tải đề thi...</div>
    );

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b px-4 h-16 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 truncate max-w-[60%]">
          {quizInfo?.name || 'Làm bài thi'}
        </h1>
        {timeLeft !== null && (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold border ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-teal-50 text-[#49BBBD] border-teal-200'}`}
          >
            <Clock size={18} /> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-4 flex flex-col md:flex-row gap-6">
        {/* LEFT: Câu hỏi */}
        <div className="flex-1 flex flex-col">
          {currentQuestion ? (
            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex-1">
              <div className="mb-6">
                <span className="text-[#49BBBD] font-bold text-sm bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                  Câu {currentQIndex + 1} / {questions.length}
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.content}
              </h2>

              <div className="space-y-3">
                {currentQuestion.parsedOptions?.map(opt => {
                  const isSelected =
                    answers[currentQuestion.ques_id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() =>
                        handleSelectOption(currentQuestion.ques_id, opt.id)
                      }
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#49BBBD] bg-teal-50'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'border-[#49BBBD] bg-[#49BBBD] text-white'
                            : 'border-gray-300 text-gray-500'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <span
                        className={
                          isSelected
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-600'
                        }
                      >
                        {opt.content}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 text-center text-gray-500 rounded-xl">
              <AlertTriangle className="mx-auto mb-2 text-yellow-500" />
              Không tìm thấy dữ liệu câu hỏi.
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
              disabled={currentQIndex === 0}
              className="px-5 py-2.5 bg-white border rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft size={20} /> Câu trước
            </button>

            {currentQIndex === questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#49BBBD] text-white rounded-xl font-bold hover:bg-[#3aa8aa] flex items-center gap-2 shadow-lg shadow-teal-100"
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}{' '}
                <CheckCircle size={20} />
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQIndex(i => Math.min(questions.length - 1, i + 1))
                }
                className="px-5 py-2.5 bg-[#49BBBD] text-white rounded-xl font-bold hover:bg-[#3aa8aa] flex items-center gap-2 shadow-md"
              >
                Câu tiếp <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Palette */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-700 mb-4">
              <Menu size={20} /> Danh sách câu
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto">
              {questions.map((q, idx) => {
                const isDone = !!answers[q.ques_id];
                const isNow = idx === currentQIndex;
                return (
                  <button
                    key={q.ques_id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      isNow
                        ? 'bg-[#49BBBD] text-white'
                        : isDone
                          ? 'bg-teal-50 text-[#49BBBD] border border-[#49BBBD]'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handleSubmit(false)}
              className="w-full mt-6 py-2 border border-[#49BBBD] text-[#49BBBD] rounded-lg font-bold hover:bg-teal-50 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Nộp ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
