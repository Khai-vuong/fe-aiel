import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3000/users/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          hashed_password: password,
        }),
      });

      if (!res.ok) {
        setErrorMsg('Incorrect username or password');
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem('token', data);
      localStorage.setItem('role', role);

      setLoading(false);

      navigate('/');
    } catch (error) {
      setErrorMsg('Cannot connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-10">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%] shadow-md" />
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col justify-center">
          <h2 className="text-center text-gray-700 text-xl font-semibold mb-4">
            Welcome to TKEDU..!
          </h2>

          {/* ROLE SELECT */}
          <div className="mb-4">
            <label className="text-gray-700 text-sm">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black focus:ring-2 focus:ring-[#49BBBD]"
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
              className="w-full mt-1 px-4 py-3 border border-[#49BBBD] rounded-full 
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD]"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span
                className="absolute top-4 right-5 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#49BBBD] text-white rounded-full font-semibold 
                       hover:bg-[#3aa7a8] transition shadow-md"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
