import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassById } from '../services/classServices';
import type { Class } from '../types';
import { FileText, Users, Clock, MapPin, BookOpen, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function ClassDetail() {
    const { clid } = useParams<{ clid: string }>();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'files' | 'quizzes'>('files');
    const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(true);
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                if (!clid) {
                    setError('Class ID is required');
                    setLoading(false);
                    return;
                }

                const data = await getClassById(clid);
                setClassData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load class details');
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [clid]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-bold">Error</p>
                        <p>{error || 'Class not found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const getScheduleText = () => {
        if (!classData.schedule_json) return 'Not scheduled';
        const { day, start, end } = classData.schedule_json;
        return `${day || ''} ${start || ''} - ${end || ''}`.trim();
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="w-[80vw] mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {classData.class_name || classData.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${classData.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    classData.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {classData.status}
                                </span>
                            </div>
                        </div>
                        {userRole === 'Lecturer' && (
                            <button
                                className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium"
                                onClick={() => navigate(`/class/${classData.clid}/monitor`)}
                            >
                                Class Monitor
                            </button>
                        )}
                    </div>

                    {/* Body - Collapsible Info */}
                    {classData.course && (
                        <div className="border-t pt-4 mt-4">
                            <button
                                onClick={() => setIsCourseInfoOpen(!isCourseInfoOpen)}
                                className="flex items-center justify-between w-full gap-2 mb-2 hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-[#49BBBD]" />
                                    <h3 className="font-semibold text-lg">Class Information</h3>
                                </div>
                                {isCourseInfoOpen ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-350 ease-in-out ${isCourseInfoOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="ml-7 space-y-4">
                                    {/* Course Info */}
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Course Name</p>
                                            <p className="font-medium">{classData.course.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Course Code</p>
                                            <p className="font-medium">{classData.course.code}</p>
                                        </div>
                                        {classData.course.description && (
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">Description</p>
                                                <p className="text-gray-700">{classData.course.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Schedule & Location */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-500 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Schedule</p>
                                                <p className="font-medium">{getScheduleText()}</p>
                                            </div>
                                        </div>
                                        {classData.location && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Location</p>
                                                    <p className="font-medium">{classData.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lecturer Info */}
                                    {classData.lecturer && (
                                        <div className="pt-4 border-t">
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Instructor</p>
                                                    <p className="font-medium text-lg">{classData.lecturer.name}</p>
                                                    {classData.lecturer.personal_info_json && (
                                                        <div className="mt-1 text-sm text-gray-600">
                                                            {classData.lecturer.personal_info_json.department && (
                                                                <p>Department: {classData.lecturer.personal_info_json.department}</p>
                                                            )}
                                                            {classData.lecturer.personal_info_json.phone && (
                                                                <p>Phone: {classData.lecturer.personal_info_json.phone}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Students Count */}
                                    {classData.students && classData.students.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-gray-500" />
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">{classData.students.length}</span> students enrolled
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'files'
                                ? 'bg-[#49BBBD] text-white border-b-2 border-[#49BBBD]'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5" />
                                <span>Files ({classData.files?.length || 0})</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('quizzes')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'quizzes'
                                ? 'bg-[#49BBBD] text-white border-b-2 border-[#49BBBD]'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileCheck className="w-5 h-5" />
                                <span>Quizzes ({classData.quizzes?.length || 0})</span>
                            </div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'files' && (
                            <div className="space-y-3">
                                {userRole === 'Lecturer' && (

                                    <button
                                        onClick={() => navigate(`/class/${classData.clid}/fileAdd`)}
                                        className="w-full px-4 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Upload File
                                    </button>

                                )}
                                {classData.files && classData.files.length > 0 ? (
                                    classData.files.map((file) => (
                                        <div
                                            key={file.fid}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-[#49BBBD]" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{file.filename}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {file.file_type} • {file.is_public ? 'Public' : 'Private'}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No files available for this class</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'quizzes' && (
                            <div className="space-y-3">
                                {userRole === 'Lecturer' && (
                                    <button
                                        className="w-full px-4 py-3 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors font-medium flex items-center justify-center gap-2"
                                        onClick={() => navigate(`/class/${classData.clid}/quizAdd`)}
                                    >
                                        <FileCheck className="w-5 h-5" />
                                        Add Quiz
                                    </button>
                                )}
                                {classData.quizzes && classData.quizzes.length > 0 ? (
                                    classData.quizzes.map((quiz) => (
                                        <div
                                            key={quiz.qid}
                                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FileCheck className="w-6 h-6 text-[#49BBBD]" />
                                                        <h3 className="font-semibold text-lg text-gray-800">
                                                            {quiz.name}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${quiz.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {quiz.status}
                                                        </span>
                                                    </div>
                                                    {quiz.description && (
                                                        <p className="text-gray-600 mb-2">{quiz.description}</p>
                                                    )}
                                                    {(quiz.available_from || quiz.available_until) && (
                                                        <div className="text-sm text-gray-500">
                                                            {quiz.available_from && (
                                                                <p>Available from: {new Date(quiz.available_from).toLocaleString()}</p>
                                                            )}
                                                            {quiz.available_until && (
                                                                <p>Available until: {new Date(quiz.available_until).toLocaleString()}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <button className="px-4 py-2 bg-[#49BBBD] text-white rounded-lg hover:bg-[#3a9ea0] transition-colors">
                                                    Take Quiz
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No quizzes available for this class</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
