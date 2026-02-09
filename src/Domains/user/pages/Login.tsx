import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // Mặc định là student

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ username & password!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          hashed_password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // 1. Lưu các thông tin cơ bản (Code cũ)
        localStorage.setItem('token', data.userToken);
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', data.role);

        // ---------------------------------------------------------
        // 2. 👇 [QUAN TRỌNG] Logic mới thêm để Fix lỗi Quiz History
        // ---------------------------------------------------------
        // Kiểm tra các trường có thể chứa ID từ Backend
        const serverId =
          data.id ||
          data.userId ||
          data.studentId ||
          (data.user && data.user.id);

        if (serverId) {
          localStorage.setItem('studentId', serverId);
          console.log('✅ Đã lưu studentId:', serverId);
        } else {
          console.warn(
            '⚠️ Backend không trả về ID. Tính năng lịch sử có thể không hoạt động.'
          );
          // Fallback: Nếu không có ID, tạm lưu username làm ID (nếu hệ thống cho phép)
          // localStorage.setItem('studentId', username);
        }
        // ---------------------------------------------------------

        toast.success('Đăng nhập thành công!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        toast.error('Sai thông tin đăng nhập');
      }
    } catch (err) {
      console.error('Lỗi login:', err);
      toast.error('Không thể kết nối server!');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <img
            src="/img/login.png"
            className="rounded-3xl w-[90%] shadow-md"
            alt="Login Banner"
          />
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
              className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full bg-white text-black"
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
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="
                w-full mt-1 px-4 py-3 
                border border-[#30B8B2] 
                rounded-full 
                bg-white text-black
              "
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
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="
                  w-full mt-1 px-4 py-3 
                  border border-[#30B8B2] 
                  rounded-full 
                  bg-white text-black
                "
              />
              <span
                className="absolute inset-y-0 right-5 flex items-center text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              className="
                text-sm px-5 py-2 
                rounded-full 
                bg-[#49BBBD] text-white 
                hover:bg-[#3AA9AD] 
                transition shadow
              "
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="
              w-full py-3 
              bg-[#49BBBD] text-white 
              rounded-full font-semibold 
              hover:bg-[#3AA9AD] 
              transition shadow-md
            "
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
