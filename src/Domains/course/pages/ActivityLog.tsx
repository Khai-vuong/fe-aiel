import { useEffect, useState } from 'react';
import {
  Activity,
  RefreshCw,
  List,
  Database,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import logsService, { type Log } from '../../logs/services/logs.service';

// Props:
// - classId: Có giá trị -> Log của lớp (Lecturer)
// - classId: Rỗng/Undefined -> Log toàn hệ thống (Admin)
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
      // Logic API: Admin xem tất cả, Lecturer xem theo lớp
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
  }, [classId, page]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-[#49BBBD]" />
          {classId ? 'Nhật ký lớp học' : 'Hoạt động hệ thống (System Logs)'}
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

      {/* TABLE CONTENT */}
      {loading && logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : logs.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
              <tr>
                <th className="p-4 w-40">Resource ID</th>
                <th className="p-4 w-48">User</th>
                <th className="p-4 w-32">Action</th>
                <th className="p-4">Details</th>
                <th className="p-4 w-40">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr
                  key={log.lid || log.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* 1. Resource ID (Giống ClassDetail) */}
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-1 text-blue-600 font-mono text-xs">
                      <Database size={12} className="text-gray-400 shrink-0" />
                      <span title={log.entity_id || log.resource_id}>
                        {(log.entity_id || log.resource_id || '-').substring(
                          0,
                          8
                        )}
                        ...
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                      {log.entity_type || 'UNKNOWN'}
                    </div>
                  </td>

                  {/* 2. User Info */}
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-2 font-medium text-gray-800">
                      <User size={14} className="text-gray-400 shrink-0" />
                      {log.user?.name || log.user?.username || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400 ml-6 font-mono mt-0.5">
                      {log.user_id || log.userId}
                    </div>
                  </td>

                  {/* 3. Action Badge */}
                  <td className="p-4 align-top">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border block w-fit ${(log.action || '').toLowerCase().includes('create')
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

                  {/* 4. Details */}
                  <td className="p-4 align-top text-gray-600">
                    <div className="line-clamp-2" title={log.details}>
                      {log.details || '-'}
                    </div>
                  </td>

                  {/* 5. Time */}
                  <td className="p-4 align-top text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(log.created_at || log.createdAt || '').toLocaleString(
                        'vi-VN'
                      )}
                    </div>
                  </td>
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

      {/* FOOTER: Phân trang */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Trước
        </button>
        <span className="px-3 py-1 text-sm text-gray-600 border rounded bg-gray-50 flex items-center min-w-[40px] justify-center">
          {page}
        </span>
        <button
          disabled={logs.length < 20 || loading}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm flex items-center gap-1"
        >
          Sau <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
