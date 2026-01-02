import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registerUser } from '../services/usersService';
import type { RegisterRequestData } from '../types';

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

      const registerData: RegisterRequestData = {
        username: username.trim(),
        email: email.trim(),
        hashed_password: password,
        role: capitalizedRole as 'Student' | 'Lecturer',
        name: name.trim(),
        personal_info_json: JSON.stringify(personalInfo),
        ...(role === 'student' && { major: major.trim() }),
      };

      const response = await registerUser(registerData);

      // Registration successful
      alert(`Registration successful! Welcome ${response.username}`);

      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          <h2 className="text-center text-gray-700 text-xl font-semibold mb-4">
            Welcome to TKEDU!
          </h2>

          {/* ROLE */}
          <div className="mb-2">
            <label className="text-gray-700 text-sm font-medium">Select Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 pl-4 pr-10 py-2 border border-[#49BBBD] rounded-full 
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
                onBlur={e => handleBlur('email', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                           ${errors.email && touched.email ? 'border-red-500' : 'border-[#49BBBD]'}`}
              />
              {errors.email && touched.email && (
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
                onBlur={e => handleBlur('username', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                           ${errors.username && touched.username ? 'border-red-500' : 'border-[#49BBBD]'}`}
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.username}</p>
              )}
            </div>
          </div>

          {/* FULL NAME */}
          <div className="mb-2">
            <label className="text-gray-700 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={e => handleBlur('name', e.target.value)}
              className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                         text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                         ${errors.name && touched.name ? 'border-red-500' : 'border-[#49BBBD]'}`}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.name}</p>
            )}
          </div>

          {/* PHONE NUMBER & MAJOR - TWO COLUMNS */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-gray-700 text-sm font-medium">Phone Number</label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onBlur={e => handleBlur('phone', e.target.value)}
                className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                           text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                           ${errors.phone && touched.phone ? 'border-red-500' : 'border-[#49BBBD]'}`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs mt-0.5 ml-2">{errors.phone}</p>
              )}
            </div>

            {role === 'student' && (
              <div>
                <label className="text-gray-700 text-sm font-medium">Major</label>
                <input
                  type="text"
                  placeholder="Enter Major"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  onBlur={e => handleBlur('major', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                             ${errors.major && touched.major ? 'border-red-500' : 'border-[#49BBBD]'}`}
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
              <label className="text-gray-700 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={e => handleBlur('password', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                             ${errors.password && touched.password ? 'border-red-500' : 'border-[#49BBBD]'}`}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 cursor-pointer text-sm"
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
              <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onBlur={e => handleBlur('confirmPassword', e.target.value)}
                  className={`w-full mt-1 px-4 py-2 border rounded-full text-sm
                             text-black placeholder-gray-500 focus:ring-2 focus:ring-[#49BBBD] focus:outline-none
                             ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-[#49BBBD]'}`}
                />
                <span
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 cursor-pointer text-sm"
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
            className="w-full py-2.5 mt-3 bg-[#49BBBD] text-white rounded-full 
                             font-semibold hover:bg-[#3aa7a8] transition shadow-md hover:shadow-lg
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
