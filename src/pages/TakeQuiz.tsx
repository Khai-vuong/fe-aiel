import {
  FaArrowLeft,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
} from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  id: number;
  title: string;
  description: string;
  image?: string;
  options: string[];
}

export default function TakeQuiz() {
  const navigate = useNavigate();

  const questions: Question[] = [
    {
      id: 1,
      title: 'Question 1',
      description: 'What is the correct way to declare a variable in Python?',
      image: '/img/quiz-preview.jpg',
      options: ['var x = 10', 'x = 10', 'int x = 10', 'declare x = 10'],
    },
    {
      id: 2,
      title: 'Question 2',
      description:
        'Which hook is used to manage state in a functional React component?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    },
    {
      id: 3,
      title: 'Question 3',
      description:
        'What allows you to pass data through the component tree without having to pass props down manually at every level?',
      options: ['Props', 'State', 'Context API', 'Redux'],
    },
    {
      id: 4,
      title: 'Question 4',
      description: 'What is the command to create a new React app?',
      options: [
        'npx create-react-app my-app',
        'npm install react',
        'node start react',
        'git clone react',
      ],
    },
    {
      id: 5,
      title: 'Question 5',
      description:
        'Which method is used to update the state in a class component?',
      options: [
        'this.updateState()',
        'this.setState()',
        'setState()',
        'this.state()',
      ],
    },
  ];

  // --- STATE MANAGEMENT ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Lưu câu trả lời
  const [timeLeft, setTimeLeft] = useState(600); // ⏲️ Thời gian làm bài: 600 giây (10 phút)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ref để quản lý setInterval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LOGIC ĐỒNG HỒ ĐẾM NGƯỢC ---
  useEffect(() => {
    // Nếu đã nộp bài thì dừng đồng hồ
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(); // ⚡ Hết giờ -> Tự động nộp bài
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup khi component unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  // Hàm format giây thành mm:ss (Ví dụ: 65s -> 01:05)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- XỬ LÝ SỰ KIỆN ---
  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return; // Không cho chọn nếu đã nộp
    const currentQ = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // TODO: Gọi API nộp bài ở đây
    console.log('Bài thi đã nộp! Đáp án:', answers);
    alert('Đã nộp bài thành công!');
  };

  // Tính toán tiến độ
  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#EAF6FF] font-sans pb-10">
      {/* --- STICKY HEADER (Luôn hiển thị khi cuộn) --- */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-100 p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Final Exam: Frontend React
              </h2>
              <div className="text-gray-500 text-xs mt-0.5">
                Attempt 1 • {questions.length} Questions
              </div>
            </div>
          </div>

          {/* ⏲️ ĐỒNG HỒ ĐẾM NGƯỢC */}
          <div
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-bold text-xl shadow-sm border-2 transition-colors ${
              timeLeft < 60
                ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' // Sắp hết giờ: Màu đỏ + Nhấp nháy
                : 'bg-[#EFFFFF] text-[#49BBBD] border-[#49BBBD]/20'
            }`}
          >
            <FaClock className={timeLeft < 60 ? 'animate-spin' : ''} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex gap-8">
        {/* --- LEFT COLUMN: QUESTION CONTENT --- */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[500px] flex flex-col relative">
            {/* Question Title */}
            <div className="mb-6 border-b border-gray-100 pb-4">
              <span className="text-[#49BBBD] font-bold text-xs uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">
                Question {currentQuestionIndex + 1}
              </span>
              <h3 className="text-2xl font-bold text-gray-800 mt-3">
                {currentQ.title}
              </h3>
            </div>

            <div className="flex gap-8 flex-1">
              {/* Text & Options */}
              <div className={`${currentQ.image ? 'w-1/2' : 'w-full'}`}>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                  {currentQ.description}
                </p>

                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleOptionSelect(opt)}
                        className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#EFFFFF] border-[#49BBBD] shadow-md'
                            : 'bg-white border-gray-100 hover:border-[#49BBBD]/40 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#49BBBD] bg-[#49BBBD]'
                              : 'border-gray-300 group-hover:border-[#49BBBD]'
                          }`}
                        >
                          {isSelected && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </div>
                        <span
                          className={`text-base font-medium ${isSelected ? 'text-[#49BBBD]' : 'text-gray-600'}`}
                        >
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image (If exists) */}
              {currentQ.image && (
                <div className="w-1/2">
                  <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full max-h-[400px]">
                    <img
                      src={currentQ.image}
                      alt="Question visual"
                      className="w-full h-full object-cover"
                      onError={e =>
                        (e.currentTarget.src =
                          'https://via.placeholder.com/500x350?text=No+Image+Available')
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft /> Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="bg-[#49BBBD] text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-[#3EA8AA] hover:-translate-y-1 transition-all disabled:bg-gray-400"
                >
                  {isSubmitted ? 'Submitted' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentIndex(prev =>
                      Math.min(questions.length - 1, prev + 1)
                    )
                  }
                  className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black hover:-translate-y-1 transition-all shadow-lg shadow-gray-200"
                >
                  Next Question <FaChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Question Palette
            </h3>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-semibold">
                <span>Completed</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#49BBBD] transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Grid câu hỏi */}
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = currentQuestionIndex === idx;

                let btnClass =
                  'w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 ';

                if (isCurrent) {
                  btnClass +=
                    'ring-2 ring-[#49BBBD] ring-offset-2 bg-white text-[#49BBBD]';
                } else if (isAnswered) {
                  btnClass +=
                    'bg-[#49BBBD] text-white shadow-md shadow-teal-100 hover:bg-[#3EA8AA]';
                } else {
                  btnClass += 'bg-gray-100 text-gray-500 hover:bg-gray-200';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(prev => idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Chú thích */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <div className="w-3 h-3 rounded-full bg-[#49BBBD]" /> Answered
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <div className="w-3 h-3 rounded-full border-2 border-[#49BBBD]" />{' '}
                Current
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                <div className="w-3 h-3 rounded-full bg-gray-100" /> Not
                Answered
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper để set index an toàn
  function setCurrentIndex(cb: (prev: number) => number) {
    setCurrentQuestionIndex(cb);
  }
}
