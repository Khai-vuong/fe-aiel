import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BotMessageSquare, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { NotiService } from '../Domains/notifications/services/notifications.service';

const notiService = new NotiService();

type HeaderProps = {
  onToggleAiSidebar: () => void;
};

export default function Header({ onToggleAiSidebar }: HeaderProps) {
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    setUsername(localStorage.getItem('username'));

    // Fetch unread count if user is logged in
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const result = await notiService.getUnreadNotificationsCount();
          setUnreadCount(result.count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      }
    };

    fetchUnreadCount();

    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Màu chủ đạo: #49BBBD
  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-[#49BBBD] font-bold border-b-2 border-[#49BBBD]'
      : 'text-gray-600 font-medium hover:text-[#49BBBD]';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    toast.success('Đăng xuất thành công!');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#49BBBD] text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-teal-100 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-xl font-black">TK</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-800">
              EDU<span className="text-[#49BBBD]">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onToggleAiSidebar}
            className="flex items-center gap-2 rounded-full border border-[#49BBBD]/20 bg-[#49BBBD]/10 px-4 py-2 text-sm font-semibold text-[#0f6b6c] transition-all hover:bg-[#49BBBD] hover:text-white hover:shadow-md hover:shadow-teal-100"
            title="Mở trợ lý AI"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Trợ lý AI</span>
          </button>
        </div>

        {/* MAIN MENU */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`${isActive('/')} py-1 transition-all duration-200`}
          >
            Trang chủ
          </Link>

          {username && (
            <>
              <Link
                to="/courses/register"
                className={`${isActive('/courses/register')} py-1 transition-all duration-200`}
              >
                Học phần
              </Link>
              <Link
                to="/classes/me"
                className={`${isActive('/instructor/dashboard')} py-1 transition-all duration-200`}
              >
                Lớp học của tôi
              </Link>
              {userRole === 'Admin' && (
                <Link
                  to="/courses/catalog"
                  className={`${isActive('/courses/catalog')} py-1 transition-all duration-200`}
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          {!username && (
            <>
              <span className="text-gray-600 hover:text-[#49BBBD] cursor-pointer transition-colors">
                Careers
              </span>
              <span className="text-gray-600 hover:text-[#49BBBD] cursor-pointer transition-colors">
                Blog
              </span>
              <span className="text-gray-600 hover:text-[#49BBBD] cursor-pointer transition-colors">
                About Us
              </span>
            </>
          )}
        </nav>

        {/* USER AREA */}
        <div className="flex gap-4 items-center">
          {!username ? (
            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
              <Link
                to="/login"
                className={`px-5 py-2 rounded-full font-bold transition-all ${location.pathname === '/login'
                  ? 'bg-[#49BBBD] text-white shadow-md shadow-teal-100'
                  : 'text-gray-600 hover:text-[#49BBBD] hover:bg-gray-100'
                  }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-5 py-2 rounded-full font-bold transition-all ${location.pathname === '/register'
                  ? 'bg-[#49BBBD] text-white shadow-md shadow-teal-100'
                  : 'text-gray-600 hover:text-[#49BBBD] hover:bg-gray-100'
                  }`}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              {/* Bot Chat Icon */}
              <Link
                to="/chat"
                className="p-2 bg-[#49BBBD] text-white rounded-full shadow-md shadow-teal-100 hover:bg-[#3aa4a6] hover:shadow-lg transition-all"
                title="Chat with AI"
              >
                <BotMessageSquare className="w-5 h-5 text-white" />
              </Link>

              {/* Notification Icon */}
              <Link
                to="/notifications"
                className="relative p-2 bg-white text-gray-600 rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all border border-gray-100"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                <Link
                  to="/student/profile"
                  className="flex items-center gap-3 pr-2"
                >
                  <div className="w-9 h-9 bg-[#49BBBD] text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-gray-400 leading-none font-medium text-left">
                      Welcome
                    </p>
                    <span className="text-sm font-bold text-gray-700">
                      {username}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
