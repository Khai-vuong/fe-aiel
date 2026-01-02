import { useEffect, useState } from 'react';
import { getMyClasses } from '../services/classServices';
import type { Class } from '../types';
import ClassCard from '../components/ClassCard';

export default function ClassesCatalog() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to view your classes');
                    setLoading(false);
                    return;
                }

                const data = await getMyClasses(token);
                console.log('Fetched classes:', data);
                setClasses(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load classes');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your classes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Classes</h1>
                    <p className="text-gray-600">
                        {classes.length} {classes.length === 1 ? 'class' : 'classes'} enrolled
                    </p>
                </div>

                {/* Classes Grid */}
                {classes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No classes found</p>
                        <p className="text-gray-400 mt-2">You haven't enrolled in any classes yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((classItem) => (
                            <ClassCard key={classItem.clid} classItem={classItem} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
