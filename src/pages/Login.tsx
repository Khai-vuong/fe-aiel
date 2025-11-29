import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// -------- SHA-256 HASH FUNCTION ----------
async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// -----------------------------------------

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ username & password!');
      return;
    }

    // HASH MẬT KHẨU
    const hashed = await hashPassword(password);
    console.log('🔐 SHA-256:', hashed);

    try {
      const response = await fetch(
        'http://localhost:3000/api/users/auth_login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            hashed_password: hashed,
          }),
        }
      );

      const data = await response.json();
      console.log('Đăng nhập OK:', data);

      if (response.ok) {
        alert('Đăng nhập thành công!');
        // TODO: điều hướng tuỳ role -> dashboard
      } else {
        alert('Sai thông tin đăng nhập');
      }
    } catch (err) {
      console.error('Lỗi login:', err);
      alert('Không thể kết nối server!');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-10">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%] shadow-md" />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-center text-gray-700 text-xl font-semibold mb-4">
            Welcome to TKEDU!
          </h2>

          {/* ROLE */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700"
            >
              <option value="student">Student</option>
              <option value="lecture">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">User name</label>
            <input
              type="text"
              placeholder="Enter your User name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700"
              />
              <span
                className="absolute top-4 right-5 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#49BBBD] text-white rounded-full font-semibold hover:bg-[#3aa9ad] transition shadow-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
