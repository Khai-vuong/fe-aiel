import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaUsers,
} from 'react-icons/fa';

// Import Components
import StudentsManager from '@/components/StudentsManager';
import DashboardOverview from '@/components/DashboardOverview';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Overview');

  const navItems = [
    // DASHBOARD
    {
      id: 'Overview',
      label: 'Dashboard',
      icon: FaChalkboardTeacher,
      component: <DashboardOverview />,
    },

    // DANH SÁCH HỌC VIÊN
    {
      id: 'Students',
      label: 'Danh sách học viên',
      icon: FaUsers,
      component: <StudentsManager />,
    },
  ];

  const currentComponent = navItems.find(
    item => item.id === activeSection
  )?.component;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* MAIN CONTENT */}
      <div className="w-full">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-[#49BBBD] flex items-center gap-2 font-medium"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {navItems.find(item => item.id === activeSection)?.label}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-between items-center mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${activeSection === item.id
                    ? 'bg-[#49BBBD] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <item.icon className="mr-2" size={16} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => console.log('Export clicked')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium text-sm">Export</span>
            </button>
          </div>
        </header>

        {/* Render Component */}
        <main className="p-0">{currentComponent}</main>
      </div>
    </div>
  );
}
