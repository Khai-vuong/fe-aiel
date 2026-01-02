import type { Class } from '../types';
import { useNavigate } from 'react-router-dom';

import { Tag, House, Clock } from 'lucide-react'

interface ClassCardProps {
    classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
    const navigate = useNavigate();
    const colorPalettes = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-teal-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-pink-500 to-rose-500',
        'from-yellow-500 to-orange-500',
        'from-teal-500 to-green-500',
        'from-cyan-500 to-blue-500',
        'from-rose-500 to-pink-500',
        'from-violet-500 to-purple-500',
        'from-lime-500 to-green-500',
    ];

    const getHeaderGradient = (classId: string) => {
        // Generate consistent color based on class ID
        let hash = 0;
        for (let i = 0; i < classId.length; i++) {
            hash = classId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colorPalettes.length;
        return colorPalettes[index];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-500';
            case 'Completed':
                return 'bg-blue-500';
            case 'Cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getSchedule = (schedules_json: any) => {
        return schedules_json ? `${schedules_json.start} - ${schedules_json.end}` : '';
    }

    const schedule = getSchedule(classItem.schedule_json);
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${getHeaderGradient(classItem.clid)} p-4`}>
                <h3 className="text-white font-semibold text-lg truncate">
                    {classItem.class_name}
                </h3>
                <div className="flex items-center mt-2">
                    <span
                        className={`${getStatusColor(classItem.status)} text-white text-xs px-3 py-1 rounded-full`}
                    >
                        {classItem.status}
                    </span>
                    <span className='text-xl font-bold ml-3'>
                        {classItem.course.name ? ` ${classItem.course.name}` : ''}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Class ID:</span>
                    <span className="ml-1 text-gray-800">{classItem.clid}</span>
                </div>

                {classItem.schedule_json && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Schedule:</span>
                        <span className="ml-1 text-gray-800">{schedule}</span>
                    </div>
                )}

                {classItem.location && (
                    <div className="flex items-center text-sm text-gray-600">
                        <House className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-1 text-gray-800">{classItem.location}</span>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4">
                <button
                    onClick={() => navigate(`/class/${classItem.clid}`)}
                    className="w-full bg-[#49BBBD] hover:bg-[#3a9ea0] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
