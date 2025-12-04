import { useEffect, useState } from 'react';

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Bạn chưa đăng nhập!');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        console.log('PROFILE DATA:', data);

        setStudent({
          sid: data.student?.sid ?? 'N/A',
          name: data.student?.name ?? 'N/A',
          username: data.username ?? 'N/A',
          major: data.student?.major ?? 'N/A',

          // API không trả -> gán N/A
          phone: data.student?.personal_info_json?.phone ?? 'N/A',
          address: data.student?.personal_info_json?.address ?? 'N/A',
        });

        setLoading(false);
      } catch (err) {
        alert('Không thể lấy dữ liệu hồ sơ!');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;

  if (!student) return <p className="text-center mt-10">Không có dữ liệu.</p>;

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#49BBBD] mb-6 text-center">
          Student Profile
        </h1>

        <ProfileRow label="Student ID" value={student.sid} />
        <ProfileRow label="Full Name" value={student.name} />
        <ProfileRow label="Username" value={student.username} />
        <ProfileRow label="Phone" value={student.phone} />
        <ProfileRow label="Major" value={student.major} />
        <ProfileRow label="Address" value={student.address} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2 mb-3">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}
