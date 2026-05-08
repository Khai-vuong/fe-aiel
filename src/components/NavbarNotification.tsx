import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '@/Domains/notifications/services';

export default function NavbarNotification() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationService.getUnreadNotificationsCount();
        // Điều chỉnh tùy theo format trả về của BE, ví dụ res.count hoặc res
        setUnreadCount(typeof res === 'number' ? res : res.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread count');
      }
    };

    // Gọi ngay khi mount và có thể set interval để polling nếu không dùng socket
    fetchCount();
    const interval = setInterval(fetchCount, 60000); // Check mỗi 1 phút
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => navigate('/notifications')}
    >
      <FaBell className="text-gray-600 text-xl hover:text-[#49BBBD] transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
}
