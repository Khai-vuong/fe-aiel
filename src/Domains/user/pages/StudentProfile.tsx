import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/usersService';

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Bạn chưa đăng nhập!');
      window.location.href = '/login';
      return;
    }

    try {
      const data = await getUserProfile(token);
      console.log('PROFILE DATA:', data);

      setStudent({
        uid: data.uid,
        sid: data.student?.sid ?? 'N/A',
        name: data.student?.name ?? 'N/A',
        username: data.username,
        phone: data.student?.personal_info_json?.phone ?? 'N/A',
        major: data.student?.major ?? 'N/A',
        address: data.student?.personal_info_json?.address ?? 'N/A',
      });

      setLoading(false);
    } catch (err) {
      alert('Không thể lấy dữ liệu hồ sơ!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (!student) return <p className="text-center mt-10">Không có dữ liệu.</p>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header + Update Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#49BBBD]">Student Profile</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3FA9AA]"
          >
            Update Profile
          </button>
        </div>

        <ProfileRow label="Student ID" value={student.sid} />
        <ProfileRow label="Full Name" value={student.name} />
        <ProfileRow label="Username" value={student.username} />
        <ProfileRow label="Phone" value={student.phone} />
        <ProfileRow label="Major" value={student.major} />
        <ProfileRow label="Address" value={student.address} />
      </div>

      {/* Update Form Modal */}
      {showForm && (
        <EditProfileModal
          student={student}
          onClose={() => setShowForm(false)}
          onUpdated={fetchProfile}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* ROW HIỂN THỊ THÔNG TIN */
/* -------------------------------------------------- */
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2 mb-3">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* -------------------------------------------------- */
/* POPUP UPDATE PROFILE */
/* -------------------------------------------------- */

function EditProfileModal({
  student,
  onClose,
  onUpdated,
}: {
  student: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone);
  const [address, setAddress] = useState(student.address);
  const [major, setMajor] = useState(student.major);

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!token) return;

    try {
      await updateUserProfile(student.uid, token, {
        status: 'Active',
        major,
        personal_info_json: JSON.stringify({
          phone,
          address,
          name,
        }),
      });

      alert('Cập nhật thành công!');
      onClose();
      onUpdated();
    } catch (err) {
      alert('Không thể cập nhật thông tin!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-xl font-bold text-[#49BBBD] mb-4">
          Update Profile
        </h2>

        <label className="font-semibold">Full Name</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label className="font-semibold">Phone</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <label className="font-semibold">Address</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        {/* 
        <label className="font-semibold">Major</label>
        <input
          className="w-full border rounded p-2 mb-4"
          value={major}
          onChange={e => setMajor(e.target.value)}
        /> */}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
