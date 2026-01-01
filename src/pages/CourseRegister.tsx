import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaPlus,
  FaBook,
  FaSpinner,
  FaGraduationCap,
  FaTimes,
  FaUsers,
  FaInfoCircle,
  FaSearch,
  FaTrashAlt,
} from 'react-icons/fa';

export default function CourseRegister() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const savedToken = localStorage.getItem('token');
      if (!savedToken) return;

      const response = await axios.get(
        `http://localhost:3000/courses?t=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${savedToken}` },
        }
      );

      setCourses(response.data);
      setError(null);
    } catch (err: any) {
      setError('Không thể cập nhật danh sách môn học.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, activeTab]);

  const handleUnregister = async (cid: string, courseName: string) => {
    const confirmUnreg = window.confirm(
      `Bạn có chắc chắn muốn HỦY đăng ký môn: ${courseName}?`
    );
    if (!confirmUnreg) return;

    try {
      setIsProcessing(true);
      const savedToken = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/courses/${cid}/register`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      alert('Hủy đăng ký thành công!');
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy đăng ký lúc này.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetail = async (cid: string) => {
    try {
      setIsModalLoading(true);
      setSelectedCourse({ loading: true });
      const savedToken = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/courses/${cid}`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      setSelectedCourse(response.data);
    } catch (err) {
      alert('Lỗi tải dữ liệu.');
      setSelectedCourse(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.code.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === 'registered') {
      return (
        matchesSearch &&
        (c.isRegistered || (c.enrollments && c.enrollments.length > 0))
      );
    }
    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] pb-20">
      <div className="w-full bg-gradient-to-r from-[#49BBBD] to-[#3aa4a6] pt-16 pb-28 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight uppercase">
            {activeTab === 'all' ? 'Hệ Thống Học Phần' : 'Học Phần Đã Đăng Ký'}
          </h1>
          <p className="text-white/80 font-medium"></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'all' ? 'bg-white text-[#49BBBD] shadow-sm' : 'text-gray-500'}`}
            >
              Tất cả môn
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'registered' ? 'bg-white text-[#49BBBD] shadow-sm' : 'text-gray-500'}`}
            >
              Đã đăng ký
            </button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên môn..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#49BBBD]/50"
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate('/courses/new')}
              className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all"
            >
              <FaPlus /> <span>Đăng ký mới</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-[#49BBBD]">
            <FaSpinner className="animate-spin mb-4" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div
                key={course.cid}
                className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-teal-50 rounded-2xl text-[#49BBBD] group-hover:bg-[#49BBBD] group-hover:text-white transition-colors">
                      <FaBook size={24} />
                    </div>
                    <span className="text-[11px] font-black text-[#49BBBD] bg-[#49BBBD]/10 px-3 py-1.5 rounded-full">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 h-14 line-clamp-2 uppercase">
                    {course.name}
                  </h3>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                      <FaGraduationCap /> {course.credits} Tín chỉ
                    </div>
                    {activeTab === 'registered' && (
                      <button
                        onClick={() =>
                          handleUnregister(course.cid, course.name)
                        }
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetail(course.cid)}
                  className="w-full mt-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold group-hover:bg-[#49BBBD] group-hover:text-white transition-all"
                >
                  XEM CHI TIẾT
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-[6px] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
            >
              <FaTimes size={18} />
            </button>

            {isModalLoading ? (
              <div className="p-24 flex flex-col items-center">
                <FaSpinner className="animate-spin text-[#49BBBD]" size={40} />
                <p className="mt-4 text-gray-400 font-medium">
                  Đang tải thông tin...
                </p>
              </div>
            ) : (
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#49BBBD]/10 text-[#49BBBD] px-4 py-1.5 rounded-full text-xs font-black uppercase">
                    {selectedCourse.code}
                  </span>
                  <span className="text-gray-400 text-xs font-mono">
                    ID: {selectedCourse.cid}
                  </span>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">
                  {selectedCourse.name}
                </h2>

                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div className="p-5 bg-gray-50 rounded-3xl flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-white rounded-2xl text-[#49BBBD] shadow-sm">
                      <FaGraduationCap size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Tín chỉ
                      </p>
                      <p className="font-extrabold text-gray-800">
                        {selectedCourse.credits} Học phần
                      </p>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-3xl flex items-center gap-4 text-left border border-gray-100">
                    <div className="p-3 bg-white rounded-2xl text-blue-500 shadow-sm">
                      <FaUsers size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Lớp học
                      </p>
                      <p className="font-extrabold text-gray-800">
                        {selectedCourse.classes?.length || 0} Nhóm lớp
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-10 text-left">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-[#49BBBD]" /> Mô tả chi tiết
                  </h4>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-gray-600 leading-relaxed text-sm italic">
                      {selectedCourse.description ||
                        'Chưa có thông tin mô tả chi tiết cho học phần này.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  ĐÓNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
