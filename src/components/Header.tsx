import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-white' : 'text-white/80';

  return (
    <header className="bg-[#3eb5b4] text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TKEDU
        </Link>

        {/* Menu */}
        <nav className="flex gap-6">
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
          <span className="text-white/70 cursor-default">Courses</span>
          <span className="text-white/70 cursor-default">Careers</span>
          <span className="text-white/70 cursor-default">Blog</span>
          <span className="text-white/70 cursor-default">About Us</span>
        </nav>

        {/* Buttons */}
        <div className="flex gap-3">
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
        </div>
      </div>
    </header>
  );
}
