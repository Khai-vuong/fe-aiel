import { FaSearch, FaEdit, FaEye } from 'react-icons/fa';

export default function StudentsManager() {
  const students = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'vana@example.com',
      progress: 80,
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'thib@example.com',
      progress: 45,
      status: 'Inactive',
      avatar: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'vanc@example.com',
      progress: 92,
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=3',
    },
    {
      id: 4,
      name: 'Phạm Minh D',
      email: 'minhd@example.com',
      progress: 60,
      status: 'Active',
      avatar: 'https://i.pravatar.cc/40?img=4',
    },
  ];

  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-semibold text-gray-900 mb-6">
        Danh sách học viên
      </h1>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between mb-6 border">
        <div className="flex items-center gap-3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search student..."
            className="px-3 py-2 border rounded-lg w-64 text-gray-700 
                       placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <select className="px-3 py-2 border rounded-lg text-gray-700 focus:ring-teal-500">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang học</option>
          <option value="inactive">Ngừng học</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">
          {/* 🔥 FIXED HEADER – CHỮ RÕ, ĐẬM */}
          <thead className="bg-gray-50 border-b shadow-sm">
            <tr className="text-gray-700 font-semibold uppercase text-sm tracking-wide">
              <th className="p-4">Học viên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tiến độ</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                {/* Student Info */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={s.avatar}
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                  <span className="font-medium text-gray-800">{s.name}</span>
                </td>

                <td className="p-4 text-gray-600">{s.email}</td>

                {/* Progress */}
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full"
                      style={{ width: `${s.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {s.progress}%
                  </span>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      s.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 flex items-center justify-center gap-3">
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition">
                    <FaEye size={16} />
                  </button>
                  <button className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">
                    <FaEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
