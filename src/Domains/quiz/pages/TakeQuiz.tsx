import { FaArrowLeft, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm để điều hướng quay lại

export default function TakeQuiz() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Fake question
  const question = {
    id: 1,
    title: 'Questions 1:',
    description:
      'TOTC’s school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.',
    // SỬA ĐƯỜNG DẪN ẢNH TẠI ĐÂY:
    // Vì ảnh nằm trong public/img/login.png nên ta gọi trực tiếp từ root là /img/...
    image: '/img/login.png',
    answers: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit, sed do',
      'Elusmod tempos Lorem ipsum',
      'Lorem ipsum dolor sit amet',
    ],
  };

  const contents = [
    { title: 'Get Started', duration: '1 Hour', active: false },
    {
      title: 'Illustrator Structures',
      duration: '2 Hour',
      active: true,
      items: [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor',
        'Lorem ipsum dolor sit amet',
      ],
    },
    { title: 'Using Illustrator', duration: '1 Hour', active: false },
    { title: 'What is Pandas?', duration: '12:54', active: false },
    { title: 'Work with Numpy', duration: '59:00', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#EAF6FF] p-6 flex gap-6">
      {/* LEFT COLUMN */}
      <div className="w-3/4">
        {/* Header */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)} // Quay lại trang trước đó
              className="bg-[#49BBBD] p-3 rounded-lg text-white hover:bg-[#3EA8AA] transition-colors"
            >
              <FaArrowLeft size={16} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                UX/UI Design Conference Meeting
              </h2>
              <div className="flex gap-6 text-gray-500 text-sm mt-1">
                <span>9 Questions</span>
                <span className="flex items-center gap-2">
                  <FaClock size={14} />
                  5h 30min
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors text-xl">
            ⚙
          </button>
        </div>

        {/* QUESTION AREA */}
        <div className="mt-10 p-6">
          <h3 className="text-3xl font-bold text-[#49BBBD] mb-4">
            {question.title}
          </h3>

          <div className="flex gap-10 items-start">
            {/* QUESTION LEFT SIDE */}
            <div className="w-1/2">
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {question.description}
              </p>

              {/* ANSWER OPTIONS */}
              <div className="space-y-4">
                {question.answers.map((ans, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === letter;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'bg-[#D3F5D9] border-[#49BBBD] shadow-sm'
                          : 'bg-white border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAnswer(letter)}
                    >
                      <FaCheckCircle
                        className={`${isSelected ? 'text-[#49BBBD]' : 'text-gray-200'}`}
                        size={20}
                      />
                      <span
                        className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}
                      >
                        {letter}. {ans}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUESTION IMAGE AREA */}
            <div className="w-1/2 flex justify-center items-center">
              <div className="bg-white p-3 rounded-[2rem] shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={question.image}
                  alt="quiz-illustration"
                  className="rounded-[1.5rem] w-full h-[380px] object-cover"
                  // Hàm xử lý nếu ảnh không tồn tại hoặc sai đường dẫn
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://via.placeholder.com/600x400?text=Image+Not+Found';
                    target.className =
                      'rounded-[1.5rem] w-full h-[380px] object-contain bg-gray-100';
                  }}
                />
              </div>
            </div>
          </div>

          {/* LETTER ANSWER ROW */}
          <div className="mt-10 flex items-center justify-center gap-6">
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <button
                key={i}
                onClick={() => setSelectedAnswer(l)}
                className={`w-12 h-12 rounded-xl text-lg font-bold border-2 transition-all ${
                  selectedAnswer === l
                    ? 'bg-[#49BBBD] border-[#49BBBD] text-white scale-110 shadow-md'
                    : 'bg-white border-gray-200 text-[#49BBBD] hover:bg-[#D7F3F4]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-10 flex justify-between items-center">
            <button className="text-gray-500 font-semibold hover:text-gray-700">
              Skip Question
            </button>
            <button className="bg-[#49BBBD] text-white font-bold px-12 py-3 rounded-xl shadow-lg hover:bg-[#3EA8AA] transition-all transform active:scale-95">
              Next Question
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR (Giữ nguyên) */}
      <div className="w-1/4 bg-white p-5 rounded-xl shadow self-start sticky top-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">Course Contents</h3>
          <span className="text-[#49BBBD] text-xl">📅</span>
        </div>

        <div className="mt-2 mb-5">
          <div className="text-xs text-gray-600 mb-1">2/5 COMPLETED</div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#49BBBD] w-2/5 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {contents.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                item.active
                  ? 'border-[#49BBBD] bg-[#EFFFFF]'
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <h4 className="font-semibold text-gray-700">{item.title}</h4>
              <div className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <FaClock size={14} /> {item.duration}
              </div>
              {item.items && (
                <div className="ml-4 mt-2 text-sm text-gray-600 space-y-1">
                  {item.items.map((sub, sidx) => (
                    <div key={sidx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
