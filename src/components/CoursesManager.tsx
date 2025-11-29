import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function CoursesManager() {
  const courses = [
    {
      id: 1,
      name: 'Adobe XD - UI/UX Design Fundamentals',
      students: 120,
      progress: 80,
      status: 'Active',
      thumbnail:
        'https://images.unsplash.com/photo-1581276879432-15a43b7bbefe?auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 2,
      name: 'ReactJS Mastery Bootcamp',
      students: 210,
      progress: 50,
      status: 'Hidden',
      thumbnail:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 3,
      name: 'Figma for Designers',
      students: 98,
      progress: 100,
      status: 'Active',
      thumbnail:
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=400&q=60',
    },
  ];

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">
          Quản lý khóa học
        </h1>

        <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg shadow transition font-medium">
          <FaPlus size={14} />
          Thêm khóa học
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between mb-6 border">
        <div className="flex items-center gap-3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search course..."
            className="px-3 py-2 border rounded-lg w-64 text-gray-700 placeholder-gray-400 
                       focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <select className="px-3 py-2 border rounded-lg text-gray-700 focus:ring-teal-500">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* COURSE TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b shadow-sm">
            <tr className="text-gray-700 font-semibold uppercase text-sm tracking-wide">
              <th className="p-4">Khóa học</th>
              <th className="p-4">Học viên</th>
              <th className="p-4">Tiến độ</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {courses.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                {/* Course Info */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    className="w-14 h-14 rounded-lg object-cover shadow-sm"
                    alt="thumbnail"
                  />
                  <span className="font-medium text-gray-800">{c.name}</span>
                </td>

                {/* Students Count */}
                <td className="p-4 text-gray-600">{c.students} học viên</td>

                {/* Progress */}
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {c.progress}%
                  </span>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      c.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 flex justify-center gap-3">
                  <button className="p-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition">
                    <FaEye size={16} />
                  </button>

                  <button className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">
                    <FaEdit size={16} />
                  </button>

                  <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                    <FaTrash size={16} />
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
