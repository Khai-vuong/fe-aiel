import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usersService from '../services/users.service';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    try {
      const data = await usersService.login({
        username: username,
        hashed_password: password,
      });

      // 1. Lưu các thông tin cơ bản
      localStorage.setItem('token', data.userToken);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('roleId', data.roleId);

      // 2. Lấy thông tin profile để có uid
      try {
        const profile = await usersService.getMyProfile();
        const serverId = profile.uid;

        if (serverId) {
          localStorage.setItem('studentId', serverId);
          console.log('✅ Đã lưu studentId:', serverId);
        }
      } catch (profileErr) {
        console.warn('⚠️ Không thể lấy profile sau login:', profileErr);
      }

      toast.success('Đăng nhập thành công!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      console.error('Lỗi login:', err);
      toast.error(err.response?.data?.message || 'Sai thông tin đăng nhập!');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 px-10 py-10 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10 relative z-10">
        <div className="flex justify-center items-center">
          <img
            src="/img/login.png"
            className="rounded-3xl w-[90%] shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in"
            alt="Ảnh đăng nhập"
          />
        </div>

        <div className="flex flex-col justify-center bg-white/70 backdrop-blur-xl px-10 py-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-shadow duration-300 animate-fade-in">
          <h2 className="text-center text-gray-800 text-2xl font-bold mb-8 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Chào mừng đến TKEDU!
          </h2>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm font-semibold">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="
                w-full mt-2 px-4 py-3 
                border border-teal-200/50 
                rounded-full 
                bg-white/50 backdrop-blur-sm text-black
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80
                transition-all duration-200
              "
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm font-semibold">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="
                  w-full mt-2 px-4 py-3 
                  border border-teal-200/50 
                  rounded-full 
                  bg-white/50 backdrop-blur-sm text-black
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80
                  transition-all duration-200
                "
              />
              <span
                className="absolute inset-y-0 right-5 flex items-center text-gray-600 cursor-pointer hover:text-teal-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer transition-colors">
              <input type="checkbox" className="cursor-pointer" />
              Ghi nhớ đăng nhập
            </label>

            <button
              className="
                text-sm px-5 py-2 
                rounded-full 
                bg-gradient-to-r from-teal-400 to-emerald-400 text-white
                hover:from-teal-500 hover:to-emerald-500
                transition-all duration-300 shadow-md hover:shadow-lg
                font-semibold
              "
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="
              w-full py-3 
              bg-gradient-to-r from-teal-500 to-emerald-500 text-white 
              rounded-full font-semibold font-bold
              hover:from-teal-600 hover:to-emerald-600
              transition-all duration-300 shadow-lg hover:shadow-xl
              active:scale-95
            "
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
