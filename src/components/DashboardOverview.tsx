import { useEffect, useState } from 'react';
import courseService from '@/Domains/course/services/course.service';
import logsService from '@/Domains/logs/services/logs.service';
import { FaUsers, FaBook, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    {
      id: 1,
      label: 'Tổng học viên',
      value: '0',
      icon: <FaUsers size={22} />,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      label: 'Khóa học',
      value: '0',
      icon: <FaBook size={22} />,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 3,
      label: 'Bài kiểm tra',
      value: '0',
      icon: <FaClipboardCheck size={22} />,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 4,
      label: 'Tỉ lệ hoàn thành',
      value: '0%',
      icon: <FaChartLine size={22} />,
      color: 'bg-green-100 text-green-700',
    },
  ]);

  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lấy khóa học của user hiện tại (instructor) từ courseService
        const courses = (await courseService.getMyCourses()) || [];
        setActiveCourses(courses);

        // 2. Tạo thống kê đơn giản dựa trên dữ liệu có sẵn (backend không có /instructor/stats)
        const totalCourses = courses.length;
        const totalStudents = courses.reduce(
          (acc: number, c: any) => acc + (c._count?.enrollments ?? 0),
          0
        );
        const totalQuizzes = 0; // Không có nguồn dữ liệu sẵn cho số lượng quiz
        const completionRate = Math.round(
          (courses.reduce((acc: number, c: any) => acc + (c.progress ?? 0), 0) /
            (courses.length || 1)) as number
        );

        setStats([
          {
            id: 1,
            label: 'Tổng học viên',
            value: String(totalStudents || 0),
            icon: <FaUsers size={22} />,
            color: 'bg-blue-100 text-blue-700',
          },
          {
            id: 2,
            label: 'Khóa học',
            value: String(totalCourses || 0),
            icon: <FaBook size={22} />,
            color: 'bg-purple-100 text-purple-700',
          },
          {
            id: 3,
            label: 'Bài kiểm tra',
            value: String(totalQuizzes || 0),
            icon: <FaClipboardCheck size={22} />,
            color: 'bg-yellow-100 text-yellow-700',
          },
          {
            id: 4,
            label: 'Tỉ lệ hoàn thành',
            value: `${completionRate || 0}%`,
            icon: <FaChartLine size={22} />,
            color: 'bg-green-100 text-green-700',
          },
        ]);

        // 3. Lấy log của lớp đầu tiên (nếu có) bằng logsService
        if (courses.length > 0) {
          const classId = courses[0].cid;
          if (logsService && typeof logsService.getClassLogs === 'function') {
            const logsRes = await logsService.getClassLogs(classId, {
              page: 1,
              limit: 5,
              action: 'submit_attempt',
            });
            setNotifications(logsRes.data || []);
          } else {
            console.warn('logsService.getClassLogs is not available');
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 w-full space-y-10">
      {/* Title */}
      <h1 className="text-4xl font-semibold text-gray-900">
        Instructor Dashboard
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map(s => (
          <div
            key={s.id}
            className="bg-white p-5 rounded-xl shadow border flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-xl ${s.color}`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Thống kê hoạt động
        </h2>
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Biểu đồ sẽ đặt tại đây (Recharts / Chart.js)
        </div>
      </div>

      {/* Courses & Notifications */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="col-span-2 bg-white rounded-xl shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Khoá học đang hoạt động
          </h2>

          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b shadow-sm">
              <tr className="text-gray-700 font-semibold uppercase text-sm tracking-wide">
                <th className="p-3">Khoá học</th>
                <th className="p-3">Học viên</th>
                <th className="p-3">Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {activeCourses.length > 0 ? (
                activeCourses.map((c: any) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">{c.name}</td>
                    <td className="p-3 text-gray-600">{c.students}</td>
                    <td className="p-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {c.progress}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Notifications / Logs */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Log gần đây
          </h2>

          <ul className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((log: any) => (
                <li key={log.id} className="flex flex-col gap-1">
                  <span className="font-medium text-gray-800">
                    📝 {log.userName} đã nộp bài
                  </span>
                  <span className="text-sm text-gray-600">{log.quizTitle}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">Không có log gần đây</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
