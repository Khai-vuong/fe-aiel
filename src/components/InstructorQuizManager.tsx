import { useState } from 'react';
import BooksManager from './BooksManager';
import SlidesManager from './SlidesManager';
import {
  FaBook,
  FaFilePowerpoint,
  FaQuestionCircle,
  FaPlus,
} from 'react-icons/fa';

// =================================================================
// MOCK DATA
// =================================================================

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isActive: boolean;
}

const practiceQuizzes: Lesson[] = [
  {
    id: 1,
    title: 'Lesson 01 - Introduction about XD',
    duration: '30 mins',
    isActive: true,
  },
  {
    id: 2,
    title: 'Lesson 02 - Core Components',
    duration: '30 mins',
    isActive: false,
  },
  {
    id: 3,
    title: 'Lesson 03 - Prototyping basics',
    duration: '30 mins',
    isActive: true,
  },
  {
    id: 4,
    title: 'Lesson 04 - Advanced interactions',
    duration: '30 mins',
    isActive: false,
  },
  {
    id: 5,
    title: 'Lesson 05 - Design Systems',
    duration: '30 mins',
    isActive: true,
  },
  {
    id: 6,
    title: 'Lesson 06 - Exporting assets',
    duration: '30 mins',
    isActive: false,
  },
];

// =================================================================
// SIDEBAR
// =================================================================

interface SidebarProps {
  activeTab: 'Books' | 'Slides' | 'Quiz';
  setActiveTab: (tab: 'Books' | 'Slides' | 'Quiz') => void;
}

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-72 bg-white p-4 h-full border-r border-gray-200">
      <h2 className="text-lg font-bold text-gray-700 mb-6">
        Change Simplification
      </h2>

      <div className="space-y-3 mb-8">
        <SidebarButton
          icon={FaBook}
          label="Books"
          isActive={activeTab === 'Books'}
          onClick={() => setActiveTab('Books')}
          colorClass="bg-teal-500 text-white hover:bg-teal-600"
        />

        <SidebarButton
          icon={FaFilePowerpoint}
          label="Slides"
          isActive={activeTab === 'Slides'}
          onClick={() => setActiveTab('Slides')}
          colorClass="bg-orange-200 text-orange-800 hover:bg-orange-300"
        />

        <SidebarButton
          icon={FaQuestionCircle}
          label="Quiz"
          isActive={activeTab === 'Quiz'}
          onClick={() => setActiveTab('Quiz')}
          colorClass="bg-blue-200 text-blue-800 hover:bg-blue-300"
        />
      </div>

      {/* Practice Quiz */}
      <h3 className="text-md font-semibold text-gray-700 mt-8 mb-4 border-t pt-4">
        PRACTICE QUIZ
      </h3>

      <div className="space-y-3">
        {practiceQuizzes.map(quiz => (
          <PracticeQuizItem key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  colorClass,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg font-medium transition ${colorClass} ${
        isActive ? 'opacity-100 shadow' : 'opacity-80'
      }`}
    >
      <Icon className="mr-3" />
      {label}
    </button>
  );
}

function PracticeQuizItem({ quiz }: { quiz: Lesson }) {
  const baseStyle = quiz.isActive
    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    : 'bg-blue-100 text-blue-800 hover:bg-blue-200';

  return (
    <a
      href="#"
      className={`flex justify-between items-center text-sm p-2 rounded-lg transition ${baseStyle}`}
    >
      <span className="flex items-center">
        <FaBook size={12} className="mr-2" />
        {quiz.title}
      </span>
      <span className="text-xs opacity-80">{quiz.duration}</span>
    </a>
  );
}

// =================================================================
// QUIZ FORM
// =================================================================

function CreateQuizForm() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Create Quiz</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        {/* GENERAL INFO */}
        <h2 className="text-lg font-bold text-teal-600 border-b pb-2">
          Quiz Details
        </h2>

        <InputField
          label="Name"
          defaultValue="Adobe XD Auto - Animate: Your Guide to Creating"
        />

        <div className="flex space-x-4">
          <InputField label="Start Date / Time" className="flex-1" />
          <InputField label="End Date / Time" className="flex-1" />
        </div>

        <TextareaField label="Description" />

        {/* QUESTION */}
        <h2 className="text-lg font-bold text-teal-600 border-b pb-2 pt-4">
          Question 1
        </h2>

        <TextareaField
          label="Question 1"
          placeholder="Type your question here..."
        />

        {/* ANSWERS */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 space-y-3">
            <AnswerInput label="A" />
            <AnswerInput label="B" />
            <AnswerInput label="C" />
            <AnswerInput label="D" />
          </div>

          <div className="col-span-2 space-y-3 pl-4">
            <InputField label="Answer" placeholder="e.g., A, B, C, or D" />
            <InputField label="Points" placeholder="e.g., 10" />
          </div>
        </div>

        {/* ADD QUESTION */}
        <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium pt-4">
          <FaPlus className="mr-2" size={14} />
          Add question
        </button>

        {/* SAVE */}
        <div className="flex justify-end pt-6">
          <button className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-teal-600 transition">
            Save Now
          </button>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// INPUT HELPERS (FIXED TEXT COLOR)
// =================================================================

function InputField({
  label,
  defaultValue,
  className = '',
  placeholder = '',
}: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-lg 
          text-gray-800 placeholder-gray-500 
          focus:ring-teal-500 focus:border-teal-500
        "
      />
    </div>
  );
}

function TextareaField({ label, placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        rows={3}
        placeholder={placeholder}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-lg 
          text-gray-800 placeholder-gray-500
          focus:ring-teal-500 focus:border-teal-500
        "
      ></textarea>
    </div>
  );
}

function AnswerInput({ label }: any) {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium text-gray-700 w-4">{label}</span>
      <input
        type="text"
        className="
          flex-1 px-3 py-2 border border-gray-300 rounded-lg 
          text-gray-800 placeholder-gray-500
          focus:ring-teal-500 focus:border-teal-500
        "
      />
    </div>
  );
}

// =================================================================
// MAIN EXPORT
// =================================================================

export default function InstructorQuizManager() {
  const [activeTab, setActiveTab] = useState<'Books' | 'Slides' | 'Quiz'>(
    'Quiz'
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <div className="w-full bg-[#49BBBD] text-white py-4 px-8 shadow-md">
          <h1 className="text-xl font-bold">Materials & Quiz</h1>
        </div>

        {activeTab === 'Quiz' && <CreateQuizForm />}
        {activeTab === 'Books' && <BooksManager />}
        {activeTab === 'Slides' && <SlidesManager />}
      </div>
    </div>
  );
}
