import { useState } from 'react';
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBook,
  FaSchool,
} from 'react-icons/fa';

// Import Components
import InstructorQuizManager from '@/components/InstructorQuizManager';
import ClassManager from '@/components/ClassManager';
import StudentsManager from '@/components/StudentsManager';
import CoursesManager from '@/components/CoursesManager';
import DashboardOverview from '@/components/DashboardOverview';

export default function InstructorDashboard() {
  const [activeSection, setActiveSection] = useState('Overview');

  const navItems = [
    // DASHBOARD
    {
      id: 'Overview',
      label: 'Dashboard',
      icon: FaChalkboardTeacher,
      component: <DashboardOverview />,
    },

    // QUẢN LÝ KHÓA HỌC
    {
      id: 'Courses',
      label: 'Quản lý khóa học',
      icon: FaGraduationCap,
      component: <CoursesManager />,
    },

    // DANH SÁCH HỌC VIÊN
    {
      id: 'Students',
      label: 'Danh sách học viên',
      icon: FaUsers,
      component: <StudentsManager />,
    },

    // QUẢN LÝ LỚP HỌC
    {
      id: 'ClassManager',
      label: 'Quản lý lớp học',
      icon: FaSchool,
      component: <ClassManager />,
    },

    // QUIZ & TÀI LIỆU
    {
      id: 'QuizManager',
      label: 'Quiz & Tài liệu',
      icon: FaBook,
      component: <InstructorQuizManager />,
    },
  ];

  const currentComponent = navItems.find(
    item => item.id === activeSection
  )?.component;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          TKEDU
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition duration-200 ${activeSection === item.id
                ? 'bg-[#49BBBD] text-white shadow-lg'
                : 'hover:bg-gray-700 text-gray-300'
                }`}
            >
              <item.icon className="mr-3" size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-700">
            <FaCog className="mr-3" size={18} />
            Settings
          </button>

          <button className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 mt-2">
            <FaSignOutAlt className="mr-3" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find(item => item.id === activeSection)?.label}
          </h1>
        </header>

        {/* Render Component */}
        <main className="p-0">{currentComponent}</main>
      </div>
    </div>
  );
}
