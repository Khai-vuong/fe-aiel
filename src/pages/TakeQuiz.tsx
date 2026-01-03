import { FaArrowLeft, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TakeQuiz() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 1. Sửa đường dẫn ảnh đúng theo cấu trúc public/img/
  const question = {
    id: 1,
    title: 'Questions 1:',
    description:
      'TOTC’s school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.',
    image: '/img/quiz-preview.jpg',
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
      <div className="w-3/4">
        {/* Header */}
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#49BBBD] p-3 rounded-lg text-white hover:bg-[#3aa4a6] transition-colors"
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
                  <FaClock size={14} /> 5h 30min
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">⚙</button>
        </div>

        {/* QUESTION AREA */}
        <div className="mt-10 p-6">
          <h3 className="text-3xl font-bold text-[#49BBBD] mb-4">
            {question.title}
          </h3>
          <div className="flex gap-10 items-start">
            <div className="w-1/2">
              <p className="text-gray-600 leading-relaxed mb-6">
                {question.description}
              </p>
              <div className="space-y-4">
                {question.answers.map((ans, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === letter;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'bg-[#D3F5D9] border-[#49BBBD]'
                          : 'bg-white border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAnswer(letter)}
                    >
                      <FaCheckCircle
                        className={`${isSelected ? 'text-[#49BBBD]' : 'text-gray-300'}`}
                      />
                      <span className="text-gray-700">{ans}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Phần hiện ảnh đã sửa khung viền và đường dẫn */}
            <div className="w-1/2 flex justify-center">
              <div className="bg-white p-3 rounded-[2rem] shadow-xl border border-gray-100">
                <img
                  src={question.image}
                  alt="quiz preview"
                  className="rounded-[1.5rem] w-full h-[350px] object-cover"
                  onError={e => {
                    console.error(
                      'Lỗi: Không tìm thấy ảnh tại',
                      question.image
                    );
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/500x350?text=Check+Public+Img+Folder';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-10">
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <button
                key={i}
                onClick={() => setSelectedAnswer(l)}
                className={`px-4 py-2 rounded-lg text-lg font-semibold transition ${
                  selectedAnswer === l
                    ? 'bg-[#49BBBD] text-white scale-110 shadow-md'
                    : 'text-[#49BBBD] hover:bg-[#D7F3F4]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-10 text-right">
            <button className="bg-[#49BBBD] text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#3EA8AA] transition active:scale-95">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-1/4 bg-white p-5 rounded-xl shadow self-start sticky top-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          Course Contents
        </h3>
        <div className="mb-5">
          <div className="text-xs text-gray-600 mb-1 uppercase font-bold">
            2/5 Completed
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#49BBBD] w-2/5 rounded-full transition-all duration-500"></div>
          </div>
        </div>
        <div className="space-y-4">
          {contents.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 transition ${
                item.active
                  ? 'border-[#49BBBD] bg-[#EFFFFF]'
                  : 'border-gray-50 bg-white hover:bg-gray-100'
              }`}
            >
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              <div className="text-gray-500 text-xs flex items-center gap-2 mt-1">
                <FaClock size={12} /> {item.duration}
              </div>
              {item.items && (
                <div className="ml-4 mt-2 text-xs text-gray-600 space-y-1">
                  {item.items.map((sub, sidx) => (
                    <div key={sidx} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-[#49BBBD] rounded-full"></div>
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
