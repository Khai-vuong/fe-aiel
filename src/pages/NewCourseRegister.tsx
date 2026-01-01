import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft,
  FaSpinner,
  FaBook,
  FaPlusCircle,
  FaGraduationCap,
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
} from 'react-icons/fa';

interface Course {
  cid: string;
  code: string;
  name: string;
  credits: number;
  isRegistered?: boolean;
  enrollments?: any[];
}

export default function NewCourseRegister() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.courses || [];
      setCourses(data);
      setError(null);
    } catch (error) {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (cid: string, courseName: string) => {
    const confirmRegister = window.confirm(
      `Bạn có chắc chắn muốn đăng ký môn: ${courseName}?`
    );
    if (!confirmRegister) return;

    try {
      setRegisteringId(cid);
      const token = localStorage.getItem('token');

      await axios.post(
        `http://localhost:3000/courses/${cid}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        }
      );

      alert(`Đăng ký môn học ${courseName} thành công!`);

      setCourses(prev =>
        prev.map(c => (c.cid === cid ? { ...c, isRegistered: true } : c))
      );
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
      alert(`Lỗi: ${msg}`);
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredCourses = courses.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9]">
      <div className="w-full bg-gradient-to-br from-[#49BBBD] via-[#3aa4a6] to-[#2C7879] pt-10 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button
                onClick={() => navigate('/courses/register')}
                className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all mb-4 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-sm"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm tracking-wide">QUAY LẠI HỆ THỐNG</span>
              </button>
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                Đăng ký học phần <span className="text-teal-100">mới</span>
              </h1>
            </div>

            <div className="relative w-full md:w-[400px] group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/70 group-focus-within:text-[#49BBBD] z-10 transition-colors">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Tìm tên môn hoặc mã học phần..."
                className="w-full pl-12 pr-6 py-4 bg-white/15 border border-white/30 rounded-2xl text-white placeholder:text-white/60 outline-none focus:bg-white focus:text-gray-800 focus:placeholder:text-gray-400 transition-all backdrop-blur-xl shadow-inner focus:ring-4 focus:ring-black/5"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
            <FaSpinner className="animate-spin text-[#49BBBD]" size={40} />
            <p className="mt-4 text-gray-500 font-bold tracking-widest text-sm uppercase">
              Đang tải...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white p-16 rounded-[2.5rem] shadow-xl text-center">
            <FaExclamationTriangle className="text-red-500 size-10 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              Rất tiếc!
            </h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black transition-all shadow-lg"
            >
              THỬ LẠI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
            {filteredCourses.map(course => {
              const isAlreadyRegistered =
                course.isRegistered ||
                (course.enrollments && course.enrollments.length > 0);

              return (
                <div
                  key={course.cid}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-14 h-14 bg-teal-50 rounded-[1.2rem] flex items-center justify-center text-[#49BBBD] group-hover:bg-[#49BBBD] group-hover:text-white transition-all transform group-hover:rotate-6">
                        <FaBook size={24} />
                      </div>
                      {isAlreadyRegistered ? (
                        <span className="flex items-center gap-1 px-4 py-1.5 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200">
                          <FaCheckCircle /> Đã đăng ký
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-transparent">
                          {course.code}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-gray-800 leading-tight group-hover:text-[#3aa4a6] transition-colors line-clamp-2 min-h-[3.5rem]">
                      {course.name}
                    </h3>

                    <div className="mt-6 flex items-center gap-3 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                      <FaGraduationCap className="text-[#49BBBD]" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                        {course.credits} Tín chỉ
                      </span>
                    </div>
                  </div>

                  {isAlreadyRegistered ? (
                    <button
                      disabled
                      className="mt-10 w-full py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 bg-green-50 text-green-600 border border-green-100 cursor-default"
                    >
                      <span className="tracking-widest text-xs font-black">
                        BẠN ĐÃ ĐĂNG KÝ
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled={registeringId === course.cid}
                      onClick={() => handleRegister(course.cid, course.name)}
                      className={`mt-10 w-full py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg transition-all duration-300 active:scale-95 ${
                        registeringId === course.cid
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-[#49BBBD] hover:shadow-[#49BBBD]/30 shadow-gray-200'
                      }`}
                    >
                      {registeringId === course.cid ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <span className="tracking-widest text-xs">
                            ĐĂNG KÝ NGAY
                          </span>
                          <FaPlusCircle className="text-lg opacity-70" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
