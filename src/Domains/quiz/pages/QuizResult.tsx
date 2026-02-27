import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Award,
    CheckCircle,
    XCircle,
    Calendar,
    Clock,
    Target,
    TrendingUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { attemptService } from '../services';
import type { Attempt, Answer } from '../types';

interface Option {
    id: string;
    content: string;
}

interface ProcessedQuestion {
    ques_id: string;
    content: string;
    options: Option[];
    answer_key: string;
    points: number;
    student_answer?: string;
    is_correct?: boolean;
    points_awarded?: number;
}

export default function QuizResult() {
    const { atid } = useParams<{ atid: string }>();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                if (!atid) return;

                const data = await attemptService.getAttemptById(atid);

                // Check if attempt is completed
                if (data.status === 'in_progress') {
                    toast.warning('Bài thi chưa được nộp.');
                    navigate(`/take-quiz/${atid}`, { replace: true });
                    return;
                }

                setAttempt(data);

                // Process questions and answers
                if (data.answers && data.answers.length > 0) {
                    const processedQuestions = data.answers.map((ans: Answer) => {
                        const question = ans.question;
                        if (!question) return null;

                        // Parse options
                        let options: Option[] = [];
                        try {
                            const optionsData =
                                typeof question.options_json === 'string'
                                    ? JSON.parse(question.options_json)
                                    : question.options_json;

                            if (typeof optionsData === 'object' && optionsData !== null) {
                                options = Object.entries(optionsData).map(([key, value]) => ({
                                    id: key,
                                    content: String(value),
                                }));
                            }
                        } catch (e) {
                            console.error('Error parsing options:', e);
                        }

                        // Parse answer key
                        let answerKey = '';
                        try {
                            const keyData =
                                typeof question.answer_key_json === 'string'
                                    ? JSON.parse(question.answer_key_json)
                                    : question.answer_key_json;

                            if (typeof keyData === 'string') {
                                answerKey = keyData;
                            } else if (keyData?.correct) {
                                answerKey = keyData.correct;
                            }
                        } catch (e) {
                            console.error('Error parsing answer key:', e);
                        }

                        // Parse student answer
                        let studentAnswer = '';
                        try {
                            const ansData =
                                typeof ans.answer_json === 'string'
                                    ? JSON.parse(ans.answer_json)
                                    : ans.answer_json;

                            if (typeof ansData === 'string') {
                                studentAnswer = ansData;
                            } else if (ansData?.answer) {
                                studentAnswer = ansData.answer;
                            }
                        } catch (e) {
                            console.error('Error parsing student answer:', e);
                        }

                        return {
                            ques_id: question.ques_id,
                            content: question.content,
                            options,
                            answer_key: answerKey,
                            points: question.points || 0,
                            student_answer: studentAnswer,
                            is_correct: ans.is_correct,
                            points_awarded: ans.points_awarded || 0,
                        };
                    }).filter(Boolean) as ProcessedQuestion[];

                    setQuestions(processedQuestions);
                }
            } catch (error) {
                console.error('Error loading quiz result:', error);
                toast.error('Không thể tải kết quả bài thi.');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [atid, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49BBBD] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải kết quả...</p>
                </div>
            </div>
        );
    }

    if (!attempt) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy kết quả bài thi.</p>
                </div>
            </div>
        );
    }

    const percentage = attempt.percentage || 0;
    const score = attempt.score || 0;
    const maxScore = attempt.max_score || 0;
    const correctCount = questions.filter(q => q.is_correct).length;
    const totalQuestions = questions.length;

    // Determine pass/fail status (assuming 50% is passing)
    const isPassed = percentage >= 50;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#49BBBD] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                </button>

                {/* Result Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <div className="text-center mb-6">
                        <div
                            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-red-100'
                                }`}
                        >
                            {isPassed ? (
                                <CheckCircle size={48} className="text-green-600" />
                            ) : (
                                <XCircle size={48} className="text-red-600" />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {attempt.quiz?.name || 'Kết quả bài thi'}
                        </h1>
                        <p
                            className={`text-xl font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {isPassed ? 'Đạt yêu cầu' : 'Chưa đạt'}
                        </p>
                    </div>

                    {/* Score Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Điểm số</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {percentage.toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Đúng / Tổng</p>
                            <p className="text-2xl font-bold text-green-600">
                                {correctCount}/{totalQuestions}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Lần thử</p>
                            <p className="text-2xl font-bold text-orange-600">
                                #{attempt.attempt_number}
                            </p>
                        </div>
                    </div>

                    {/* Time Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                                Bắt đầu: {new Date(attempt.started_at).toLocaleString('vi-VN')}
                            </span>
                        </div>
                        {attempt.submitted_at && (
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>
                                    Nộp bài: {new Date(attempt.submitted_at).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Chi tiết câu hỏi
                    </h2>

                    {questions.map((question, index) => (
                        <div
                            key={question.ques_id}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            {/* Question Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${question.is_correct
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                        }`}
                                >
                                    {question.is_correct ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <XCircle size={20} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-800">
                                            Câu {index + 1}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {question.points_awarded}/{question.points} điểm
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-4">{question.content}</p>

                                    {/* Options */}
                                    {question.options.length > 0 && (
                                        <div className="space-y-2">
                                            {question.options.map(option => {
                                                const isStudentAnswer =
                                                    option.id === question.student_answer;
                                                const isCorrectAnswer =
                                                    option.id === question.answer_key;

                                                let optionClass = 'bg-gray-50 border-gray-200';
                                                if (isCorrectAnswer) {
                                                    optionClass = 'bg-green-50 border-green-300';
                                                } else if (isStudentAnswer && !question.is_correct) {
                                                    optionClass = 'bg-red-50 border-red-300';
                                                }

                                                return (
                                                    <div
                                                        key={option.id}
                                                        className={`p-3 rounded-lg border-2 ${optionClass} transition-colors`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-700">
                                                                {option.id}.
                                                            </span>
                                                            <span className="flex-1 text-gray-700">
                                                                {option.content}
                                                            </span>
                                                            {isCorrectAnswer && (
                                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                                    <CheckCircle size={16} />
                                                                    Đáp án đúng
                                                                </span>
                                                            )}
                                                            {isStudentAnswer && !isCorrectAnswer && (
                                                                <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                                                    <XCircle size={16} />
                                                                    Bạn đã chọn
                                                                </span>
                                                            )}
                                                            {isStudentAnswer && isCorrectAnswer && (
                                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                                    <CheckCircle size={16} />
                                                                    Bạn đã chọn
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* No options - show text answer */}
                                    {question.options.length === 0 && (
                                        <div className="space-y-2">
                                            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Câu trả lời của bạn:
                                                </p>
                                                <p className="text-gray-800">
                                                    {question.student_answer || '(Không có câu trả lời)'}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 border-2 border-green-200 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Đáp án đúng:</p>
                                                <p className="text-gray-800">{question.answer_key}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
}
