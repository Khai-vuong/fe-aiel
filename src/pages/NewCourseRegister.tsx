import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSpinner,
  FaBook,
  FaPlusCircle,
  FaGraduationCap,
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
  FaTrashAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import courseService from '../Domains/course/services/course.service';

interface Course {
  cid: string;
  code: string;
  name: string;
  credits?: number;
  isRegistered?: boolean;
  enrollments?: any[];
}

export default function NewCourseRegister() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      setCourses(response);
      setError(null);
    } catch (err: any) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRegister = async (cid: string, courseName: string) => {
    if (!window.confirm(`Xác nhận đăng ký môn: ${courseName}?`)) return;
    try {
      setProcessingId(cid);
      await courseService.registerCourse(cid);
      toast.success(`Đã đăng ký môn ${courseName}`);
      setCourses(prev =>
        prev.map(c =>
          c.cid === cid ? { ...c, isRegistered: true, enrollments: [{}] } : c
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi đăng ký');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnregister = async (cid: string, courseName: string) => {
    if (
      !window.confirm(`Bạn có chắc chắn muốn HỦY đăng ký môn: ${courseName}?`)
    )
      return;
    try {
      setProcessingId(cid);
      await courseService.unregisterCourse(cid);

      toast.warn(`Đã hủy đăng ký môn ${courseName}`);

      setCourses(prev =>
        prev.map(c =>
          c.cid === cid ? { ...c, isRegistered: false, enrollments: [] } : c
        )
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Không thể hủy đăng ký lúc này'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCourses = courses.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <div className="w-full bg-gradient-to-br from-[#49BBBD] via-[#3aa4a6] to-[#2C7879] pt-10 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button
                onClick={() => navigate('/courses/register')}
                className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all mb-4 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm tracking-wide uppercase">
                  Hệ thống quản lý
                </span>
              </button>
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight uppercase">
                Đăng ký học phần <span className="text-teal-200">mới</span>
              </h1>
            </div>
            <div className="relative w-full md:w-[400px]">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Tìm tên môn học..."
                className="w-full pl-12 pr-6 py-4 bg-white/15 border border-white/30 rounded-2xl text-white placeholder:text-white/60 outline-none focus:bg-white focus:text-gray-800 transition-all shadow-inner"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 flex items-start gap-3">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
            <FaSpinner className="animate-spin text-[#49BBBD] text-5xl mb-4" />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
              Đang đồng bộ dữ liệu...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
            {filteredCourses.map(course => {
              const isAlreadyInList =
                course.isRegistered ||
                (course.enrollments && course.enrollments.length > 0);
              return (
                <div
                  key={course.cid}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-14 h-14 bg-teal-50 rounded-[1.2rem] flex items-center justify-center text-[#49BBBD] group-hover:bg-[#49BBBD] group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                        <FaBook size={24} />
                      </div>
                      {isAlreadyInList ? (
                        <span className="flex items-center gap-1 px-4 py-1.5 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200 animate-pulse">
                          <FaCheckCircle /> Đã đăng ký
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">
                          {course.code}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-gray-800 leading-tight group-hover:text-[#3aa4a6] transition-colors line-clamp-2 min-h-[3.5rem] uppercase">
                      {course.name}
                    </h3>
                    <div className="mt-6 flex items-center gap-3 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-teal-50 transition-colors">
                      <FaGraduationCap className="text-[#49BBBD]" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                        {course.credits ?? 0} Tín chỉ
                      </span>
                    </div>
                  </div>

                  {isAlreadyInList ? (
                    <button
                      disabled={processingId === course.cid}
                      onClick={() => handleUnregister(course.cid, course.name)}
                      className="mt-10 w-full py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      {processingId === course.cid ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <span className="tracking-widest text-xs uppercase">
                            Hủy đăng ký
                          </span>
                          <FaTrashAlt className="text-sm opacity-70" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={processingId === course.cid}
                      onClick={() => handleRegister(course.cid, course.name)}
                      className={`mt-10 w-full py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg transition-all duration-300 active:scale-95 ${processingId === course.cid
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-[#49BBBD] shadow-gray-200'
                        }`}
                    >
                      {processingId === course.cid ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <span className="tracking-widest text-xs uppercase">
                            Đăng ký ngay
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
