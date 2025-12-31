import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, [location.pathname]); // cập nhật mỗi khi đổi trang

  const isActive = (path: string) =>
    location.pathname === path ? 'text-white font-semibold' : 'text-white/80';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <header className="bg-gradient-to-r from-[#3eb5b4] via-[#2d9a9a] to-[#3eb5b4] text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2">
          <span className="bg-white text-[#3eb5b4] px-3 py-1 rounded-lg shadow-md">TK</span>
          <span className="tracking-wide">EDU</span>
        </Link>

        {/* MAIN MENU */}
        <nav className="flex gap-6 items-center">
          <Link
            to="/"
            className={`${isActive('/')} hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10`}
          >
            Home
          </Link>

          {/* Menu dành cho Student khi đã đăng nhập */}
          {username && (
            <>
              <Link
                to="/courses/register"
                className={`${isActive('/courses/register')} hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                Register Courses
              </Link>

              <Link
                to="/instructor/dashboard"
                className={`${isActive('/instructor/dashboard')} hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                My Courses
              </Link>

              <Link
                to="/chat"
                className={`${isActive('/chat')} hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                Chat
              </Link>

              <Link
                to="/quiz"
                className={`${isActive('/quiz')} hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10`}
              >
                Quiz
              </Link>
            </>
          )}

          {/* Menu hiện khi CHƯA đăng nhập */}
          {!username && (
            <>
              <span className="text-white/80 cursor-pointer hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10">
                Careers
              </span>
              <span className="text-white/80 cursor-pointer hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10">
                Blog
              </span>
              <span className="text-white/80 cursor-pointer hover:text-white transition-all duration-200 hover:scale-110 px-3 py-2 rounded-lg hover:bg-white/10">
                About Us
              </span>
            </>
          )}
        </nav>

        {/* USER AREA */}
        <div className="flex gap-3 items-center">
          {!username ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 bg-white text-[#3eb5b4] rounded-full font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 border-2 border-white/40 hover:border-white/60 hover:scale-105 transition-all duration-200 shadow-md"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/student/profile"
                className="flex items-center gap-2 hover:scale-105 transition-all duration-200 px-3 py-2 rounded-full hover:bg-white/10"
              >
                <div className="w-9 h-9 bg-white text-[#3eb5b4] rounded-full flex items-center justify-center font-bold shadow-md hover:shadow-lg transition-shadow">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold">{username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-red-500/90 border-2 border-white/40 hover:border-red-400 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
