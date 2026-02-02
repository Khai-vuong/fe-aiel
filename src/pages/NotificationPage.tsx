import { useEffect, useState } from 'react';
import {
  FaCheckDouble,
  FaTrash,
  FaEnvelopeOpenText,
  FaPlus,
  FaBell,
} from 'react-icons/fa';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/notification';
import CreateNotificationModal from '../components/CreateNotificationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const userRole = localStorage.getItem('userRole'); // Lấy role từ local storage

  // Fetch dữ liệu
  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications({
        is_read: filter === 'UNREAD' ? false : undefined, // Nếu ALL thì không gửi param này
      });
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Xử lý đánh dấu đã đọc 1 cái
  const handleMarkAsRead = async (nid: string) => {
    try {
      await notificationService.markAsRead(nid);
      // Cập nhật UI local để đỡ phải fetch lại
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
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Lỗi kết nối');
    }
  };

  // Xử lý xóa (nếu cần)
  const handleDelete = async (nid: string) => {
    if (!window.confirm('Bạn muốn xóa thông báo này?')) return;
    try {
      await notificationService.delete(nid);
      setNotifications(prev => prev.filter(n => n.nid !== nid));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      toast.error('Không thể xóa');
    }
  };

  // Helper render màu sắc theo loại
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IMPORTANT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-100'; // INFO
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBell className="text-[#49BBBD]" /> Thông báo
          </h1>

          {/* Chỉ hiển thị nút tạo cho Lecturer hoặc Admin */}
          {(userRole === 'Lecturer' || userRole === 'Admin') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#49BBBD] text-white px-4 py-2 rounded-lg hover:bg-[#3aa4a6] transition shadow-md"
            >
              <FaPlus /> Gửi thông báo
            </button>
          )}
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

          <button
            onClick={handleMarkAllRead}
            className="text-sm text-[#49BBBD] font-semibold hover:underline flex items-center gap-2"
          >
            <FaCheckDouble /> Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không có thông báo nào.
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.nid}
                className={`group relative p-5 rounded-xl border transition-all duration-200 ${
                  notif.is_read
                    ? 'bg-white border-gray-100'
                    : 'bg-white border-l-4 border-l-[#49BBBD] shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getTypeStyles(notif.type)}`}
                      >
                        {notif.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.created_at).toLocaleString()}
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
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notif.nid)}
                        title="Đánh dấu đã đọc"
                        className="p-2 text-gray-400 hover:text-[#49BBBD] hover:bg-blue-50 rounded-full"
                      >
                        <FaEnvelopeOpenText />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.nid)}
                      title="Xóa"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <FaTrash />
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

      {/* Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchNotifications}
        />
      )}
    </div>
  );
}
