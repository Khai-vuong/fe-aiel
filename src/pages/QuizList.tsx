import { Link } from 'react-router-dom';

export default function QuizList() {
  const quizzes = [
    { id: 'quiz1', name: 'Math Quiz', deadline: '2025-01-05' },
    { id: 'quiz2', name: 'Science Quiz', deadline: '2025-01-10' },
    { id: 'quiz3', name: 'History Quiz', deadline: '2025-01-15' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-[#49BBBD] mb-6">
        Available Quizzes
      </h1>

      <div className="space-y-6">
        {quizzes.map(quiz => (
          <Link
            key={quiz.id}
            to="/take-quiz"
            className="block p-6 rounded-xl shadow border hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              {quiz.name}
            </h2>

            <p className="text-gray-500 mt-1">Deadline: {quiz.deadline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
