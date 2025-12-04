import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // BẮT BUỘC: làm FE render lại Header
    window.location.reload();

    // hoặc navigate("/")
    // navigate("/login");
  };

  return (
    <header className="bg-[#3eb5b4] text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          TKEDU
        </Link>

        <nav className="flex gap-6">
          <Link to="/">Home</Link>
          <span>Courses</span>
          <span>Careers</span>
          <span>Blog</span>
          <span>About Us</span>
        </nav>

        {/* Nếu CHƯA đăng nhập → Login + Register */}
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

        {/* Nếu ĐÃ đăng nhập → Avatar + Username + Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white text-[#3eb5b4] flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <span className="font-semibold">{user.username}</span>

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
