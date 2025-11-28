import { useState } from 'react';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
    title: 'AWS Certified solutions Architect',
    category: 'Design',
    duration: '3 Months',
    image: '/img/course2.jpg',
  },
  {
    id: 3,
    title: 'AWS Certified solutions Architect',
    category: 'Design',
    duration: '3 Months',
    image: '/img/course3.jpg',
  },
  {
    id: 4,
    title: 'AWS Certified solutions Architect',
    category: 'Design',
    duration: '3 Months',
    image: '/img/course4.jpg',
  },
];

export default function CourseRegister() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');

  const filters = [
    { label: 'Subject' },
    { label: 'Partner' },
    { label: 'Program' },
    { label: 'Language' },
    { label: 'Abailability' },
    { label: 'Learning Type' },
  ];

  return (
    <div className="w-full">
      {/* HEADER IMAGE */}
      <div
        className="w-full h-[180px] bg-cover bg-center"
        style={{ backgroundImage: "url('/img/header-bg.jpg')" }}
      ></div>

      {/* SEARCH BAR */}
      <div className="w-full flex justify-center -mt-14">
        <div className="w-[70%] bg-white shadow-lg p-4 rounded-2xl flex items-center gap-3">
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
            placeholder="Search your favourite course"
          />
          <button className="px-8 py-2 bg-[#49BBBD] text-white font-semibold rounded-xl">
            Search
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="w-full flex justify-center mt-6 gap-4 flex-wrap">
        {filters.map((f, i) => (
          <button
            key={i}
            className="bg-white border border-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            {f.label} <FaChevronDown size={13} />
          </button>
        ))}
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-20 py-10">
        {dummyCourses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
          >
            {/* IMAGE */}
            <img
              src={course.image}
              className="w-full h-40 rounded-xl object-cover"
            />

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
            <button className="mt-4 w-full py-2 bg-[#49BBBD] text-white rounded-xl font-semibold hover:bg-[#3aa5a7]">
              Pick
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center pb-10 gap-4">
        <button className="p-3 bg-[#49BBBD] text-white rounded-lg">
          <FaChevronLeft />
        </button>
        <button className="p-3 bg-[#49BBBD] text-white rounded-lg">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
