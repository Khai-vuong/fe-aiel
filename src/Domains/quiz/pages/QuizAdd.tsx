import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileCheck, Clock, Users, Calendar, Settings } from 'lucide-react';

export default function QuizAdd() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        timeLimit: 60,
        maxAttempts: 3,
        shuffleQuestions: false,
        availableFrom: '',
        availableUntil: '',
        classId: '',
        status: 'draft'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Quiz name is required!');
            return;
        }

        // Mock successful creation
        console.log('Quiz Data:', {
            ...formData,
            settings_json: JSON.stringify({
                timeLimit: formData.timeLimit,
                maxAttempts: formData.maxAttempts,
                shuffleQuestions: formData.shuffleQuestions
            }),
            creator_id: localStorage.getItem('userId') || 'mock-user-id'
        });

        toast.success(`Quiz "${formData.name}" created successfully!`);

        // Navigate back after a short delay
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-[#49BBBD] mb-4 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FileCheck className="w-8 h-8 text-[#49BBBD]" />
                        Create New Quiz
                    </h1>
                    <p className="text-gray-600 mt-2">Fill in the details to create a new quiz for your class</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quiz Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                placeholder="e.g., Midterm Exam - Chapter 1-5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none resize-none"
                                placeholder="Provide a brief description of the quiz..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Class ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                placeholder="Enter class ID or leave empty"
                            />
                        </div>
                    </div>

                    {/* Quiz Settings */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Quiz Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Time Limit (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="timeLimit"
                                    value={formData.timeLimit}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Attempts
                                </label>
                                <input
                                    type="number"
                                    name="maxAttempts"
                                    value={formData.maxAttempts}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="shuffleQuestions"
                                checked={formData.shuffleQuestions}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#49BBBD] border-gray-300 rounded focus:ring-[#49BBBD]"
                                id="shuffleQuestions"
                            />
                            <label htmlFor="shuffleQuestions" className="text-sm font-medium text-gray-700">
                                Shuffle questions for each attempt
                            </label>
                        </div>
                    </div>

                    {/* Availability Schedule */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Availability Schedule
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available From
                                </label>
                                <input
                                    type="datetime-local"
                                    name="availableFrom"
                                    value={formData.availableFrom}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available Until
                                </label>
                                <input
                                    type="datetime-local"
                                    name="availableUntil"
                                    value={formData.availableUntil}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Publication Status</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.status === 'draft' && 'Quiz is not visible to students yet'}
                                {formData.status === 'published' && 'Quiz will be visible to students'}
                                {formData.status === 'archived' && 'Quiz is no longer available'}
                            </p>
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
                            className="flex-1 px-6 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <FileCheck className="w-5 h-5" />
                            Create Quiz
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This is a mock form. After creating the quiz, you can add questions and configure additional settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
