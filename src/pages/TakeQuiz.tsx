import { FaArrowLeft, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function TakeQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Fake question
  const question = {
    id: 1,
    title: 'Questions 1:',
    description:
      'TOTC’s school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.',
    image: '/quiz-preview.jpg',
    answers: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit, sed do',
      'Elusmod tempos Lorem ipsum',
      'Lorem ipsum dolor sit amet',
    ],
  };

  // Course content sidebar
  const contents = [
    {
      title: 'Get Started',
      duration: '1 Hour',
      active: false,
    },
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
            <button className="bg-[#49BBBD] p-3 rounded-lg text-white">
              <FaArrowLeft size={16} />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                UX/UI Design Confirence Meeting
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

          <button className="text-gray-400 hover:text-gray-600">⚙</button>
        </div>

        {/* QUESTION AREA */}
        <div className="mt-10 p-6">
          <h3 className="text-3xl font-bold text-[#49BBBD] mb-4">
            {question.title}
          </h3>

          <div className="flex gap-10 items-start">
            {/* QUESTION LEFT SIDE */}
            <div className="w-1/2">
              <p className="text-gray-600 leading-relaxed mb-6">
                {question.description}
              </p>

              {/* ANSWER OPTIONS */}
              <div className="space-y-4">
                {question.answers.map((ans, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A B C D

                  const isSelected = selectedAnswer === letter;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border 
                        hover:bg-gray-100 transition ${
                          isSelected
                            ? 'bg-[#D3F5D9] border-[#49BBBD]'
                            : 'bg-white border-gray-300'
                        }`}
                      onClick={() => setSelectedAnswer(letter)}
                    >
                      <FaCheckCircle
                        className={`${
                          isSelected ? 'text-[#49BBBD]' : 'text-gray-300'
                        }`}
                      />
                      <span className="text-gray-700">{ans}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUESTION IMAGE */}
            <div className="w-1/2">
              <img
                src={question.image}
                alt="preview"
                className="rounded-xl shadow-md object-cover"
              />
            </div>
          </div>

          {/* LETTER ANSWER ROW */}
          <div className="mt-10 flex items-center justify-center gap-10">
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <button
                key={i}
                onClick={() => setSelectedAnswer(l)}
                className={`px-4 py-2 rounded-lg text-lg font-semibold transition ${
                  selectedAnswer === l
                    ? 'bg-[#49BBBD] text-white'
                    : 'text-[#49BBBD] hover:bg-[#D7F3F4]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-10 text-right">
            <button className="bg-[#49BBBD] text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#3EA8AA] transition">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-1/4 bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">Course Contents</h3>
          <span className="text-[#49BBBD] text-xl">📅</span>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-2 mb-5">
          <div className="text-xs text-gray-600 mb-1">2/5 COMPLETED</div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#49BBBD] w-2/5 rounded-full"></div>
          </div>
        </div>

        {/* CONTENT ITEMS */}
        <div className="space-y-4">
          {contents.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                item.active
                  ? 'border-[#49BBBD] bg-[#EFFFFF]'
                  : 'border-gray-200 bg-white hover:bg-gray-100'
              }`}
            >
              <h4 className="font-semibold text-gray-700">{item.title}</h4>

              <div className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <FaClock size={14} /> {item.duration}
              </div>

              {/* Sub items */}
              {item.items && (
                <div className="ml-4 mt-2 text-sm text-gray-600 space-y-1">
                  {item.items.map((sub, sidx) => (
                    <div key={sidx}>• {sub}</div>
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
