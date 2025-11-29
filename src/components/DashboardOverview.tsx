import { FaUsers, FaBook, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

export default function DashboardOverview() {
  // Mock Data
  const stats = [
    {
      id: 1,
      label: 'Tổng học viên',
      value: '1.2K',
      icon: <FaUsers size={22} />,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      label: 'Khóa học',
      value: '32',
      icon: <FaBook size={22} />,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      id: 3,
      label: 'Bài kiểm tra',
      value: '128',
      icon: <FaClipboardCheck size={22} />,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 4,
      label: 'Tỉ lệ hoàn thành',
      value: '78%',
      icon: <FaChartLine size={22} />,
      color: 'bg-green-100 text-green-700',
    },
  ];

  const activeCourses = [
    {
      id: 1,
      name: 'Adobe XD - UI/UX Design',
      students: 345,
      progress: 70,
    },
    {
      id: 2,
      name: 'ReactJS Bootcamp',
      students: 289,
      progress: 85,
    },
    {
      id: 3,
      name: 'Figma Masterclass',
      students: 156,
      progress: 63,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Học viên mới đăng ký',
      time: '2 giờ trước',
    },
    {
      id: 2,
      title: 'Quiz mới được tạo: UI Basics',
      time: '5 giờ trước',
    },
    {
      id: 3,
      title: 'Khoá học ReactJS được cập nhật',
      time: '1 ngày trước',
    },
  ];

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

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Thống kê hoạt động
        </h2>

        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Biểu đồ sẽ đặt tại đây (Recharts / Chart.js)
        </div>
      </div>

      {/* Courses and Notifications */}
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
              {activeCourses.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{c.name}</td>
                  <td className="p-3 text-gray-600">{c.students}</td>

                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${c.progress}%` }}
                        className="bg-teal-500 h-full"
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {c.progress}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông báo gần đây
          </h2>

          <ul className="space-y-4">
            {notifications.map(n => (
              <li key={n.id} className="flex justify-between">
                <span className="font-medium text-gray-700">{n.title}</span>
                <span className="text-sm text-gray-500">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
