import { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  image: string;
}

const dummyCourses: Course[] = [
  {
    id: 1,
    title: 'AWS Certified solutions Architect',
    category: 'Design',
    duration: '3 Months',
    image: '/img/course1.jpg',
  },
  {
    id: 2,
    title: 'Python for Data Science',
    category: 'Programming',
    duration: '6 Months',
    image: '/img/course2.jpg',
  },
  {
    id: 3,
    title: 'Digital Marketing Fundamentals',
    category: 'Marketing',
    duration: '4 Months',
    image: '/img/course3.jpg',
  },
  {
    id: 4,
    title: 'Web Development Bootcamp',
    category: 'Programming',
    duration: '8 Months',
    image: '/img/course4.jpg',
  },
];

const filterOptions = {
  Subject: ['Programming', 'Design', 'Marketing', 'Business'],
  Partner: ['Microsoft', 'AWS', 'Google', 'IBM'],
  Program: ['Certificate', 'Degree', 'Short Course'],
  Language: ['English', 'Vietnamese', 'Chinese'],
  Abailability: ['Online', 'Offline'],
  'Learning Type': ['Self-paced', 'Live Session'],
};

// =================================================================
// HELPER COMPONENT: Filter Dropdown
// =================================================================
interface FilterDropdownProps {
  label: keyof typeof filterOptions;
  options: string[];
  onSelect: (value: string) => void;
  selectedValue: string;
}

function FilterDropdown({
  label,
  options,
  onSelect,
  selectedValue,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyle = `
    bg-gray-800 text-white
    border border-gray-700
    px-4 py-2 rounded-xl flex items-center gap-2 
    hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#49BBBD] 
    min-w-[120px] justify-between text-sm
  `;

  return (
    <div className="relative inline-block text-left z-10">
      <button onClick={() => setIsOpen(!isOpen)} className={buttonStyle}>
        <span className="truncate pr-2">{selectedValue || label}</span>
        {isOpen ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={e => {
                e.preventDefault();
                onSelect('');
                setIsOpen(false);
              }}
            >
              {label} (All)
            </a>

            {options.map((option, index) => (
              <a
                key={index}
                href="#"
                className={`block px-4 py-2 text-sm ${selectedValue === option ? 'bg-[#49BBBD] text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={e => {
                  e.preventDefault();
                  onSelect(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// MAIN COMPONENT
// =================================================================
export default function CourseRegister() {
  const [searchText, setSearchText] = useState('');

  const [filters, setFilters] = useState({
    Subject: '',
    Partner: '',
    Program: '',
    Language: '',
    Abailability: '',
    'Learning Type': '',
  });

  const [viewMode, setViewMode] = useState<'all' | 'registered'>('all');
  const registeredCourseIds = [1, 3];

  const handleFilterSelect = (key: keyof typeof filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filterLabels = Object.keys(
    filterOptions
  ) as (keyof typeof filterOptions)[];

  const coursesToDisplay = dummyCourses.filter(course => {
    if (viewMode === 'registered' && !registeredCourseIds.includes(course.id)) {
      return false;
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      if (
        !course.title.toLowerCase().includes(lowerSearch) &&
        !course.category.toLowerCase().includes(lowerSearch)
      ) {
        return false;
      }
    }

    // Áp dụng bộ lọc Subject
    if (filters.Subject && course.category !== filters.Subject) return false;

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER IMAGE / BANNER */}
      <div
        className="w-full h-[180px] bg-cover bg-center bg-[#49BBBD]"
        style={{
          backgroundImage: "url('/img/header-bg.jpg')",
        }}
      ></div>

      {/* VIEW MODE SWITCH BUTTONS (TRÊN SEARCH BAR) */}
      {/* 💥 ĐÃ LOẠI BỎ BG-WHITE, SHADOW-LG và BORDER */}
      <div className="w-full flex justify-center -mt-10 mb-4 z-20">
        {/* Để căn giữa theo chiều ngang và căn chỉnh với Search Bar, chúng ta đặt nó trong 1 div có chiều rộng tương đương 70% */}
        <div className="w-[70%] flex justify-center">
          <div className="flex gap-1 p-1 rounded-full">
            <button
              onClick={() => setViewMode('all')}
              className={`px-8 py-2 rounded-lg font-semibold transition text-sm ${
                viewMode === 'all'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setViewMode('registered')}
              className={`px-8 py-2 rounded-lg font-semibold transition text-sm ${
                viewMode === 'registered'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              My Registered Courses
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full flex justify-center z-10">
        <div className="w-[70%] bg-white shadow-lg p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-[#49BBBD] focus:border-[#49BBBD]"
            placeholder="Search your favourite course"
          />
          <button className="px-8 py-2 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700">
            Search
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS (DROPDOWNS) */}
      <div className="w-full flex justify-center mt-6 gap-4 flex-wrap px-4">
        {filterLabels.map(label => (
          <FilterDropdown
            key={label}
            label={label}
            options={filterOptions[label]}
            selectedValue={filters[label]}
            onSelect={value => handleFilterSelect(label, value)}
          />
        ))}
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-20 py-10">
        {coursesToDisplay.length > 0 ? (
          coursesToDisplay.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                {/* Sử dụng lại img tag nếu có ảnh thật */}
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* TEXT */}
              <div className="mt-3">
                <div className="text-gray-500 text-sm flex items-center gap-3">
                  <span>{course.category}</span>
                  <span className="text-xs">•</span>
                  <span>{course.duration}</span>
                </div>

                <h3 className="mt-2 font-semibold text-gray-800">
                  {course.title}
                </h3>
              </div>

              {/* PICK BUTTON */}
              <button className="mt-4 w-full py-2 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700">
                {registeredCourseIds.includes(course.id)
                  ? 'View Course'
                  : 'Pick'}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Không tìm thấy khóa học nào phù hợp.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {viewMode === 'all' && coursesToDisplay.length > 0 && (
        <div className="flex justify-center pb-10 gap-4">
          <button className="p-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa4a6]">
            <FaChevronLeft />
          </button>
          <button className="p-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa4a6]">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
