import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/usersService';

export default function StudentProfile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
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

            setUser(data);
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
    if (!user) return <p className="text-center mt-10">Không có dữ liệu.</p>;

    // Get role-specific data
    const roleData = user.student || user.lecturer || user.admin;
    const roleType = user.role;

    // Get personal info (admin uses personal_info, others use personal_info_json)
    const personalInfo = user.student?.personal_info_json || user.lecturer?.personal_info_json || user.admin?.personal_info || {};

    const name = roleData?.name || 'N/A';
    const phone = personalInfo?.phone || 'N/A';
    const address = personalInfo?.address || 'N/A';
    const major = user.student?.major || 'N/A';
    const department = user.lecturer?.personal_info_json?.department || 'N/A';

    return (
        <div className="min-h-screen bg-[#F5F7FA] px-6 py-10">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                {/* Header + Update Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#49BBBD]">{roleType} Profile</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3FA9AA]"
                    >
                        Update Profile
                    </button>
                </div>

                <ProfileRow label="Full Name" value={name} />
                <ProfileRow label="Role" value={roleType} />
                <ProfileRow label="Username" value={user.username} />
                <ProfileRow label="Phone" value={phone} />
                <ProfileRow label="Address" value={address} />
                {roleType === 'Student' && <ProfileRow label="Major" value={major} />}
                {roleType === 'Lecturer' && <ProfileRow label="Department" value={department} />}
            </div>

            {/* Update Form Modal */}
            {showForm && (
                <EditProfileModal
                    user={user}
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
    user,
    onClose,
    onUpdated,
}: {
    user: any;
    onClose: () => void;
    onUpdated: () => void;
}) {
    // Get role-specific data
    const roleData = user.student || user.lecturer || user.admin;
    const roleType = user.role;
    const personalInfo = user.student?.personal_info_json || user.lecturer?.personal_info_json || user.admin?.personal_info || {};

    const [name, setName] = useState(roleData?.name || '');
    const [phone, setPhone] = useState(personalInfo?.phone || '');
    const [address, setAddress] = useState(personalInfo?.address || '');
    const [major, setMajor] = useState(user.student?.major || '');
    const [department, setDepartment] = useState(user.lecturer?.personal_info_json?.department || '');

    const token = localStorage.getItem('token');

    const handleSubmit = async () => {
        if (!token) return;

        try {
            const personalInfoData: any = {
                phone,
                address,
                name,
            };

            // Add role-specific fields
            if (roleType === 'Lecturer') {
                personalInfoData.department = department;
                if (personalInfo?.dob) personalInfoData.dob = personalInfo.dob;
            }
            if (user.admin?.personal_info?.dob) {
                personalInfoData.dob = user.admin.personal_info.dob;
            }

            await updateUserProfile(user.uid, token, {
                status: 'Active',
                ...(roleType === 'Student' && { major }),
                personal_info_json: JSON.stringify(personalInfoData),
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

                {roleType === 'Student' && (
                    <>
                        <label className="font-semibold">Major</label>
                        <input
                            className="w-full border rounded p-2 mb-4"
                            value={major}
                            onChange={e => setMajor(e.target.value)}
                        />
                    </>
                )}

                {roleType === 'Lecturer' && (
                    <>
                        <label className="font-semibold">Department</label>
                        <input
                            className="w-full border rounded p-2 mb-4"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                        />
                    </>
                )}

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
