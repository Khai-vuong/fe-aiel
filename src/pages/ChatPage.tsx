import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaSearch,
  FaPaperPlane,
  FaBell,
  FaCommentDots,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEnvelopeOpenText,
  FaEnvelope,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { notificationService } from '../Domains/notifications/services';
import type {
  Notification,
  CreateNotificationDto,
} from '../Domains/notifications/types';

// --- INTERFACES ---
interface User {
  id: number | string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  online: boolean;
}

interface Message {
  sender: 'me' | 'bot';
  text: string;
  time: string;
}

// Mock users
const mockUsers: User[] = [
  {
    id: 1,
    name: 'TKBOT',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
    lastMsg: 'Hệ thống sẵn sàng...',
    time: 'Now',
    online: true,
  },
  {
    id: 2,
    name: 'Cody Fisher',
    avatar: 'https://i.pravatar.cc/150?u=cody',
    lastMsg: 'Hello there...',
    time: '10m',
    online: true,
  },
  {
    id: 3,
    name: 'Savannah Nguyen',
    avatar: 'https://i.pravatar.cc/150?u=savannah',
    lastMsg: 'Sent a file',
    time: '1h',
    online: false,
  },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  // 👇 Check quyền tạo thông báo
  const canCreateNotification = userRole === 'Lecturer' || userRole === 'Admin';

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'chat' | 'notification'>('chat');

  // Chat State
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Chào mừng bạn! TKBOT có thể giúp gì?',
      time: 'Now',
    },
  ]);
  const [input, setInput] = useState('');

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [loadingNoti, setLoadingNoti] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    recipient_uid: '', // ID người nhận (nhập tay hoặc chọn)
    related_type: '',
    related_id: '',
  });

  // --- API FUNCTIONS ---

  const fetchNotifications = async () => {
    setLoadingNoti(true);
    try {
      // Sử dụng notificationService singleton instance
      const data =
        userRole === 'Student'
          ? await notificationService.getMyNotifications()
          : await notificationService.getAllNotifications();

      const sorted = data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setNotifications(sorted);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      toast.error('Không thể tải thông báo');
    } finally {
      setLoadingNoti(false);
    }
  };

  const markAsRead = async (nid: string) => {
    try {
      // Sử dụng notificationService
      await notificationService.markNotificationAsRead(nid);

      setNotifications(prev =>
        prev.map(n => (n.nid === nid ? { ...n, is_read: true } : n))
      );

      if (selectedNotification?.nid === nid) {
        setSelectedNotification(prev =>
          prev ? { ...prev, is_read: true } : null
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  // 👇 HÀM TẠO THÔNG BÁO MỚI (POST)
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message || !formData.recipient_uid) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      // Chuẩn bị dữ liệu theo đúng type
      const notificationData: CreateNotificationDto = {
        title: formData.title,
        message: formData.message,
        recipient_uid: formData.recipient_uid,
        type: formData.type as any,
        related_type: formData.related_type ? formData.related_type as any : undefined,
        related_id: formData.related_id || undefined,
      };

      // Sử dụng notificationService
      await notificationService.createNotification(notificationData);

      toast.success('Tạo thông báo thành công!');
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        type: 'general',
        recipient_uid: '',
        related_type: '',
        related_id: '',
      });

      // Refresh danh sách
      fetchNotifications();
    } catch (error) {
      console.error('Create notification failed', error);
      toast.error('Lỗi khi tạo thông báo.');
    }
  };

  // 👇 Tự động đánh dấu đã đọc khi click vào notification
  const handleSelectNotification = async (notif: Notification) => {
    setSelectedNotification(notif);

    // Nếu chưa đọc, tự động đánh dấu đã đọc
    if (!notif.is_read) {
      await markAsRead(notif.nid);
    }
  };

  useEffect(() => {
    if (activeTab === 'notification') {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- HELPER FUNCTIONS ---
  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = { sender: 'me', text: input, time: getTime() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Tôi là bot...', time: getTime() },
      ]);
    }, 1000);
  };

  const getNotiIcon = (type: string, size: number = 16) => {
    switch (type) {
      case 'quiz_posted':
        return <FaInfoCircle size={size} className="text-blue-500" />;
      case 'grade_released':
        return <FaCheckCircle size={size} className="text-green-500" />;
      case 'enrollment_status':
        return <FaBell size={size} className="text-purple-500" />;
      case 'deadline_reminder':
        return <FaExclamationTriangle size={size} className="text-orange-500" />;
      case 'assignment_submitted':
        return <FaCheckCircle size={size} className="text-teal-500" />;
      case 'general':
      default:
        return <FaInfoCircle size={size} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] relative">
      {/* --- SIDEBAR TRÁI --- */}
      <div className="w-1/4 bg-white border-r flex flex-col h-screen">
        <div className="p-6 pb-2 space-y-4">
          <button
            className="p-2 rounded-lg bg-[#49BBBD] text-white w-fit hover:bg-[#3aa4a6] transition-colors shadow-sm"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mt-3">Trung tâm</h1>

          {/* Search */}
          <div className="relative mt-4">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'chat'
                  ? 'Tìm kiếm hội thoại...'
                  : 'Tìm kiếm thông báo...'
              }
              className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-[#49BBBD]/30 outline-none transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mt-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'chat'
                ? 'bg-white text-[#49BBBD] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <FaCommentDots /> Tin nhắn
            </button>
            <button
              onClick={() => setActiveTab('notification')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'notification'
                ? 'bg-white text-[#49BBBD] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <FaBell /> Thông báo
            </button>
          </div>

          {/* 👇 NÚT TẠO THÔNG BÁO (Chỉ hiện nếu là Lecturer/Admin và đang ở tab Notification) */}
          {activeTab === 'notification' && canCreateNotification && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-2 bg-[#49BBBD] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#3aa4a6] transition-all shadow-sm active:scale-95"
            >
              <FaPlus size={14} /> Tạo thông báo mới
            </button>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {/* TAB CHAT */}
          {activeTab === 'chat' &&
            mockUsers.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border border-transparent ${selectedUser.id === user.id ? 'bg-[#F0F6FF] border-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    className="w-12 h-12 rounded-full mr-3 object-cover border border-gray-100"
                    alt={user.name}
                  />
                  {user.online && (
                    <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </h3>
                    <span className="text-gray-400 text-[10px]">
                      {user.time}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${selectedUser.id === user.id ? 'text-[#49BBBD]' : 'text-gray-500'}`}
                  >
                    {user.lastMsg}
                  </p>
                </div>
              </div>
            ))}

          {/* TAB NOTIFICATION */}
          {activeTab === 'notification' &&
            (loadingNoti ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.nid}
                  onClick={() => handleSelectNotification(notif)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden group ${selectedNotification?.nid === notif.nid ? 'bg-[#F0F6FF] border-[#49BBBD]' : !notif.is_read ? 'bg-blue-50 border-blue-100' : 'bg-white hover:bg-gray-50 border-gray-100'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="mt-0.5">{getNotiIcon(notif.type)}</div>
                      <h4
                        className={`font-semibold text-sm ${!notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}
                      >
                        {notif.title}
                      </h4>
                    </div>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed mt-1 pl-6">
                    {notif.message}
                  </p>
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {new Date(notif.created_at).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm">
                Không có thông báo.
              </div>
            ))}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col p-6 h-screen">
        {activeTab === 'chat' && (
          <>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 shrink-0">
              <img
                src={selectedUser.avatar}
                className="w-12 h-12 rounded-full object-cover"
                alt={selectedUser.name}
              />
              <div>
                <h2 className="font-bold text-gray-800 text-lg">
                  {selectedUser.name}
                </h2>
                <p className="text-green-500 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{' '}
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <div className="flex-1 mt-6 space-y-6 overflow-y-auto pr-4 scrollbar-hide">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-lg text-sm shadow-sm ${msg.sender === 'me' ? 'bg-[#49BBBD] text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 shrink-0">
              <input
                type="text"
                placeholder="Viết tin nhắn..."
                className="flex-1 px-4 py-2 text-gray-800 outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-[#49BBBD] text-white p-3 rounded-xl"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'notification' &&
          (selectedNotification ? (
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-y-auto animate-fadeIn">
              <div className="flex items-start gap-4 border-b border-gray-100 pb-6 mb-6">
                <div className="p-3 bg-gray-50 rounded-full">
                  {getNotiIcon(selectedNotification.type, 32)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedNotification.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock />{' '}
                      {new Date(selectedNotification.created_at).toLocaleString(
                        'vi-VN'
                      )}
                    </span>
                    {selectedNotification.is_read ? (
                      <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200 font-semibold text-sm">
                        <FaEnvelopeOpenText /> Đã đọc
                      </span>
                    ) : (<></>
                      // <button
                      //   onClick={() => markAsRead(selectedNotification.nid)}
                      //   className="flex items-center gap-2 text-white bg-[#49BBBD] hover:bg-[#3aa4a6] px-4 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 text-sm font-medium"
                      // >
                      //   <FaEnvelope /> Đánh dấu đã đọc
                      // </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {selectedNotification.message}
              </div>
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  onClick={() => setSelectedNotification(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="text-center">
                <FaBell className="mx-auto text-5xl mb-4 text-[#49BBBD] opacity-30" />
                <p>Chọn một thông báo để xem chi tiết</p>
              </div>
            </div>
          ))}
      </div>

      {/* 👇 MODAL TẠO THÔNG BÁO */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#49BBBD] text-white">
              <h3 className="font-bold text-lg">Tạo thông báo mới</h3>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  placeholder="Ví dụ: Thông báo nghỉ học..."
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                  rows={3}
                  placeholder="Nhập nội dung chi tiết..."
                  value={formData.message}
                  onChange={e =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại thông báo
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none bg-white"
                    value={formData.type}
                    onChange={e =>
                      setFormData({ ...formData, type: e.target.value })
                    }
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
                    ID Người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                    placeholder="User ID..."
                    value={formData.recipient_uid}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        recipient_uid: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Related Type (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border rounded text-sm outline-none"
                    placeholder="Ex: Quiz, Course..."
                    value={formData.related_type}
                    onChange={e =>
                      setFormData({ ...formData, related_type: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Related ID (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border rounded text-sm outline-none"
                    placeholder="ID..."
                    value={formData.related_id}
                    onChange={e =>
                      setFormData({ ...formData, related_id: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#49BBBD] hover:bg-[#3aa4a6] rounded-lg font-bold transition shadow-md active:scale-95"
                >
                  Gửi thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
