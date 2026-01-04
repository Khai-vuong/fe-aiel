import React, { useEffect, useState } from 'react';

type Course = {
  id?: string;
  name: string;
  code?: string;
  description?: string;
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<Course>({
    name: '',
    code: '',
    description: '',
  });

  const apiBase = '/api/courses';

  const token = localStorage.getItem('token');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiBase, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error('fetch courses error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${apiBase}/${editing.id}` : apiBase;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: '', code: '', description: '' });
        setEditing(null);
        fetchCourses();
      } else {
        console.error('submit failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (c: Course) => {
    setEditing(c);
    setForm({ name: c.name, code: c.code, description: c.description });
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Delete this course?')) return;
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin — Manage Courses</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          placeholder="Course name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 border rounded"
          required
        />
        <input
          placeholder="Course code"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#49BBBD] text-white rounded">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ name: '', code: '', description: '' });
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          )}
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="md:col-span-3 px-3 py-2 border rounded"
        />
      </form>

      <div className="bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && courses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center">
                  No courses
                </td>
              </tr>
            )}
            {courses.map((c: any) => (
              <tr key={c.id || c._id} className="border-b">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.code}</td>
                <td className="px-4 py-2">{c.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="mr-2 text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id || c._id)}
                    className="text-red-600"
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
  );
}
