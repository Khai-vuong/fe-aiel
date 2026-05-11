import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaBell,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { notificationService } from '@/Domains/notifications/services';
import type { CreateClassNotificationDto } from '@/Domains/notifications/types';

// Import Components
import StudentsManager from '@/components/StudentsManager';
import DashboardOverview from '@/components/DashboardOverview';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { clid } = useParams<{ clid: string }>();
  const [activeSection] = useState('Students');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'general',
    related_type: 'Class',
    related_id: '',
  });
  const [sending, setSending] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clid) {
      toast.error('Không tìm thấy ID lớp học!');
      return;
    }
    if (!notificationForm.title || !notificationForm.message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setSending(true);
    try {
      const notificationData: CreateClassNotificationDto = {
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type as any,
        related_type: notificationForm.related_type as any,
        related_id: notificationForm.related_id || clid,
      };

      const result = await notificationService.createClassNotifications(
        clid,
        notificationData
      );

      toast.success(`Đã gửi thông báo thành công cho ${result.length} học sinh!`);
      setShowNotificationModal(false);
      setNotificationForm({
        title: '',
        message: '',
        type: 'general',
        related_type: 'Class',
        related_id: '',
      });
    } catch (error: any) {
      console.error('Failed to send notification', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi thông báo!');
    } finally {
      setSending(false);
    }
  };

  const navItems = [
    // DASHBOARD
    {
      id: 'Overview',
      label: 'Dashboard',
      icon: FaChalkboardTeacher,
      component: <DashboardOverview />,
    },

    // DANH SÁCH HỌC VIÊN
    {
      id: 'Students',
      label: 'Danh sách học viên',
      icon: FaUsers,
      component: <StudentsManager />,
    },
  ];

  const currentComponent = navItems.find(
    item => item.id === activeSection
  )?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* MAIN CONTENT */}
      <div className="w-full relative z-10">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl shadow-sm p-4 border-b border-white/30 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-[#49BBBD] flex items-center gap-2 font-medium"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {navItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>

            <button
              onClick={() => setShowNotificationModal(true)}
              className="flex items-center px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa4a6] transition duration-200 shadow-md"
            >
              <FaBell className="mr-2" size={16} />
              <span className="font-medium text-sm">Thông báo</span>
            </button>
          </div>

          {/*
          <div className="flex justify-between items-center mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${activeSection === item.id
                    ? 'bg-[#49BBBD] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <item.icon className="mr-2" size={16} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => console.log('Export clicked')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium text-sm">Export</span>
              </button>
            </div>
          </div>
          */}
        </header>

        {/* Render Component */}
        <main className="p-0">{currentComponent}</main>
      </div>

      {/* Modal Thông báo */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-white/30 flex justify-between items-center bg-white/40 backdrop-blur-xl text-gray-800">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaBell className="text-[#49BBBD]" /> Gửi thông báo cho lớp học
              </h3>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="hover:bg-white/40 p-1 rounded-full transition"
                disabled={sending}
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-3 mb-4 shadow-sm">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Lớp học:</span> {clid || 'Không xác định'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Thông báo sẽ được gửi cho tất cả học sinh trong lớp này
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  placeholder="Ví dụ: Thông báo nghỉ học..."
                  value={notificationForm.title}
                  onChange={e =>
                    setNotificationForm({ ...notificationForm, title: e.target.value })
                  }
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  rows={4}
                  placeholder="Nhập nội dung chi tiết thông báo..."
                  value={notificationForm.message}
                  onChange={e =>
                    setNotificationForm({ ...notificationForm, message: e.target.value })
                  }
                  required
                  disabled={sending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại thông báo
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-[#49BBBD] outline-none"
                    value={notificationForm.type}
                    onChange={e =>
                      setNotificationForm({ ...notificationForm, type: e.target.value })
                    }
                    disabled={sending}
                  >
                    <option value="general">General (Chung)</option>
                    <option value="quiz_posted">Quiz Posted (Đề thi mới)</option>
                    <option value="grade_released">Grade Released (Công bố điểm)</option>
                    <option value="enrollment_status">Enrollment Status (Trạng thái đăng ký)</option>
                    <option value="deadline_reminder">Deadline Reminder (Nhắc hạn)</option>
                    <option value="assignment_submitted">Assignment Submitted (Nộp bài)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Type
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-[#49BBBD] outline-none"
                    value={notificationForm.related_type}
                    onChange={e =>
                      setNotificationForm({ ...notificationForm, related_type: e.target.value })
                    }
                    disabled={sending}
                  >
                    <option value="Class">Class</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Course">Course</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-5 py-2 text-gray-700 bg-white/60 hover:bg-white/80 rounded-lg font-medium transition border border-white/30"
                  disabled={sending}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#49BBBD] hover:bg-[#3aa4a6] rounded-lg font-bold transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <FaBell size={14} />
                      Gửi thông báo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
