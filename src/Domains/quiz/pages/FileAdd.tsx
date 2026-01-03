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
        classId: clid || '',
        fileType: 'document',
        isPublic: false
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (e.g., max 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes
            if (file.size > maxSize) {
                toast.error('File size exceeds 50MB limit!');
                return;
            }
            setSelectedFile(file);
            toast.info(`File "${file.name}" selected`);
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
            toast.error('Please select a file to upload!');
            return;
        }

        if (!formData.classId.trim()) {
            toast.error('Class ID is required!');
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
            class_id: formData.classId,
            uploader_id: localStorage.getItem('userId') || 'mock-user-id',
            created_at: new Date().toISOString()
        };

        console.log('Uploading file:', mockFileData);

        // Simulate upload delay
        toast.info('Uploading file...');

        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate for demo

            if (success) {
                toast.success(`File "${selectedFile.name}" uploaded successfully!`);
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                toast.error('Upload failed! Please try again.');
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-[#49BBBD] mb-4 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Upload className="w-8 h-8 text-[#49BBBD]" />
                        Upload File
                    </h1>
                    <p className="text-gray-600 mt-2">Upload course materials, documents, or media files</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Select File</h2>

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
                                            {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
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
                                        Change file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-gray-700 font-medium">Click to select a file</p>
                                        <p className="text-sm text-gray-500">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Max file size: 50MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">File Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                placeholder="Enter class ID"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                File Type
                            </label>
                            <select
                                name="fileType"
                                value={formData.fileType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                            >
                                <option value="document">Document</option>
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                                <option value="assignment">Assignment</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Categorize the file for better organization
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
                                            Public File
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 text-gray-600" />
                                            Private File
                                        </>
                                    )}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.isPublic
                                        ? 'Anyone with the link can access this file'
                                        : 'Only class members can access this file'}
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile}
                            className="flex-1 px-6 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <FileCheck className="w-5 h-5" />
                            Upload File
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This is a mock upload form. No files are actually uploaded to a server.
                    </p>
                </div>

                {/* File Info Display */}
                {selectedFile && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">File Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Filename:</span>
                                <span className="font-medium">{selectedFile.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">MIME Type:</span>
                                <span className="font-medium">{selectedFile.type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Modified:</span>
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
