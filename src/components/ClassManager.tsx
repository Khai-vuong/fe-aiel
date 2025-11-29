import { FaBook } from 'react-icons/fa';

export default function ClassManager() {
  const classes = [
    { id: 1, name: 'Class 1', color: 'bg-blue-100' },
    { id: 2, name: 'Class 2', color: 'bg-orange-100' },
    { id: 3, name: 'Class 3', color: 'bg-red-100' },
    { id: 4, name: 'Class 4', color: 'bg-blue-100' },
    { id: 5, name: 'Class 5', color: 'bg-orange-100' },
    { id: 6, name: 'Class 6', color: 'bg-blue-100' },
    { id: 7, name: 'Class 7', color: 'bg-red-100' },
    { id: 8, name: 'Class 8', color: 'bg-blue-100' },
    { id: 9, name: 'Class 9', color: 'bg-orange-100' },
  ];

  const stats = [
    {
      value: '1.2K',
      label: 'Course completed',
      percent: 70,
      color: 'bg-purple-500',
    },
    {
      value: '470',
      label: 'Certificate earned',
      percent: 20,
      color: 'bg-red-500',
    },
    {
      value: '342',
      label: 'Course in progress',
      percent: 30,
      color: 'bg-yellow-500',
    },
    {
      value: '20',
      label: 'Career path',
      percent: 100,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r p-4">
        <button className="p-2 bg-teal-500 text-white rounded-md mb-4">
          <FaBook />
        </button>

        <h2 className="font-semibold text-gray-700 mb-4">Change class</h2>

        <div className="space-y-3">
          {classes.map(cls => (
            <div
              key={cls.id}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer shadow-sm hover:opacity-80 transition ${cls.color}`}
            >
              <FaBook size={14} className="text-gray-600" />
              <span className="text-gray-700 font-medium">{cls.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="w-full bg-teal-400 text-white py-6 px-10 shadow-md">
          <h1 className="text-3xl font-bold">Class</h1>
        </div>

        {/* Class Details Section */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Linear – LO4
          </h2>

          <div className="bg-[#BDA48A] p-8 rounded-xl shadow space-x-6 flex">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white w-48 p-4 rounded-xl shadow flex flex-col"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${item.color} rounded-lg`}></div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.value}
                    </h3>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Monitor Section */}
          <h2 className="text-2xl mt-10 mb-4 font-semibold text-gray-800">
            Learning monitor
          </h2>

          <div className="bg-[#BDA48A] h-72 rounded-xl shadow p-6">
            {/* Empty block for now */}
          </div>
        </div>
      </div>
    </div>
  );
}
