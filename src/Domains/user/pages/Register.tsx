import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usersService from '../services/users.service';
import type { RegisterDto } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value: string) => {
    let error = '';

    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email format';
        }
        break;

      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;

      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]{10,}$/.test(value)) {
          error = 'Invalid phone number';
        }
        break;

      case 'major':
        if (role === 'student' && !value.trim()) {
          error = 'Major is required for students';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (password !== value) {
          error = 'Passwords do not match';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

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

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Major validation for students
    if (role === 'student' && !major.trim()) {
      newErrors.major = 'Major is required for students';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare personal info JSON
      const personalInfo = {
        phone: phone,
        address: '', // Can be added later in profile
        dob: '', // Can be added later in profile
      };

      // Capitalize role to match API expectation
      const capitalizedRole = role === 'student' ? 'Student' : 'Lecturer';

      const registerData: RegisterDto = {
        username: username.trim(),
        hashed_password: password,
        email: email.trim(),
        role: capitalizedRole as 'Student' | 'Lecturer' | 'Admin',
        name: name.trim(),
        personal_info_json: JSON.stringify(personalInfo),
        ...(role === 'student' && { major: major.trim() }),
      };

      const response = await usersService.register(registerData);

      // Registration successful
      toast.success(`Registration successful! Welcome ${response.username}`);

      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 px-10 py-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl w-full grid grid-cols-2 gap-10 relative z-10">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <img src="/img/login.png" className="rounded-3xl w-[90%] shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in" />
        </div>

        {/* RIGHT FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-white/70 backdrop-blur-xl px-10 py-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-shadow duration-300 animate-fade-in">
          <h2 className="text-center text-gray-800 text-2xl font-bold mb-8 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Chào mừng đến TKEDU!
          </h2>

          {/* FULL NAME & USERNAME - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-semibold">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={e => handleBlur('name', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                           focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                           ${errors.name && touched.name ? 'border-red-500' : 'border-teal-200/50'}`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={e => handleBlur('email', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                         text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                         ${errors.email && touched.email ? 'border-red-500' : 'border-teal-200/50'}`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.email}</p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-2">
            <label className="text-gray-700 text-sm font-semibold">
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onBlur={e => handleBlur('username', e.target.value)}
              className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                           focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                           ${errors.username && touched.username ? 'border-red-500' : 'border-teal-200/50'}`}
            />
            {errors.username && touched.username && (
              <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.username}</p>
            )}


          </div>

          {/* PHONE NUMBER & MAJOR - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-semibold">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={e => handleBlur('phone', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                           focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                           ${errors.phone && touched.phone ? 'border-red-500' : 'border-teal-200/50'}`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.phone}</p>
              )}
            </div>

            {role === 'student' && (
              <div>
                <label className="text-gray-700 text-sm font-semibold">Chuyên ngành</label>
                <input
                  type="text"
                  placeholder="Nhập chuyên ngành"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  onBlur={e => handleBlur('major', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                             ${errors.major && touched.major ? 'border-red-500' : 'border-teal-200/50'}`}
                />
                {errors.major && touched.major && (
                  <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.major}</p>
                )}
              </div>
            )}
          </div>

          {/* PASSWORD & CONFIRM PASSWORD - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-semibold">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={e => handleBlur('password', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                             ${errors.password && touched.password ? 'border-red-500' : 'border-teal-200/50'}`}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 cursor-pointer text-sm hover:text-teal-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onBlur={e => handleBlur('confirmPassword', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-400 bg-white/50 backdrop-blur-sm
                             focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/80 transition-all duration-200
                             ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-teal-200/50'}`}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 cursor-pointer text-sm hover:text-teal-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full 
                             font-semibold font-bold hover:from-teal-600 hover:to-emerald-600 
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             disabled:bg-gray-400 disabled:cursor-not-allowed
                             active:scale-95"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
