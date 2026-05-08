import { useState } from 'react';
import { notificationService } from '@/Domains/notifications/services';
import type { NotificationType } from '@/Domains/notifications/types';
import { toast } from 'react-toastify';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateNotificationModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'SINGLE' | 'BULK'>('SINGLE');
  const [recipientId, setRecipientId] = useState('');
  const [recipientIds, setRecipientIds] = useState(''); // Nhập danh sách ID cách nhau dấu phẩy
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !message)
      return toast.warning('Vui lòng điền tiêu đề và nội dung');

    setLoading(true);
    try {
      if (mode === 'SINGLE') {
        if (!recipientId) return toast.warning('Vui lòng nhập ID người nhận');
        await notificationService.createNotification({
          recipient_uid: recipientId,
          title,
          message,
          type,
        });
      } else {
        // Xử lý BULK: Trong thực tế bạn sẽ có UI chọn Lớp/Khóa học rồi lấy list Student ID từ API khác
        // Ở đây giả lập nhập tay các ID cách nhau dấu phẩy
        const recipientsList = recipientIds
          .split(',')
          .map(id => id.trim())
          .filter(id => id);
        if (recipientsList.length === 0)
          return toast.warning('Danh sách người nhận trống');

        await notificationService.createBulkNotifications({
          recipients: recipientsList,
          title,
          message,
          type,
        });
      }

      toast.success('Gửi thông báo thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Gửi thất bại. Kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Gửi thông báo mới
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b">
          <button
            className={`pb-2 ${mode === 'SINGLE' ? 'text-[#49BBBD] border-b-2 border-[#49BBBD] font-bold' : 'text-gray-500'}`}
            onClick={() => setMode('SINGLE')}
          >
            Cá nhân
          </button>
          <button
            className={`pb-2 ${mode === 'BULK' ? 'text-[#49BBBD] border-b-2 border-[#49BBBD] font-bold' : 'text-gray-500'}`}
            onClick={() => setMode('BULK')}
          >
            Hàng loạt (Lớp/Nhóm)
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'SINGLE' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID người nhận
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1 focus:ring-[#49BBBD] focus:border-[#49BBBD]"
                value={recipientId}
                onChange={e => setRecipientId(e.target.value)}
                placeholder="Nhập ID sinh viên..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Danh sách User ID (phân cách bằng dấu phẩy)
              </label>
              <textarea
                className="w-full border rounded-lg p-2 mt-1 focus:ring-[#49BBBD] focus:border-[#49BBBD]"
                rows={2}
                value={recipientIds}
                onChange={e => setRecipientIds(e.target.value)}
                placeholder="VD: user1, user2, user3..."
              />
              <p className="text-xs text-gray-500 mt-1">
                *Trong thực tế, chỗ này sẽ là Dropdown chọn Lớp học
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại thông báo
            </label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={type}
              onChange={e => setType(e.target.value as NotificationType)}
            >
              <option value="general">Thông tin chung</option>
              <option value="deadline_reminder">Nhắc hạn nộp</option>
              <option value="grade_released">Điểm đã công bố</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa4a6] disabled:bg-gray-300"
          >
            {loading ? 'Đang gửi...' : 'Gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
}
