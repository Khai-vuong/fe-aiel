import { useEffect, useState } from 'react';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [student, setStudent] = useState({
    sid: 'STU001',
    name: 'Nguyen Van A',
    username: 'vana',
    email: 'vana@example.com',
    phone: '0123456789',
    major: 'Computer Science',
  });

  const [editData, setEditData] = useState(student);

  useEffect(() => {
    if (isEditing) {
      setEditData(student);
    }
  }, [isEditing, student]);

  const handleSave = () => {
    setStudent(editData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#49BBBD] mb-6 text-center">
          Student Profile
        </h1>

        {!isEditing && (
          <div className="space-y-4 text-gray-700">
            <InfoRow label="Student ID" value={student.sid} />
            <InfoRow label="Full Name" value={student.name} />
            <InfoRow label="Username" value={student.username} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone" value={student.phone} />
            <InfoRow label="Major" value={student.major} />

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full bg-[#49BBBD] text-white py-3 rounded-full font-semibold hover:bg-[#3aa4a6] transition"
            >
              Edit Profile
            </button>
          </div>
        )}

        {isEditing && (
          <div className="space-y-4">
            <InputField
              label="Full Name"
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
            />

            <InputField
              label="Email"
              value={editData.email}
              onChange={e =>
                setEditData({ ...editData, email: e.target.value })
              }
            />

            <InputField
              label="Phone"
              value={editData.phone}
              onChange={e =>
                setEditData({ ...editData, phone: e.target.value })
              }
            />

            <InputField
              label="Major"
              value={editData.major}
              onChange={e =>
                setEditData({ ...editData, major: e.target.value })
              }
            />

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#49BBBD] text-white py-3 rounded-full font-semibold hover:bg-[#3aa4a6]"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-[#49BBBD] text-gray-700"
      />
    </div>
  );
}
