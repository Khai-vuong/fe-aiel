import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logsService, type Log, type PaginationInfo } from '../services';
import {
    Activity,
    RefreshCw,
    Database,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';

export default function LogPage() {
    const { clid } = useParams<{ clid: string }>();
    const navigate = useNavigate();

    // ===== LOG STATE =====
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    // ===== PAGINATION STATE =====
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    // ===== FILTER STATE =====
    const [actionFilter, setActionFilter] = useState<string>('');

    // ===== FETCH LOGS =====
    const fetchLogs = async () => {
        if (!clid) return;

        setLoading(true);
        try {
            const response = await logsService.getClassLogs(clid, {
                page: pagination.page,
                limit: pagination.limit,
                action: actionFilter || undefined,
            });

            setLogs(response.data);
            setPagination(response.pagination);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [clid, pagination.page, pagination.limit, actionFilter]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 py-8 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-[80vw] mx-auto relative z-10">
                {/* ===== HEADER ===== */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/class/${clid}`)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Quay lại Class Detail"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <Activity className="text-[#49BBBD]" />
                                    Nhật ký hoạt động
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-gray-500">
                                        Class ID: {clid}
                                    </p>
                                    {pagination.total > 0 && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <p className="text-sm text-gray-500">
                                                Tổng số: <span className="font-semibold text-[#49BBBD]">{pagination.total}</span> bản ghi
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={fetchLogs}
                            disabled={loading}
                            className="px-4 py-2 flex items-center gap-2 text-[#49BBBD] hover:text-teal-700 font-medium transition-colors border border-[#49BBBD] rounded-lg hover:bg-teal-50"
                        >
                            <RefreshCw
                                size={18}
                                className={loading ? 'animate-spin' : ''}
                            />
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* ===== FILTERS SECTION ===== */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <Filter size={18} className="text-[#49BBBD]" />
                            <span>Lọc dữ liệu:</span>
                        </div>

                        {/* Action Filter */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="actionFilter" className="text-sm text-gray-600">
                                Hành động:
                            </label>
                            <select
                                id="actionFilter"
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                            >
                                <option value="">Tất cả</option>
                                <option value="create_quiz">Create Quiz</option>
                                <option value="update_quiz">Update Quiz</option>
                                <option value="delete_quiz">Delete Quiz</option>
                                <option value="create_attempt">Create Attempt</option>
                                <option value="submit_attempt">Submit Attempt</option>
                                <option value="update_attempt">Update Attempt</option>
                                <option value="upload_file">Upload File</option>
                                <option value="create_notification">Create Notification</option>
                                <option value="enroll_student">Enroll Student</option>
                            </select>
                        </div>

                        {/* Limit Filter */}
                        <div className="flex items-center gap-2 ml-auto">
                            <label htmlFor="limitFilter" className="text-sm text-gray-600">
                                Hiển thị:
                            </label>
                            <select
                                id="limitFilter"
                                value={pagination.limit}
                                onChange={(e) => {
                                    setPagination(prev => ({
                                        ...prev,
                                        limit: Number(e.target.value),
                                        page: 1
                                    }));
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="text-sm text-gray-600">/ trang</span>
                        </div>
                    </div>
                </div>

                {/* ===== LOG CONTENT ===== */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD] mx-auto mb-4" />
                            <p className="text-gray-500">Đang tải nhật ký...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="p-3">Resource ID</th>
                                        <th className="p-3">User ID / Name</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Details</th>
                                        <th className="p-3">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {logs.map(log => (
                                        <tr key={log.lid || log.id} className="hover:bg-gray-50">
                                            {/* 1. Resource ID */}
                                            <td className="p-3 font-mono text-xs text-blue-600">
                                                <div className="flex items-center gap-1">
                                                    <Database size={12} className="text-gray-400" />
                                                    {log.entity_id || log.resource_id || '-'}
                                                </div>
                                                <span className="text-[10px] text-gray-400">
                                                    {log.entity_type || 'Unknown'}
                                                </span>
                                            </td>

                                            {/* 2. User ID / Name */}
                                            <td className="p-3">
                                                <div className="font-medium text-gray-800">
                                                    {log.user?.name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono">
                                                    {log.user_id || log.userId}
                                                </div>
                                            </td>

                                            {/* 3. Action */}
                                            <td className="p-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-bold border ${(log.action || '')
                                                        .toLowerCase()
                                                        .includes('create')
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : (log.action || '')
                                                            .toLowerCase()
                                                            .includes('update')
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
                                            <td
                                                className="p-3 text-gray-600 max-w-xs truncate"
                                                title={log.details}
                                            >
                                                {log.details || '-'}
                                            </td>

                                            {/* 5. Created At */}
                                            <td className="p-3 text-gray-500 whitespace-nowrap">
                                                {log.created_at || log.createdAt
                                                    ? new Date((log.created_at || log.createdAt)!).toLocaleString('vi-VN')
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                            <Activity className="mx-auto mb-2 opacity-50" size={32} />
                            <p>Không tìm thấy hoạt động nào.</p>
                        </div>
                    )}

                    {/* ===== PAGINATION ===== */}
                    {!loading && logs.length > 0 && pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                            {/* Pagination Info */}
                            <div className="text-sm text-gray-600">
                                Hiển thị{' '}
                                <span className="font-medium">
                                    {(pagination.page - 1) * pagination.limit + 1}
                                </span>
                                {' '}-{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>
                                {' '}trong tổng số{' '}
                                <span className="font-medium">{pagination.total}</span> bản ghi
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors ${pagination.page === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                    Trước
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(pageNum => {
                                            // Show first page, last page, current page, and adjacent pages
                                            return (
                                                pageNum === 1 ||
                                                pageNum === pagination.totalPages ||
                                                Math.abs(pageNum - pagination.page) <= 1
                                            );
                                        })
                                        .map((pageNum, index, array) => {
                                            // Add ellipsis if there's a gap
                                            const prevPageNum = array[index - 1];
                                            const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;

                                            return (
                                                <div key={pageNum} className="flex items-center gap-1">
                                                    {showEllipsis && (
                                                        <span className="px-2 text-gray-400">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                        className={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[40px] ${pagination.page === pageNum
                                                            ? 'bg-[#49BBBD] text-white'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors ${pagination.page === pagination.totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Sau
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
