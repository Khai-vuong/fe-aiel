import React, { useEffect, useState } from 'react';
import type { Course, CourseCreateRequest } from '../types';
import { courseServiceInstance } from '../services';
import { logsService, type Log, type PaginationInfo } from '../../logs/services';
import {
    BookOpen,
    Activity,
    RefreshCw,
    Database,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';

export default function AdminSystem() {
    // --- COURSES STATE ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<Course | null>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState<'courses' | 'activity'>('courses');

    const [form, setForm] = useState<CourseCreateRequest>({
        name: '',
        code: '',
        description: '',
        credits: undefined,
    });

    // --- LOGS STATE ---
    const [logs, setLogs] = useState<Log[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    // ===== PAGINATION STATE =====
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    // ===== FILTER STATE =====
    const [actionFilter, setActionFilter] = useState<string>('');
    const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('');
    const [userIdFilter, setUserIdFilter] = useState<string>('');

    // --- FETCH COURSES ---
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await courseServiceInstance.getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error('fetch courses error', err);
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH LOGS (Admin - All System Logs) ---
    const fetchLogs = async () => {
        setLogsLoading(true);
        try {
            const response = await logsService.getAllLogs({
                page: pagination.page,
                limit: pagination.limit,
                action: actionFilter || undefined,
                resourceType: resourceTypeFilter || undefined,
                userId: userIdFilter || undefined,
            });

            setLogs(response.data);
            setPagination(response.pagination);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'courses') {
            fetchCourses();
        } else if (activeTab === 'activity') {
            fetchLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Fetch logs when filters/pagination change
    useEffect(() => {
        if (activeTab === 'activity') {
            fetchLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, actionFilter, resourceTypeFilter, userIdFilter]);

    // --- HANDLERS ---
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (form.credits === undefined || form.credits === null) {
            alert('Vui lòng nhập số tín chỉ.');
            return;
        }

        if (!Number.isInteger(form.credits)) {
            alert('Số tín chỉ phải là số nguyên.');
            return;
        }

        try {
            if (editing) {
                await courseServiceInstance.updateCourse(editing.cid, form);
            } else {
                await courseServiceInstance.createCourse(form);
            }
            setForm({ name: '', code: '', description: '', credits: undefined });
            setEditing(null);
            fetchCourses();
        } catch (err) {
            console.error('submit failed', err);
        }
    };

    const handleEdit = (c: Course) => {
        setEditing(c);
        setForm({
            name: c.name,
            code: c.code,
            description: c.description,
            credits: c.credits,
        });
        setActiveTab('courses');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa khóa học này không?')) return;
        try {
            await courseServiceInstance.deleteCourse(id);
            fetchCourses();
        } catch (err) {
            console.error('delete failed', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Bảng điều khiển hệ thống quản trị
                </h1>

                {/* --- TABS NAVIGATION --- */}
                <div className="flex gap-2 border-b mb-6">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'courses'
                            ? 'border-[#49BBBD] text-[#49BBBD]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <BookOpen size={20} />
                        Quản lý khóa học
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'activity'
                            ? 'border-[#49BBBD] text-[#49BBBD]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Activity size={20} />
                        Hoạt động hệ thống
                        {pagination.total > 0 && activeTab === 'activity' && (
                            <span className="ml-1 px-2 py-0.5 text-xs bg-[#49BBBD] text-white rounded-full">
                                {pagination.total}
                            </span>
                        )}
                    </button>
                </div>

                {/* --- CONTENT: COURSES TAB --- */}
                {activeTab === 'courses' && (
                    <div className="animate-fadeIn">
                        {/* Form */}
                        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/30 mb-6">
                            <h2 className="text-lg font-bold mb-4 text-gray-700">
                                {editing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                            </h2>
                            <form
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            >
                                <input
                                    placeholder="Tên khóa học"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                                    required
                                />
                                <input
                                    placeholder="Mã khóa học"
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                                />
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    placeholder="Số tín chỉ"
                                    value={form.credits ?? ''}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            credits: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button className="px-6 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa8aa] font-medium transition-colors">
                                        {editing ? 'Cập nhật' : 'Tạo mới'}
                                    </button>
                                    {editing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(null);
                                                setForm({ name: '', code: '', description: '', credits: undefined });
                                            }}
                                            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    placeholder="Mô tả"
                                    value={form.description}
                                    onChange={e =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    className="md:col-span-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                                    rows={3}
                                />
                            </form>
                        </div>

                        {/* Table */}
                        <div className="bg-white/70 backdrop-blur-xl shadow-lg border border-white/30 rounded-3xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Tên</th>
                                        <th className="px-6 py-3 font-semibold">Mã</th>
                                        <th className="px-6 py-3 font-semibold">Mô tả</th>
                                        <th className="px-6 py-3 font-semibold">Tín chỉ</th>
                                        <th className="px-6 py-3 font-semibold text-center">
                                            Đăng ký
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-center">
                                            Lớp học
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-right">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Đang tải khóa học...
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && courses.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Không tìm thấy khóa học nào.
                                            </td>
                                        </tr>
                                    )}
                                    {courses.map(c => (
                                        <tr
                                            key={c.cid}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {c.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                                                {c.code}
                                            </td>
                                            <td
                                                className="px-6 py-4 text-gray-600 truncate max-w-xs"
                                                title={c.description}
                                            >
                                                {c.description}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {c.credits || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {c._count?.enrollments || 0}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {c._count?.classes || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.cid)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- CONTENT: SYSTEM ACTIVITY TAB --- */}
                {activeTab === 'activity' && (
                    <div className="animate-fadeIn">
                        {/* Header with Refresh Button */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <Activity className="text-[#49BBBD]" />
                                        Nhật ký hoạt động hệ thống
                                    </h2>
                                    {pagination.total > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Tổng số:{' '}
                                            <span className="font-semibold text-[#49BBBD]">
                                                {pagination.total}
                                            </span>{' '}
                                            bản ghi
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={fetchLogs}
                                    disabled={logsLoading}
                                    className="px-4 py-2 flex items-center gap-2 text-[#49BBBD] hover:text-teal-700 font-medium transition-colors border border-[#49BBBD] rounded-lg hover:bg-teal-50"
                                >
                                    <RefreshCw
                                        size={18}
                                        className={logsLoading ? 'animate-spin' : ''}
                                    />
                                    Làm mới
                                </button>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-4 mb-6">
                            <div className="flex items-center gap-4 flex-wrap">
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
                                        onChange={e => {
                                            setActionFilter(e.target.value);
                                            setPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="login">Đăng nhập</option>
                                        <option value="logout">Đăng xuất</option>
                                        <option value="create_quiz">Tạo bài kiểm tra</option>
                                        <option value="update_quiz">Cập nhật bài kiểm tra</option>
                                        <option value="delete_quiz">Xóa bài kiểm tra</option>
                                        <option value="create_attempt">Tạo lượt làm bài</option>
                                        <option value="submit_attempt">Nộp bài</option>
                                        <option value="update_attempt">Cập nhật lượt làm bài</option>
                                        <option value="upload_file">Tải tệp lên</option>
                                        <option value="create_notification">Tạo thông báo</option>
                                        <option value="create_class">Tạo lớp học</option>
                                        <option value="enroll_student">Ghi danh học viên</option>
                                    </select>
                                </div>

                                {/* Resource Type Filter */}
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="resourceTypeFilter"
                                        className="text-sm text-gray-600"
                                    >
                                        Loại tài nguyên:
                                    </label>
                                    <select
                                        id="resourceTypeFilter"
                                        value={resourceTypeFilter}
                                        onChange={e => {
                                            setResourceTypeFilter(e.target.value);
                                            setPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="User">Người dùng</option>
                                        <option value="Quiz">Bài kiểm tra</option>
                                        <option value="Attempt">Lượt làm bài</option>
                                        <option value="Class">Lớp học</option>
                                        <option value="Course">Khóa học</option>
                                        <option value="Notification">Thông báo</option>
                                        <option value="File">Tệp</option>
                                    </select>
                                </div>

                                {/* User ID Filter */}
                                <div className="flex items-center gap-2">
                                    <label htmlFor="userIdFilter" className="text-sm text-gray-600">
                                        ID người dùng:
                                    </label>
                                    <input
                                        id="userIdFilter"
                                        type="text"
                                        value={userIdFilter}
                                        onChange={e => {
                                            setUserIdFilter(e.target.value);
                                            setPagination(prev => ({ ...prev, page: 1 }));
                                        }}
                                        placeholder="Nhập ID người dùng"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent w-48"
                                    />
                                </div>

                                {/* Limit Filter */}
                                <div className="flex items-center gap-2 ml-auto">
                                    <label htmlFor="limitFilter" className="text-sm text-gray-600">
                                        Hiển thị:
                                    </label>
                                    <select
                                        id="limitFilter"
                                        value={pagination.limit}
                                        onChange={e => {
                                            setPagination(prev => ({
                                                ...prev,
                                                limit: Number(e.target.value),
                                                page: 1,
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

                        {/* Logs Content */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6">
                            {logsLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD] mx-auto mb-4" />
                                    <p className="text-gray-500">Đang tải nhật ký...</p>
                                </div>
                            ) : logs.length > 0 ? (
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                            <tr>
                                                <th className="p-3">ID tài nguyên</th>
                                                <th className="p-3">ID / Tên người dùng</th>
                                                <th className="p-3">Hành động</th>
                                                <th className="p-3">Chi tiết</th>
                                                <th className="p-3">Thời gian tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {logs.map(log => (
                                                <tr
                                                    key={log.logid}
                                                    className="hover:bg-gray-50"
                                                >
                                                    {/* 1. Resource ID */}
                                                    <td className="p-3 font-mono text-xs text-blue-600">
                                                        <div className="flex items-center gap-1">
                                                            <Database size={12} className="text-gray-400" />
                                                            {log.entity_id || log.resource_id || '-'}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400">
                                                            {log.entity_type || log.resource_type || 'Không xác định'}
                                                        </span>
                                                    </td>

                                                    {/* 2. User ID / Name */}
                                                    <td className="p-3">
                                                        <div className="font-medium text-gray-800">
                                                            {log.user?.name || log.user?.username || 'Không xác định'}
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
                                                                        : (log.action || '')
                                                                            .toLowerCase()
                                                                            .includes('login')
                                                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
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
                                                            ? new Date(
                                                                (log.created_at || log.createdAt)!
                                                            ).toLocaleString('vi-VN')
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

                            {/* Pagination */}
                            {!logsLoading && logs.length > 0 && pagination.totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between border-t pt-4">
                                    {/* Pagination Info */}
                                    <div className="text-sm text-gray-600">
                                        Hiển thị{' '}
                                        <span className="font-medium">
                                            {(pagination.page - 1) * pagination.limit + 1}
                                        </span>
                                        {' '}-{' '}
                                        <span className="font-medium">
                                            {Math.min(
                                                pagination.page * pagination.limit,
                                                pagination.total
                                            )}
                                        </span>
                                        {' '}trong tổng số{' '}
                                        <span className="font-medium">{pagination.total}</span> bản
                                        ghi
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() =>
                                                setPagination(prev => ({
                                                    ...prev,
                                                    page: prev.page - 1,
                                                }))
                                            }
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
                                            {Array.from(
                                                { length: pagination.totalPages },
                                                (_, i) => i + 1
                                            )
                                                .filter(pageNum => {
                                                    return (
                                                        pageNum === 1 ||
                                                        pageNum === pagination.totalPages ||
                                                        Math.abs(pageNum - pagination.page) <= 1
                                                    );
                                                })
                                                .map((pageNum, index, array) => {
                                                    const prevPageNum = array[index - 1];
                                                    const showEllipsis =
                                                        prevPageNum && pageNum - prevPageNum > 1;

                                                    return (
                                                        <div
                                                            key={pageNum}
                                                            className="flex items-center gap-1"
                                                        >
                                                            {showEllipsis && (
                                                                <span className="px-2 text-gray-400">...</span>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    setPagination(prev => ({
                                                                        ...prev,
                                                                        page: pageNum,
                                                                    }))
                                                                }
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
                                            onClick={() =>
                                                setPagination(prev => ({
                                                    ...prev,
                                                    page: prev.page + 1,
                                                }))
                                            }
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
                )}
            </div>
        </div>
    );
}
