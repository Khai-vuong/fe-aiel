import {
  FaEdit,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const dummySlides = [
  { id: '1', content: 'Slide 1 content...' },
  { id: '2', content: 'Slide 2 content...' },
  { id: '3', content: 'Slide 3 content...' },
];

export default function SlidesManager() {
  return (
    <div className="flex-1 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Slides</h1>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button className="bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-orange-500">
          <FaUpload className="inline mr-2" />
          Upload
        </button>

        <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-300">
          <FaEdit className="inline mr-2" />
          Edit
        </button>
      </div>

      {/* Slide Contents */}
      <div className="space-y-8">
        {dummySlides.map(slide => (
          <div key={slide.id}>
            <h2 className="text-xl font-bold text-gray-700 mb-3">
              Slide {slide.id}
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-700 shadow-sm">
              {slide.content}
            </div>

            <div className="flex justify-end mt-2 space-x-3">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 shadow">
                <FaEdit size={14} />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 shadow">
                <FaUpload size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-8 space-x-3">
        <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 shadow">
          <FaChevronLeft />
        </button>
        <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 shadow">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
