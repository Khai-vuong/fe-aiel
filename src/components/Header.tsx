import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <header className="bg-[#3eb5b4] text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TKEDU
        </Link>

        {/* MENU */}
        <nav className="flex gap-6">
          <Link to="/">Home</Link>
          <span>Courses</span>
          <span>Careers</span>
          <span>Blog</span>
          <span>About Us</span>
        </nav>

        {/* Nếu chưa đăng nhập */}
        {!user && (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-1.5 bg-white text-[#3eb5b4] rounded-full font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-white/40 text-white rounded-full font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Nếu đã đăng nhập */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white text-[#3eb5b4] flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>

            {/* CLICK VÀO TÊN → PROFILE */}
            <Link
              to="/student/profile"
              className="font-semibold hover:underline"
            >
              {user.username}
            </Link>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-white/30 rounded-full hover:bg-white/40"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
