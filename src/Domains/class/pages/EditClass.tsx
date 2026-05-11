import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateClass } from '../services/classServices';
import type { Class, ClassUpdateDto } from '../types';

export default function EditClass() {
    const navigate = useNavigate();
    const location = useLocation();
    const classData = location.state?.classData as Class | undefined;

    const [formData, setFormData] = useState<ClassUpdateDto>({
        name: '',
        schedule_json: '',
        location: '',
        status: 'Active',
        lecturer_id: '',
    });

    const [scheduleData, setScheduleData] = useState({
        day: '',
        start: '',
        end: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!classData) {
            toast.error('Không có dữ liệu lớp học. Đang chuyển hướng...');
            setTimeout(() => navigate(-1), 2000);
            return;
        }

        // Parse schedule_json if it exists
        let parsedSchedule = { day: '', start: '', end: '' };
        if (classData.schedule_json) {
            try {
                const scheduleStr = typeof classData.schedule_json === 'string'
                    ? classData.schedule_json
                    : JSON.stringify(classData.schedule_json);
                parsedSchedule = JSON.parse(scheduleStr);
            } catch (err) {
                console.error('Failed to parse schedule_json:', err);
            }
        }

        setFormData({
            name: classData.name || classData.class_name || '',
            schedule_json: classData.schedule_json ?
                (typeof classData.schedule_json === 'string' ? classData.schedule_json : JSON.stringify(classData.schedule_json))
                : '',
            location: classData.location || '',
            status: classData.status || 'Active',
            lecturer_id: classData.lecturer_id || '',
        });

        setScheduleData(parsedSchedule);
    }, [classData, navigate]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleScheduleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setScheduleData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!classData?.clid) {
            toast.error('Class ID is missing!');
            return;
        }

        setIsLoading(true);

        try {
            // Build schedule_json from scheduleData
            const scheduleJson = JSON.stringify({
                day: scheduleData.day,
                start: scheduleData.start,
                end: scheduleData.end,
            });

            const updateData: ClassUpdateDto = {
                ...formData,
                schedule_json: scheduleJson,
            };

            await updateClass(classData.clid, updateData);
            toast.success('Cập nhật lớp học thành công!');

            setTimeout(() => {
                navigate(-1); // Go back to previous page
            }, 1500);
        } catch (error) {
            console.error('Error updating class:', error);
            toast.error(error instanceof Error ? error.message : 'Không thể cập nhật lớp học');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!classData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 py-8 px-4 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-4xl mx-auto relative z-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-[#49BBBD] mb-4 flex items-center gap-2"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Sửa thông tin lớp</h1>

                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Class Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên lớp <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                            placeholder="VD: CS101 - L1"
                        />
                    </div>

                    {/* Schedule Section */}
                    <div className="border border-white/30 bg-white/50 backdrop-blur-sm rounded-2xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch học</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Day */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thứ
                                </label>
                                <select
                                    name="day"
                                    value={scheduleData.day}
                                    onChange={handleScheduleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                                >
                                    <option value="">Chọn thứ</option>
                                    <option value="Monday">Thứ Hai</option>
                                    <option value="Tuesday">Thứ Ba</option>
                                    <option value="Wednesday">Thứ Tư</option>
                                    <option value="Thursday">Thứ Năm</option>
                                    <option value="Friday">Thứ Sáu</option>
                                    <option value="Saturday">Thứ Bảy</option>
                                    <option value="Sunday">Chủ Nhật</option>
                                </select>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giờ bắt đầu
                                </label>
                                <input
                                    type="time"
                                    name="start"
                                    value={scheduleData.start}
                                    onChange={handleScheduleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giờ kết thúc
                                </label>
                                <input
                                    type="time"
                                    name="end"
                                    value={scheduleData.end}
                                    onChange={handleScheduleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa điểm
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                            placeholder="VD: Tòa nhà Khoa học - Phòng 205"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent"
                        >
                            <option value="Active">Đang hoạt động</option>
                            <option value="Completed">Đã hoàn thành</option>
                            <option value="Cancelled">Đã hủy</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                flex-1 py-3 px-6 
                bg-[#49BBBD] text-white font-semibold rounded-lg
                hover:bg-[#3AA9AD] transition shadow-md
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                        >
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật lớp'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="
                flex-1 py-3 px-6 
                bg-gray-300 text-gray-700 font-semibold rounded-lg
                hover:bg-gray-400 transition shadow-md
              "
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
