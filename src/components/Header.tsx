import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, [location.pathname]);

  // Màu chủ đạo: #49BBBD
  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-[#49BBBD] font-bold border-b-2 border-[#49BBBD]'
      : 'text-gray-600 font-medium hover:text-[#49BBBD]';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#49BBBD] text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-teal-100 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-xl font-black">TK</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-800">
            EDU<span className="text-[#49BBBD]">.</span>
          </span>
        </Link>

        {/* MAIN MENU */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`${isActive('/')} py-1 transition-all duration-200`}
          >
            Home
          </Link>

          {username && (
            <>
              <Link
                to="/courses/register"
                className={`${isActive('/courses/register')} py-1 transition-all duration-200`}
              >
                Register Courses
              </Link>
              <Link
                to="/instructor/dashboard"
                className={`${isActive('/instructor/dashboard')} py-1 transition-all duration-200`}
              >
                My Courses
              </Link>
              <Link
                to="/chat"
                className={`${isActive('/chat')} py-1 transition-all duration-200`}
              >
                Chat
              </Link>
              <Link
                to="/quiz"
                className={`${isActive('/quiz')} py-1 transition-all duration-200`}
              >
                Quiz
              </Link>
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
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-[#49BBBD] font-bold hover:text-[#3aa4a6] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-[#49BBBD] text-white rounded-full font-bold shadow-md shadow-teal-100 hover:bg-[#3aa4a6] hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
              <Link
                to="/student/profile"
                className="flex items-center gap-3 pr-2"
              >
                <div className="w-9 h-9 bg-[#49BBBD] text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                  {username.charAt(0).toUpperCase()}
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
          )}
        </div>
      </div>
    </header>
  );
}
