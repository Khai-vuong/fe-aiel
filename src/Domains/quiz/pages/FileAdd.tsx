import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Upload, Lock, Unlock, FileCheck } from 'lucide-react';

export default function FileAdd() {
    const navigate = useNavigate();
    const { clid } = useParams<{ clid: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        fileType: 'document',
        isPublic: false
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (e.g., max 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes
            if (file.size > maxSize) {
                toast.error('Kích thước tệp vượt quá giới hạn 50MB!');
                return;
            }
            setSelectedFile(file);
            toast.info(`Đã chọn tệp "${file.name}"`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!selectedFile) {
            toast.error('Vui lòng chọn tệp để tải lên!');
            return;
        }

        if (!clid) {
            toast.error('Không tìm thấy ID lớp học!');
            return;
        }

        // Mock file upload data
        const mockFileData = {
            fid: `file_${Date.now()}`,
            filename: selectedFile.name,
            url: `https://mockcdn.example.com/files/${selectedFile.name}`,
            size: selectedFile.size,
            mime_type: selectedFile.type,
            file_type: formData.fileType,
            is_public: formData.isPublic,
            class_id: clid,
            uploader_id: localStorage.getItem('userId') || 'mock-user-id',
            created_at: new Date().toISOString()
        };

        console.log('Uploading file:', mockFileData);

        // Simulate upload delay
        toast.info('Đang tải tệp lên...');

        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate for demo

            if (success) {
                toast.success(`Tải tệp "${selectedFile.name}" thành công!`);
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                toast.error('Tải tệp thất bại! Vui lòng thử lại.');
            }
        }, 1500);
    };

    const getFileIcon = () => {
        if (!selectedFile) return <FileText className="w-12 h-12 text-gray-400" />;

        const type = selectedFile.type;
        if (type.startsWith('image/')) {
            return <FileText className="w-12 h-12 text-blue-500" />;
        } else if (type.startsWith('video/')) {
            return <FileText className="w-12 h-12 text-purple-500" />;
        } else if (type.includes('pdf')) {
            return <FileText className="w-12 h-12 text-red-500" />;
        } else {
            return <FileText className="w-12 h-12 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 py-8 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-3xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="mb-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-[#49BBBD] mb-4 flex items-center gap-2"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Upload className="w-8 h-8 text-[#49BBBD]" />
                        Tải tệp lên
                    </h1>
                    <p className="text-gray-600 mt-2">Tải tài liệu môn học, tài liệu hoặc tệp đa phương tiện</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-6 space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Chọn tệp</h2>

                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="*/*"
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#49BBBD] hover:bg-gray-50 transition-colors"
                        >
                            {selectedFile ? (
                                <div className="space-y-3">
                                    {getFileIcon()}
                                    <div>
                                        <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Không xác định'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="text-sm text-[#49BBBD] hover:underline"
                                    >
                                        Đổi tệp
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-gray-700 font-medium">Bấm để chọn tệp</p>
                                        <p className="text-sm text-gray-500">hoặc kéo thả vào đây</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Dung lượng tối đa: 50MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Thông tin tệp</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại tệp
                            </label>
                            <select
                                name="fileType"
                                value={formData.fileType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                            >
                                <option value="document">Tài liệu</option>
                                <option value="video">Video</option>
                                <option value="image">Hình ảnh</option>
                                <option value="assignment">Bài tập</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Phân loại tệp để quản lý tốt hơn
                            </p>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#49BBBD] border-gray-300 rounded focus:ring-[#49BBBD] mt-1"
                                id="isPublic"
                            />
                            <div className="flex-1">
                                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                                    {formData.isPublic ? (
                                        <>
                                            <Unlock className="w-4 h-4 text-green-600" />
                                            Tệp công khai
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 text-gray-600" />
                                            Tệp riêng tư
                                        </>
                                    )}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.isPublic
                                        ? 'Bất kỳ ai có liên kết đều có thể truy cập tệp này'
                                        : 'Chỉ thành viên trong lớp mới có thể truy cập tệp này'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile}
                            className="flex-1 px-6 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <FileCheck className="w-5 h-5" />
                            Tải tệp lên
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Đây là form tải tệp giả lập. Tệp không được tải lên máy chủ thật.
                    </p>
                </div>

                {/* File Info Display */}
                {selectedFile && (
                    <div className="mt-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Thông tin tệp</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tên tệp:</span>
                                <span className="font-medium">{selectedFile.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dung lượng:</span>
                                <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loại MIME:</span>
                                <span className="font-medium">{selectedFile.type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Chỉnh sửa lần cuối:</span>
                                <span className="font-medium">
                                    {new Date(selectedFile.lastModified).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
