import React, { useEffect, useState } from 'react';
import type { Course, CourseCreateRequest } from '../types';
import { courseService } from '../services/courseService';
// Import đúng Component vừa tạo ở trên
import ActivityLog from '../../class/components/ActivityLog';
import { BookOpen, Activity } from 'lucide-react';

export default function AdminCourses() {
  // --- STATE ---
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'courses' | 'activity'>('courses');

  const [form, setForm] = useState<CourseCreateRequest>({
    name: '',
    code: '',
    description: '',
  });

  // --- FETCH COURSES ---
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('fetch courses error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- HANDLERS ---
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (editing) {
        await courseService.updateCourse(editing.cid, form);
      } else {
        await courseService.createCourse(form);
      }
      setForm({ name: '', code: '', description: '' });
      setEditing(null);
      fetchCourses();
    } catch (err) {
      console.error('submit failed', err);
    }
  };

  const handleEdit = (c: Course) => {
    setEditing(c);
    setForm({ name: c.name, code: c.code, description: c.description });
    setActiveTab('courses');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch (err) {
      console.error('delete failed', err);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* --- TABS NAVIGATION (Cách xa nhau gap-10) --- */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'courses'
              ? 'border-[#49BBBD] text-[#49BBBD]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen size={20} />
          Manage Courses
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'activity'
              ? 'border-[#49BBBD] text-[#49BBBD]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity size={20} />
          System Activity
        </button>
      </div>

      {/* --- CONTENT: COURSES TAB --- */}
      {activeTab === 'courses' && (
        <div className="animate-fadeIn">
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              {editing ? 'Edit Course' : 'Create New Course'}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                placeholder="Course name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                required
              />
              <input
                placeholder="Course code"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
              />
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3aa8aa] font-medium transition-colors">
                  {editing ? 'Update' : 'Create'}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setForm({ name: '', code: '', description: '' });
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                className="md:col-span-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49BBBD] outline-none"
                rows={3}
              />
            </form>
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Code</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Credits</th>
                  <th className="px-6 py-3 font-semibold text-center">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 font-semibold text-center">
                    Classes
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading courses...
                    </td>
                  </tr>
                )}
                {!loading && courses.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No courses found.
                    </td>
                  </tr>
                )}
                {courses.map(c => (
                  <tr
                    key={c.cid}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                      {c.code}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-600 truncate max-w-xs"
                      title={c.description}
                    >
                      {c.description}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.credits || '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {c._count?.enrollments || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {c._count?.classes || 0}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.cid)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT: ACTIVITY TAB --- */}
      {activeTab === 'activity' && (
        <div className="animate-fadeIn">
          {/* Gọi Component ActivityLog (chế độ Admin) */}
          <ActivityLog classId="" />
        </div>
      )}
    </div>
  );
}
