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
    <header className="bg-[#3eb5b4] text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          TKEDU
        </Link>

        {/* MAIN MENU */}
        <nav className="flex gap-6">
          <Link to="/" className={isActive('/')}>
            Home
          </Link>

          {/* Menu dành cho Student khi đã đăng nhập */}
          {username && (
            <>
              <Link
                to="/courses/register"
                className={isActive('/courses/register')}
              >
                Register Courses
              </Link>

              <Link
                to="/instructor/dashboard"
                className={isActive('/instructor/dashboard')}
              >
                My Courses
              </Link>

              <Link to="/chat" className={isActive('/chat')}>
                Chat
              </Link>

              <Link to="/quiz" className={isActive('/quiz')}>
                Quiz
              </Link>
            </>
          )}

          {/* Menu hiện khi CHƯA đăng nhập */}
          {!username && (
            <>
              <span className="text-white/80 cursor-pointer">Careers</span>
              <span className="text-white/80 cursor-pointer">Blog</span>
              <span className="text-white/80 cursor-pointer">About Us</span>
            </>
          )}
        </nav>

        {/* USER AREA */}
        <div className="flex gap-3 items-center">
          {!username ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 bg-white text-[#3eb5b4] rounded-full font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 bg-white/40 text-white rounded-full font-medium hover:bg-white/50"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/student/profile" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white text-[#3eb5b4] rounded-full flex items-center justify-center font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold">{username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-white/40 text-white rounded-full font-medium hover:bg-white/50"
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
