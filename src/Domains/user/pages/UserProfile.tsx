import { useEffect, useState } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaBook, FaBuilding, FaEnvelope, FaEdit } from 'react-icons/fa';
import usersService from '../services/users.service';
import { toast } from "react-toastify";

export default function UserProfile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error("Bạn chưa đăng nhập!");
            window.location.href = '/login';
            return;
        }

        try {
            const data = await usersService.getMyProfile();
            console.log('PROFILE DATA:', data);

            setUser(data);
            setLoading(false);
        } catch (err) {
            toast.error("Không thể lấy dữ liệu hồ sơ!");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>
            <div className="text-center relative z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-700 font-semibold text-lg">Đang tải hồ sơ...</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 text-center relative z-10">
                <p className="text-gray-700 font-semibold text-lg">Không thể tải dữ liệu hồ sơ</p>
            </div>
        </div>
    );

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
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 px-6 py-10 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* PROFILE HEADER CARD */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                <FaUser className="text-white text-4xl" />
                            </div>
                            {/* Name & Role */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">{name}</h1>
                                <p className="text-teal-600 font-semibold text-lg">{roleType}</p>
                                <p className="text-gray-600 text-sm mt-1">@{user.username}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg flex items-center gap-2 font-semibold"
                        >
                            <FaEdit /> Cập nhật hồ sơ
                        </button>
                    </div>
                </div>

                {/* CONTACT INFORMATION SECTION */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded"></span>
                        Thông tin liên hệ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 bg-teal-50/50 rounded-lg">
                            <FaEnvelope className="text-teal-600 mt-1" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Email</p>
                                <p className="text-gray-800 font-medium">{user.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50/50 rounded-lg">
                            <FaPhone className="text-teal-600 mt-1" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Số điện thoại</p>
                                <p className="text-gray-800 font-medium">{phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50/50 rounded-lg md:col-span-2">
                            <FaMapMarkerAlt className="text-teal-600 mt-1" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Địa chỉ</p>
                                <p className="text-gray-800 font-medium">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROLE-SPECIFIC INFORMATION */}
                {roleType === 'Student' && (
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded"></span>
                            Thông tin học tập
                        </h2>
                        <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-200">
                            <FaBook className="text-emerald-600 mt-1 text-xl" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Chuyên ngành</p>
                                <p className="text-gray-800 font-medium text-lg">{major}</p>
                            </div>
                        </div>
                    </div>
                )}

                {roleType === 'Lecturer' && (
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded"></span>
                            Thông tin giảng viên
                        </h2>
                        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                            <FaBuilding className="text-blue-600 mt-1 text-xl" />
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Khoa / Phòng ban</p>
                                <p className="text-gray-800 font-medium text-lg">{department}</p>
                            </div>
                        </div>
                    </div>
                )}
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
/* MODAL UPDATE PROFILE */
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

            await usersService.updateUser(user.uid, {
                status: 'Active',
                ...(roleType === 'Student' && { major }),
                personal_info_json: JSON.stringify(personalInfoData),
            });

            toast.success("Cập nhật thành công!");
            onClose();
            onUpdated();
        } catch (err) {
            toast.error("Không thể cập nhật thông tin!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-[500px] p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        Cập nhật hồ sơ
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                            <FaUser className="text-teal-600" /> Họ và tên
                        </label>
                        <input
                            className="w-full border border-teal-200 rounded-lg px-4 py-2 mb-1 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    {/* Phone & Email Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                                <FaPhone className="text-teal-600" /> Số điện thoại
                            </label>
                            <input
                                className="w-full border border-teal-200 rounded-lg px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-teal-600" /> Địa chỉ
                            </label>
                            <input
                                className="w-full border border-teal-200 rounded-lg px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                    </div>

                    {/* Student Major */}
                    {roleType === 'Student' && (
                        <div>
                            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                                <FaBook className="text-emerald-600" /> Chuyên ngành
                            </label>
                            <input
                                className="w-full border border-emerald-200 rounded-lg px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                                value={major}
                                onChange={e => setMajor(e.target.value)}
                                placeholder="Nhập chuyên ngành"
                            />
                        </div>
                    )}

                    {/* Lecturer Department */}
                    {roleType === 'Lecturer' && (
                        <div>
                            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                                <FaBuilding className="text-blue-600" /> Khoa / Phòng ban
                            </label>
                            <input
                                className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                placeholder="Nhập khoa / phòng ban"
                            />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-all"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 font-semibold transition-all shadow-lg"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
