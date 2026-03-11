import { useEffect, useState } from 'react';
import {
  FaCheckDouble,
  FaTrash,
  FaBell,
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { NotiService } from '../Domains/notifications/services/notifications.service';
import type { Notification } from '../Domains/notifications/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notiService = new NotiService();

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = filter === 'UNREAD'
        ? await notiService.getUnreadNotifications()
        : await notiService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Xử lý đánh dấu đã đọc 1 cái
  const handleMarkAsRead = async (nid: string) => {
    try {
      await notiService.markNotificationAsRead(nid);
      setNotifications(prev =>
        prev.map(n => (n.nid === nid ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      toast.error('Lỗi kết nối');
    }
  };

  // Xử lý đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    try {
      await notiService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Lỗi kết nối');
    }
  };

  // Xử lý xóa
  const handleDelete = async (nid: string) => {
    if (!window.confirm('Bạn muốn xóa thông báo này?')) return;
    try {
      await notiService.deleteNotification(nid);
      setNotifications(prev => prev.filter(n => n.nid !== nid));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      toast.error('Không thể xóa');
    }
  };

  // Helper functions
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'deadline_reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grade_released':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'quiz_posted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enrollment_status':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz_posted': return 'Quiz';
      case 'grade_released': return 'Điểm';
      case 'enrollment_status': return 'Đăng ký';
      case 'deadline_reminder': return 'Nhắc nhở';
      case 'assignment_submitted': return 'Bài tập';
      default: return 'Thông báo';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white hover:bg-gray-100 transition shadow-sm"
              title="Quay lại"
            >
              <FaArrowLeft size={18} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaBell className="text-[#49BBBD]" /> Thông báo
            </h1>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa9ab] transition shadow-sm"
          >
            <FaCheckDouble /> Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'UNREAD' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Chưa đọc
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl">
              <FaBell size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Không có thông báo nào</p>
              <p className="text-sm mt-1">Bạn chưa nhận được thông báo nào</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.nid}
                onClick={() => !notif.is_read && handleMarkAsRead(notif.nid)}
                className={`group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer ${notif.is_read
                  ? 'bg-white border-gray-100 hover:border-gray-200'
                  : 'bg-white border-l-4 border-l-[#49BBBD] shadow-md hover:shadow-lg'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getTypeStyles(notif.type)}`}
                      >
                        {getTypeLabel(notif.type)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <h3
                      className={`text-lg mb-1 ${notif.is_read ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.nid);
                      }}
                      title="Xóa"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Dot indicator for unread */}
                {!notif.is_read && (
                  <span className="absolute top-5 right-5 w-2 h-2 bg-[#49BBBD] rounded-full group-hover:hidden"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
