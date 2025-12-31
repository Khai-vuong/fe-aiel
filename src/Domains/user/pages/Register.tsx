import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form is valid, submitting...', {
        role,
        email,
        username,
        phone,
        password,
      });
      // TODO: Add API call here
      alert('Registration successful!');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white px-10 py-6">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%]" />
        </div>

        {/* RIGHT FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col justify-center">
          <h2 className="text-center text-gray-700 text-lg mb-3">
            Welcome to TKEDU..!
          </h2>

          {/* ROLE */}
          <div className="mb-2">
            <label className="text-gray-700 text-sm font-medium">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-[#49BBBD] rounded-full 
                         text-black text-sm focus:ring-2 focus:ring-[#49BBBD] focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="lecture">Lecturer</option>
            </select>
          </div>

          {/* EMAIL & USERNAME - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                           ${errors.email ? 'border-red-500' : 'border-[#49BBBD]'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">User name</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                           ${errors.username ? 'border-red-500' : 'border-[#49BBBD]'}`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.username}</p>
              )}
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div className="mb-2">
            <label className="text-gray-700 text-sm font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                         ${errors.phone ? 'border-red-500' : 'border-[#49BBBD]'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.phone}</p>
            )}
          </div>

          {/* PASSWORD & CONFIRM PASSWORD - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                             ${errors.password ? 'border-red-500' : 'border-[#49BBBD]'}`}
                />
                <span
                  className="absolute top-3 right-4 text-gray-600 cursor-pointer text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                             ${errors.confirmPassword ? 'border-red-500' : 'border-[#49BBBD]'}`}
                />
                <span
                  className="absolute top-3 right-4 text-gray-600 cursor-pointer text-sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-2.5 mt-3 bg-[#49BBBD] text-white rounded-full 
                             font-semibold hover:bg-[#3aa7a8] transition shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
