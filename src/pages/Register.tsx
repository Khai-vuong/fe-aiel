import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-10">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%]" />
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col justify-center">
          <h2 className="text-center text-gray-700 text-lg mb-4">
            Welcome to TKEDU..!
          </h2>

          {/* ROLE */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
            >
              <option value="student">Student</option>
              <option value="lecture">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter your Email Address"
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
            />
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">User name</label>
            <input
              type="text"
              placeholder="Enter your User name"
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your Phone Number"
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
              />
              <span
                className="absolute top-4 right-5 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            className="w-full py-3 mt-4 bg-[#49BBBD] text-white rounded-full 
                             font-semibold hover:bg-[#3aa7a8] transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
