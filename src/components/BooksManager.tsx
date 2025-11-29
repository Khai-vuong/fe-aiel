import {
  FaEdit,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const dummyBooks = [
  { id: 'A', content: 'Lorem ipsum dolor sit amet...' },
  { id: 'B', content: 'Lorem ipsum dolor sit amet...' },
  { id: 'C', content: 'Lorem ipsum dolor sit amet...' },
];

export default function BooksManager() {
  return (
    <div className="flex-1 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Books</h1>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button className="bg-teal-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-teal-600">
          <FaUpload className="inline mr-2" />
          Upload
        </button>

        <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-300">
          <FaEdit className="inline mr-2" />
          Edit
        </button>
      </div>

      {/* Book Contents */}
      <div className="space-y-8">
        {dummyBooks.map(book => (
          <div key={book.id}>
            <h2 className="text-xl font-bold text-gray-700 mb-3">{book.id}</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-gray-700 shadow-sm">
              {book.content}
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
