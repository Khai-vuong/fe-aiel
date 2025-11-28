import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-10">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%] shadow-md" />
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col justify-center">
          {/* Title */}
          <h2 className="text-center text-gray-700 text-xl font-semibold mb-4">
            Welcome to TKEDU!
          </h2>

          {/* ROLE SELECT */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700 focus:ring-2 focus:ring-[#30B8B2]"
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
              className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-[#30B8B2]"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="w-full mt-1 px-4 py-3 border border-[#30B8B2] rounded-full text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-[#30B8B2]"
              />
              <span
                className="absolute top-4 right-5 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-sm text-gray-600 hover:text-gray-800">
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button className="w-full py-3 bg-[#49BBBD] text-white rounded-full font-semibold hover:bg-[#3aa9ad] transition shadow-md">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
