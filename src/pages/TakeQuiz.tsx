import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { attemptService } from '../Domains/quiz/services';
import { quizService } from '../Domains/quiz/services';
import type { Attempt, Quiz, Question as QuizQuestion } from '../Domains/quiz/types';

interface Option {
  id: string;
  content: string;
}

interface Question {
  ques_id: string;
  content: string;
  options_json: string | object;
  parsedOptions?: Option[];
}

interface QuizInfo {
  name: string;
  timeLimit: number;
}

export default function TakeQuiz() {
  const { atid } = useParams<{ atid: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const initQuiz = async () => {
      try {
        if (!atid) return;

        // B1: Lấy thông tin bài làm (Attempt)
        console.log('Fetching attempt:', atid);
        const attemptData: Attempt = await attemptService.getAttemptById(atid);

        // Kiểm tra trạng thái
        if (
          attemptData.status === 'submitted' ||
          attemptData.status === 'graded'
        ) {
          toast.info('Bài thi này đã nộp.');
          navigate(`/quiz-result/${atid}`, { replace: true });
          return;
        }

        // B2: Lấy thông tin Quiz và CÂU HỎI
        // (Do backend ko có module Questions riêng nên lấy qua Quiz)
        console.log('Fetching quiz:', attemptData.quiz_id);
        const quizData: Quiz = await quizService.getQuizById(attemptData.quiz_id);

        // Parse Time Limit
        let limit = 0;
        try {
          const settings =
            typeof quizData.settings_json === 'string'
              ? JSON.parse(quizData.settings_json)
              : quizData.settings_json;
          limit = settings?.timeLimit || 0;
        } catch (e) { }
        setQuizInfo({ name: quizData.name, timeLimit: limit });

        // B3: Xử lý danh sách câu hỏi
        // Backend trả về câu hỏi trong mảng `questions` của quizData
        const rawQuestions = (quizData.questions ?? []).filter(
          (question): question is QuizQuestion & { ques_id: string } =>
            Boolean(question.ques_id)
        );
        console.log('Raw Questions:', rawQuestions);

        const processedQuestions = rawQuestions.map(q => {
          let opts: Option[] = [];
          try {
            // Parse options_json từ String -> Object
            const parsedObj =
              typeof q.options_json === 'string'
                ? JSON.parse(q.options_json)
                : q.options_json;

            if (parsedObj) {
              // Chuyển Object {"A": "..."} thành Array [{id: "A", content: "..."}]
              opts = Object.entries(parsedObj).map(([key, value]) => ({
                id: key,
                content: String(value),
              }));
              // Sắp xếp A, B, C...
              opts.sort((a, b) => a.id.localeCompare(b.id));
            }
          } catch (error) {
            console.error(`Lỗi parse option câu ${q.ques_id}`, error);
          }
          return { ...q, options_json: q.options_json ?? '', parsedOptions: opts };
        });

        setQuestions(processedQuestions);

        // B4: Đồng bộ Timer
        if (limit > 0) {
          const startTime = new Date(attemptData.started_at).getTime();
          const endTime = startTime + limit * 60 * 1000;
          const now = Date.now();
          const remainSeconds = Math.floor((endTime - now) / 1000);

          if (remainSeconds <= 0) {
            void handleAutoSubmit();
          } else {
            setTimeLeft(remainSeconds);
          }
        }
      } catch (err) {
        console.error('Lỗi khởi tạo:', err);
        // Có thể ID attempt không tồn tại hoặc lỗi mạng
      } finally {
        setLoading(false);
      }
    };

    initQuiz();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [atid]);

  // --- Timer & Handlers (Giữ nguyên logic) ---
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      void handleAutoSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    toast.warning('Hết giờ! Đang nộp bài...');
    await handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (isSubmitting) return;

    if (!isAuto) {
      if (!window.confirm('Bạn có chắc chắn muốn nộp bài?')) return;
    }

    setIsSubmitting(true);

    try {
      const payloadAnswers = Object.entries(answers).map(([qid, oid]) => ({
        question_id: qid,
        answer_json: JSON.stringify({ selected: oid }),
      }));

      const res = await attemptService.submitAttempt(atid!, {
        answers: payloadAnswers,
      });

      toast.success('Nộp bài thành công!');
      navigate(`/quiz-result/${atid}`, { state: { result: res } });
    } catch (error: any) {
      console.error('Lỗi nộp bài:', error);
      toast.error('Nộp bài thất bại.');
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#49BBBD]"></div>
        <p className="mt-4 text-gray-500">Đang tải đề thi...</p>
      </div>
    );

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
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

      {/* Body */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-4 flex flex-col md:flex-row gap-6">
        {/* Câu hỏi */}
        <div className="flex-1 flex flex-col">
          {currentQuestion ? (
            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex-1">
              <div className="mb-6 flex justify-between items-start">
                <span className="text-[#49BBBD] font-bold text-sm bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                  Câu {currentQIndex + 1} / {questions.length}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
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
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 group ${isSelected
                          ? 'border-[#49BBBD] bg-teal-50'
                          : 'border-gray-100 hover:border-gray-300'
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 ${isSelected
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
            <div className="bg-white p-10 text-center text-gray-500 rounded-xl border border-dashed border-gray-300">
              <AlertTriangle
                className="mx-auto mb-2 text-yellow-500"
                size={32}
              />
              <p>Không tìm thấy dữ liệu câu hỏi.</p>
            </div>
          )}

          {/* Navigation */}
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
                className="px-6 py-2.5 bg-[#49BBBD] text-white rounded-xl font-bold hover:bg-[#3aa8aa] flex items-center gap-2 shadow-lg disabled:opacity-70"
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

        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border p-5 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-700 mb-4">
              <Menu size={20} /> Danh sách câu
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {questions.map((q, idx) => {
                const isDone = !!answers[q.ques_id];
                const isNow = idx === currentQIndex;
                return (
                  <button
                    key={q.ques_id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${isNow
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
              disabled={isSubmitting}
              className="w-full mt-4 py-2 border border-[#49BBBD] text-[#49BBBD] rounded-lg font-bold hover:bg-teal-50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> Nộp ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
