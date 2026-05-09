// src/Domains/class/components/ActivityLog.tsx

import { useEffect, useState } from 'react';
import { Activity, RefreshCw, List, Database, User, Clock } from 'lucide-react';
import logsService, { type Log } from '../../logs/services/logs.service';

// Props: classId là tùy chọn. Nếu không có classId => Chế độ Admin (Lấy toàn bộ log)
interface ActivityLogProps {
  classId?: string;
}

export default function ActivityLog({ classId }: ActivityLogProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // LOGIC QUAN TRỌNG:
      // - Có classId -> Gọi API log của lớp
      // - Không có classId -> Gọi API log toàn hệ thống (Admin)
      const res = classId
        ? await logsService.getClassLogs(classId, { page, limit: 20 })
        : await logsService.getAllLogs({ page, limit: 20 });

      setLogs(res.data ?? []);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, page]); // Chạy lại khi classId hoặc page thay đổi

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-[#49BBBD]" />
          {classId ? 'Nhật ký lớp học' : 'Hoạt động hệ thống'}
        </h3>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="text-sm flex items-center gap-1 text-[#49BBBD] hover:text-teal-700 font-medium transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm
          mới
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : logs.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
              <tr>
                <th className="p-4 w-48">Thời gian</th>
                <th className="p-4 w-48">Người thực hiện</th>
                <th className="p-4 w-32">Hành động</th>
                <th className="p-4">Chi tiết</th>
                {!classId && <th className="p-4">Đối tượng</th>}{' '}
                {/* Cột cho Admin */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr
                  key={log.lid || log.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(log.created_at || log.createdAt || '').toLocaleString(
                        'vi-VN'
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-gray-800">
                      <User size={14} className="text-gray-400" />
                      {log.user?.name || log.user?.username || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400 ml-6">
                      {log.user_id || log.userId || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${(log.action || '').toLowerCase().includes('create')
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : (log.action || '').toLowerCase().includes('update')
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : (log.action || '')
                              .toLowerCase()
                              .includes('delete')
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td
                    className="p-4 text-gray-600 max-w-xs truncate"
                    title={log.details}
                  >
                    {log.details || '-'}
                  </td>
                  {!classId && (
                    <td className="p-4 text-xs font-mono text-blue-600">
                      <div className="flex items-center gap-1">
                        <Database size={12} className="text-gray-400" />
                        {log.entity_type || log.resource_type}: {log.entity_id || log.resource_id}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed text-gray-400">
          <List className="mx-auto mb-2 opacity-50" size={32} />
          <p>Không có dữ liệu hoạt động.</p>
        </div>
      )}

      {/* Phân trang đơn giản */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
        >
          Trước
        </button>
        <span className="px-2 py-S1 text-sm text-gray-600">Trang {page}</span>
        <button
          disabled={logs.length < 20 || loading}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
