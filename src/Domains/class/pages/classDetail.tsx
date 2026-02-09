import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Dùng axios
import { getClassById } from '../services/classServices';
import type { Class } from '../types';
import QuizList from '../../quiz/pages/QuizList';
import {
  FileText,
  Users,
  Clock,
  MapPin,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Activity, // Icon cho Log
  List,
  RefreshCw,
  Database, // Icon cho Resource ID
} from 'lucide-react';

export default function ClassDetail() {
  const { clid } = useParams<{ clid: string }>();
  const navigate = useNavigate();

  // ===== DATA STATE =====
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== UI STATE =====
  const [activeTab, setActiveTab] = useState<'files' | 'quizzes'>('files');
  const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(true);

  // ===== LOG STATE =====
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const userRole = localStorage.getItem('userRole');

  // ===== FETCH CLASS =====
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        if (!clid) {
          setError('Class ID is required');
          setLoading(false);
          return;
        }
        const data = await getClassById(clid);
        setClassData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load class details'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [clid]);

  // ===== FETCH LOGS (Đã sửa dùng Axios) =====
  const fetchLogs = async () => {
    if (!clid) return;

    setLoadingLogs(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi API lấy log (limit=20 để xem nhiều hơn)
      const res = await axios.get(
        `http://localhost:3000/logs/class/${clid}?page=1&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Xử lý dữ liệu trả về
      const logData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setLogs(logData);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Handler toggle
  const handleToggleLogs = () => {
    const newState = !showLogs;
    setShowLogs(newState);
    if (newState && logs.length === 0) {
      fetchLogs();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD]" />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error || 'Class not found'}</p>
        </div>
      </div>
    );
  }

  const getScheduleText = () => {
    if (!classData.schedule_json) return 'Not scheduled';
    const { day, start, end } = classData.schedule_json;
    return `${day || ''} ${start || ''} - ${end || ''}`.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[80vw] mx-auto">
        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {classData.class_name || classData.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {classData.status}
              </span>
            </div>

            {userRole === 'Lecturer' && (
              <div className="flex gap-3">
                {/* 1. Nút View Log */}
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border ${
                    showLogs
                      ? 'bg-gray-100 text-[#49BBBD] border-[#49BBBD]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={handleToggleLogs}
                >
                  <Activity size={18} />
                  {showLogs ? 'Hide Logs' : 'View Logs'}
                </button>

                {/* 2. Nút Class Monitor */}
                <button
                  className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] font-medium"
                  onClick={() => navigate(`/class/${classData.clid}/monitor`)}
                >
                  Class Monitor
                </button>

                {/* 3. Nút Edit Class */}
                <button
                  className="px-4 py-2 bg-[#30B8B2] text-white rounded-lg hover:bg-[#2a9ea0] font-medium"
                  onClick={() =>
                    navigate(`/class/${classData.clid}/edit`, {
                      state: { classData },
                    })
                  }
                >
                  Edit Class
                </button>
              </div>
            )}
          </div>

          {/* ===== CLASS INFO ===== */}
          {classData.course && (
            <div className="border-t pt-4 mt-4">
              <button
                onClick={() => setIsCourseInfoOpen(!isCourseInfoOpen)}
                className="flex items-center justify-between w-full gap-2 mb-2 hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#49BBBD]" />
                  <h3 className="font-semibold text-lg">Class Information</h3>
                </div>
                {isCourseInfoOpen ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-350 ease-in-out ${isCourseInfoOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="ml-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-500">Course Name</p>
                      <p className="font-medium">{classData.course.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course Code</p>
                      <p className="font-medium">{classData.course.code}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Schedule</p>
                        <p className="font-medium">{getScheduleText()}</p>
                      </div>
                    </div>
                    {classData.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{classData.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {classData.lecturer && (
                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Instructor</p>
                          <p className="font-medium text-lg">
                            {classData.lecturer.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== LOG SECTION (HIỂN THỊ ĐẦY ĐỦ THÔNG TIN) ===== */}
        {showLogs && (
          <div className="bg-white rounded-lg shadow-md border border-teal-100 p-6 mb-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <List className="text-[#49BBBD]" /> Nhật ký hoạt động
              </h3>
              <button
                onClick={fetchLogs}
                disabled={loadingLogs}
                className="text-sm flex items-center gap-1 text-[#49BBBD] hover:text-teal-700 font-medium transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={loadingLogs ? 'animate-spin' : ''}
                />{' '}
                Làm mới
              </button>
            </div>

            {loadingLogs ? (
              <div className="text-center py-8 text-gray-500">
                Đang tải nhật ký...
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
                            className={`px-2 py-1 rounded text-xs font-bold border ${
                              (log.action || '')
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
                          {new Date(
                            log.created_at || log.createdAt
                          ).toLocaleString('vi-VN')}
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
          </div>
        )}

        {/* ===== TABS ===== */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'files'
                  ? 'bg-[#49BBBD] text-white border-b-2 border-[#49BBBD]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Files ({classData.files?.length || 0})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'quizzes'
                  ? 'bg-[#49BBBD] text-white border-b-2 border-[#49BBBD]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileCheck className="w-5 h-5" />
                <span>Quizzes</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'files' && (
              <div className="space-y-3">
                {userRole === 'Lecturer' && (
                  <button
                    onClick={() => navigate(`/class/${classData.clid}/fileAdd`)}
                    className="w-full px-4 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] font-medium flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Upload File
                  </button>
                )}
                {classData.files && classData.files.length > 0 ? (
                  classData.files.map(file => (
                    <div
                      key={file.fid}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#49BBBD]" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {file.filename}
                          </p>
                          <p className="text-sm text-gray-500">
                            {file.file_type} •{' '}
                            {file.is_public ? 'Public' : 'Private'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0]"
                      >
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No files available for this class</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div>
                <QuizList
                  clid={classData.clid}
                  onBack={() => setActiveTab('files')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
