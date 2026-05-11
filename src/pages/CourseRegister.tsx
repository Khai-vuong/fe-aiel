import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '@/Domains/course/services/course.service';
import {
  FaPlus,
  FaBook,
  FaSpinner,
  FaGraduationCap,
  FaTimes,
  FaUsers,
  FaInfoCircle,
  FaSearch,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaCheckCircle,
  FaTrashAlt,
  FaPlusCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CourseRegister() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      setCourses(response);
    } catch (err: any) {
      toast.error('Không thể cập nhật danh sách môn học.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, activeTab]);

  const handleViewDetail = async (cid: string) => {
    try {
      setIsModalLoading(true);
      setSelectedCourse({ loading: true });
      const response = await courseService.getCourseById(cid);
      setSelectedCourse(response);
    } catch (err) {
      toast.error('Lỗi tải dữ liệu chi tiết.');
      setSelectedCourse(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleRegister = async (cid: string, courseName: string) => {
    if (!window.confirm(`Xác nhận đăng ký môn: ${courseName}?`)) return;
    try {
      setProcessingId(cid);
      await courseService.registerCourse(cid);
      toast.success(`Đã đăng ký môn ${courseName}`);

      setSelectedCourse((prev: any) => ({
        ...prev,
        isRegistered: true,
        enrollments: [{}]
      }));

      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi đăng ký');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnregister = async (cid: string, courseName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn HỦY đăng ký môn: ${courseName}?`)) return;
    try {
      setProcessingId(cid);
      await courseService.unregisterCourse(cid);
      toast.warn(`Đã hủy đăng ký môn ${courseName}`);

      setSelectedCourse((prev: any) => ({
        ...prev,
        isRegistered: false,
        enrollments: []
      }));

      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể hủy đăng ký lúc này');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCourses = courses.filter(
    c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-[#49BBBD] to-[#3aa4a6] pt-16 pb-28 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight uppercase">
            Hệ Thống Học Phần
          </h1>
          <p className="text-white/80 font-medium">
            Tra cứu thông tin chi tiết và quản lý lộ trình học tập.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'all' ? 'bg-[#49BBBD] text-white shadow-lg' : 'text-gray-500'}`}
            >
              Tất cả môn
            </button>
          </div>
          <div className="relative w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã hoặc tên môn..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#49BBBD]/50"
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* Course Grid */}
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
                    <span className="text-[11px] font-black text-[#49BBBD] bg-[#49BBBD]/10 px-3 py-1.5 rounded-full uppercase">
                      {course.code}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 uppercase h-14">
                    {course.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                    <FaGraduationCap className="text-[#49BBBD]" />{' '}
                    {course.credits || 3} Tín chỉ
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetail(course.cid)}
                  className="w-full mt-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold group-hover:bg-[#49BBBD] group-hover:text-white transition-all uppercase tracking-widest text-xs"
                >
                  XEM CHI TIẾT
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT ĐẦY ĐỦ THÔNG TIN */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-[8px] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 flex flex-col">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#49BBBD] text-white rounded-2xl shadow-lg shadow-[#49BBBD]/20">
                  <FaInfoCircle size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#49BBBD] uppercase tracking-widest">
                    Thông tin chi tiết học phần
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase">
                    {selectedCourse.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              {isModalLoading ? (
                <div className="p-20 flex flex-col items-center">
                  <FaSpinner
                    className="animate-spin text-[#49BBBD]"
                    size={40}
                  />
                </div>
              ) : (
                <div className="space-y-8 text-left">
                  {/* Registration Status Badge */}
                  {(() => {
                    const isAlreadyRegistered = selectedCourse?.isRegistered ||
                      (selectedCourse?.enrollments && selectedCourse.enrollments.length > 0);
                    if (isAlreadyRegistered) {
                      return (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                          <FaCheckCircle className="text-green-500 text-xl" />
                          <span className="font-bold text-green-700 uppercase text-sm tracking-wide">Bạn đã đăng ký môn này</span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Grid Bento Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-blue-500 shadow-sm">
                        <FaBook size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          Mã học phần
                        </p>
                        <p className="font-extrabold text-gray-800">
                          {selectedCourse.code}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-teal-50 rounded-3xl border border-teal-100 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-[#49BBBD] shadow-sm">
                        <FaGraduationCap size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                          Số tín chỉ
                        </p>
                        <p className="font-extrabold text-gray-800">
                          {selectedCourse.credits || 3} Tín chỉ
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100 flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-purple-500 shadow-sm">
                        <FaUsers size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                          Tổng số lớp
                        </p>
                        <p className="font-extrabold text-gray-800">
                          {selectedCourse.classes?.length || 0} Nhóm lớp
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-widest border-l-4 border-[#49BBBD] pl-3">
                      Mô tả nội dung
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-gray-600 leading-relaxed italic">
                        {selectedCourse.description ||
                          'Chưa có thông tin mô tả chi tiết cho học phần này. Nội dung đang được cập nhật bởi giáo vụ khoa.'}
                      </p>
                    </div>
                  </div>

                  {/* Lecturers Section */}
                  <div>
                    <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-widest border-l-4 border-orange-400 pl-3">
                      Đội ngũ giảng viên
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCourse.lecturers?.length > 0 ? (
                        selectedCourse.lecturers.map((lec: any) => (
                          <div
                            key={lec.id}
                            className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                          >
                            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold">
                              {lec.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">
                                {lec.name}
                              </p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold">
                                {lec.specialization || 'Giảng viên'}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          Đang phân công giảng viên...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Available Classes Section */}
                  <div>
                    <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-widest border-l-4 border-indigo-400 pl-3">
                      Danh sách nhóm lớp đang mở
                    </h4>
                    <div className="space-y-3">
                      {selectedCourse.classes?.length > 0 ? (
                        selectedCourse.classes.map((cls: any) => (
                          <div
                            key={cls.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-indigo-200 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                                <FaChalkboardTeacher />
                              </div>
                              <div>
                                <p className="font-black text-gray-800">
                                  Nhóm:{' '}
                                  {cls.group_number || cls.id.substring(0, 4)}
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <FaCalendarAlt /> Học kỳ:{' '}
                                  {cls.semester || 'Học kỳ 1'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-0 flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                  Sĩ số lớp
                                </p>
                                <p className="text-sm font-black text-gray-700">
                                  {cls.current_students || 0}/
                                  {cls.max_students || 40}
                                </p>
                              </div>
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500"
                                  style={{
                                    width: `${((cls.current_students || 0) / (cls.max_students || 40)) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm font-medium">
                          Chưa có nhóm lớp nào được mở cho học kỳ hiện tại.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Đóng
              </button>

              {(() => {
                const isAlreadyRegistered = selectedCourse?.isRegistered ||
                  (selectedCourse?.enrollments && selectedCourse.enrollments.length > 0);

                if (isAlreadyRegistered) {
                  return (
                    <button
                      disabled={processingId === selectedCourse?.cid}
                      onClick={() => handleUnregister(selectedCourse.cid, selectedCourse.name)}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === selectedCourse?.cid ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaTrashAlt /> HỦY ĐĂNG KÝ
                        </>
                      )}
                    </button>
                  );
                } else {
                  return (
                    <button
                      disabled={processingId === selectedCourse?.cid}
                      onClick={() => handleRegister(selectedCourse.cid, selectedCourse.name)}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-[#49BBBD] text-white rounded-2xl font-bold hover:bg-[#3aa4a6] transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === selectedCourse?.cid ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaPlusCircle /> ĐĂNG KÝ MÔN
                        </>
                      )}
                    </button>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
