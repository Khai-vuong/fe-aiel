import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BotMessageSquare, Loader2, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import aiConversationService, {
    type AiStreamProgressEvent,
    type ConversationSummary,
    type Message,
} from '../Domains/ai/services/AiConversation.service';

type SidebarMessage = {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    createdAt: string;
    completionTime?: number | null;
    isStreaming?: boolean;
};

type AiChatSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

type SidebarMode = 'pick' | 'chat';

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

const formatCompletionTime = (value?: number | null) => {
    if (value === undefined || value === null) {
        return '';
    }

    if (value < 1000) {
        return `${value}ms`;
    }

    return `${(value / 1000).toFixed(1)}s`;
};

const normalizeMarkdownContent = (raw: string) => {
    // Some providers return escaped newlines ("\\n") instead of real line breaks.
    const content = raw.replace(/\\n/g, '\n');
    const lines = content.split('\n');
    let hasParentBullet = false;

    return lines
        .map((line) => {
            const trimmed = line.trim();

            if (/^[*-]\s+/.test(trimmed)) {
                hasParentBullet = true;
                return `- ${trimmed.replace(/^[*-]\s+/, '')}`;
            }

            if (hasParentBullet && /^\+\s+/.test(trimmed)) {
                return `  - ${trimmed.replace(/^\+\s+/, '')}`;
            }

            return line;
        })
        .join('\n');
};

const formatStreamValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        return value
            .map((item) => formatStreamValue(item))
            .filter(Boolean)
            .join(', ');
    }

    if (value && typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
};

const formatProgressBlock = (event: AiStreamProgressEvent) => {
    const lines: string[] = [];

    if (event.stage) {
        lines.push(`**${event.stage}**`);
    }

    if (event.message) {
        lines.push(event.message);
    }

    if (event.data && Object.keys(event.data).length > 0) {
        lines.push(
            Object.entries(event.data)
                .map(([key, value]) => `${key}: ${formatStreamValue(value)}`)
                .join(' · '),
        );
    }

    return lines.join('\n');
};

export default function AiChatSidebar({ isOpen, onClose }: AiChatSidebarProps) {
    const location = useLocation();
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [messages, setMessages] = useState<SidebarMessage[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [conversationTitle, setConversationTitle] = useState<string>('');
    const [mode, setMode] = useState<SidebarMode>('pick');
    const [conversationListLoading, setConversationListLoading] = useState(false);
    const [conversationMessagesLoading, setConversationMessagesLoading] = useState(false);
    const [hasLoadedConversations, setHasLoadedConversations] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const isAuthenticated = Boolean(localStorage.getItem('token'));

    const getContextFromPath = (pathname: string) => {
        const classMatch = pathname.match(/(?:^|\/)class\/([^/]+)/i);
        const quizMatch = pathname.match(/(?:^|\/)quiz\/([^/]+)/i);

        const classId = classMatch?.[1] ? decodeURIComponent(classMatch[1]) : undefined;
        const rawQuizId = quizMatch?.[1] ? decodeURIComponent(quizMatch[1]) : undefined;
        const quizId = rawQuizId && rawQuizId.toLowerCase() !== 'create' ? rawQuizId : undefined;

        return { classId, quizId };
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        if (!isOpen || !isAuthenticated) {
            return;
        }

        if (hasLoadedConversations || conversationListLoading) {
            return;
        }

        const loadConversations = async () => {
            try {
                setConversationListLoading(true);
                const response = await aiConversationService.getConversations({
                    limit: 20,
                    offset: 0,
                });

                setConversations(response.conversations);
            } catch (error) {
                console.error('AI sidebar conversations error:', error);
                setErrorMessage('Không thể tải danh sách conversation.');
            } finally {
                setConversationListLoading(false);
                setHasLoadedConversations(true);
            }
        };

        void loadConversations();
    }, [hasLoadedConversations, isAuthenticated, isOpen, conversationListLoading]);

    const mapApiMessage = (message: Message): SidebarMessage | null => {
        if (message.role !== 'user' && message.role !== 'assistant') {
            return null;
        }

        return {
            id: message.messageId,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
            completionTime:
                typeof message.metadata?.processingTime === 'number'
                    ? message.metadata.processingTime
                    : null,
        };
    };

    const activeConversations = conversations.filter(
        (conversation) => conversation.status === 'active',
    );

    const loadConversationMessages = async (selectedConversationId: string) => {
        try {
            setMode('chat');
            setConversationMessagesLoading(true);
            setErrorMessage(null);

            const response = await aiConversationService.getConversationMessages(
                selectedConversationId,
                { limit: 50 },
            );

            const mappedMessages = response.messages
                .map(mapApiMessage)
                .filter((message): message is SidebarMessage => message !== null);

            setMessages(mappedMessages.length > 0 ? mappedMessages : []);
            setConversationId(selectedConversationId);
            setConversationTitle(response.conversation.title ?? 'Untitled conversation');
        } catch (error) {
            console.error('AI sidebar conversation load error:', error);
            setMessages([]);
            setErrorMessage('Không thể tải nội dung conversation này.');
        } finally {
            setConversationMessagesLoading(false);
        }
    };


    const returnToConversationPicker = () => {
        setConversationId(null);
        setConversationTitle('');
        setMode('pick');
        setMessages([]);
        setInput('');
        setErrorMessage(null);
    };

    const handleSelectConversation = (selectedConversation: ConversationSummary) => {
        void loadConversationMessages(selectedConversation.conversationId);
    };

    const appendMessage = (
        role: SidebarMessage['role'],
        content: string,
        completionTime?: number | null,
        isStreaming = false,
    ) => {
        const messageId = `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setMessages((current) => [
            ...current,
            {
                id: messageId,
                role,
                content,
                createdAt: new Date().toISOString(),
                completionTime: completionTime ?? null,
                isStreaming,
            },
        ]);

        return messageId;
    };

    const updateMessage = (messageId: string, updater: (message: SidebarMessage) => SidebarMessage) => {
        setMessages((current) => current.map((message) => (message.id === messageId ? updater(message) : message)));
    };

    const removeMessage = (messageId: string) => {
        setMessages((current) => current.filter((message) => message.id !== messageId));
    };

    const handleSend = async (text?: string) => {
        const userText = (text ?? input).trim();

        if (!userText || sending) {
            return;
        }

        if (!isAuthenticated) {
            setErrorMessage('Bạn cần đăng nhập để sử dụng trợ lý AI.');
            return;
        }

        setErrorMessage(null);
        setInput('');
        if (mode === 'pick') {
            setMode('chat');
        }
        appendMessage('user', userText);
        setSending(true);
        const assistantMessageId = appendMessage('assistant', '', null, true);

        try {
            const { classId, quizId } = getContextFromPath(location.pathname);

            const response = await aiConversationService.streamChat(
                {
                    text: userText,
                    conversationId: conversationId ?? undefined,
                    provider: 'groq',
                    serviceType: 'TEACHING_ASSISTANT',
                    metadata: {
                        sendFrom: 'AiChatSidebar',
                        classId,
                        quizId,
                    },
                },
                {
                    onProgress: (event) => {
                        updateMessage(assistantMessageId, (message) => ({
                            ...message,
                            content: formatProgressBlock(event),
                        }));
                    },
                },
            );

            if (!response.success) {
                throw new Error(response.error?.message ?? 'AI chat failed');
            }

            updateMessage(assistantMessageId, (message) => ({
                ...message,
                content: response.text,
                completionTime: response.metadata?.processingTime ?? null,
                isStreaming: false,
            }));

            if (!conversationId && response.conversationId) {
                setConversationId(response.conversationId);
                setConversationTitle(response.conversationTitle ?? 'New conversation');

                if (isAuthenticated) {
                    try {
                        const refreshed = await aiConversationService.getConversations({
                            limit: 20,
                            offset: 0,
                        });

                        setConversations(refreshed.conversations);
                    } catch (refreshError) {
                        console.error('AI sidebar refresh conversations error:', refreshError);
                    }
                }
            }
        } catch (error) {
            console.error('AI sidebar chat error:', error);
            removeMessage(assistantMessageId);
            setErrorMessage('Không thể gửi tin nhắn lúc này. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <aside
                aria-label="Trợ lý AI"
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-white/15 bg-[#0B1320] text-white shadow-2xl shadow-slate-950/30 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-start justify-between border-b border-white/10 bg-gradient-to-r from-[#49BBBD] to-[#2f7f80] px-5 py-4">
                    <div className="flex items-start gap-3">
                        {mode === 'chat' ? (
                            <button
                                type="button"
                                onClick={returnToConversationPicker}
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg shadow-black/10 transition hover:bg-white/25"
                                aria-label="Quay lại chế độ chọn conversation"
                            >
                                <ArrowLeft
                                    size={24}
                                    strokeWidth={2.75}
                                    className="!h-6 !w-6 shrink-0"
                                />
                            </button>
                        ) : (
                            <div className="flex h-11 w-11 shrink-0 aspect-square items-center justify-center rounded-full bg-white/15 text-white shadow-lg shadow-black/10">
                                <BotMessageSquare size={20} strokeWidth={2} />

                            </div>
                        )}
                        <div>

                            <p className="mt-1 text-lg font-bold text-white/85">
                                {mode === 'pick'
                                    ? 'Chọn một conversation đang hoạt động hoặc nhắn trực tiếp để tạo chat mới.'
                                    : conversationTitle || 'Untitled conversation'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                        aria-label="Đóng trợ lý AI"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {!isAuthenticated ? (
                        <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-50">
                            <p className="font-semibold text-amber-100">Bạn chưa đăng nhập</p>
                            <p className="mt-1 text-amber-50/90">
                                Đăng nhập để bắt đầu trò chuyện với AI và lưu lại lịch sử trao đổi.
                            </p>
                            <Link
                                to="/login"
                                className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0B1320] transition hover:bg-slate-100"
                                onClick={onClose}
                            >
                                Đi tới đăng nhập
                                <Sparkles className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : null}

                    {isAuthenticated && mode === 'pick' ? (
                        <div className="space-y-4">

                            {conversationListLoading ? (
                                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#49BBBD]" />
                                    Đang tải conversations...
                                </div>
                            ) : null}

                            {!conversationListLoading && activeConversations.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                                    Chưa có conversation nào. Hãy bắt đầu chat mới để backend tự tạo conversation.
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                {activeConversations.map((conversation) => (
                                    <button
                                        key={conversation.conversationId}
                                        type="button"
                                        onClick={() => handleSelectConversation(conversation)}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#49BBBD]/40 hover:bg-[#49BBBD]/10"
                                    >
                                        <p className="truncate font-semibold text-white">
                                            {conversation.title ?? 'Untitled conversation'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {isAuthenticated && mode === 'chat' ? (
                        <div className="space-y-4">
                            {conversationMessagesLoading ? (
                                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#49BBBD]" />
                                    Đang tải tin nhắn...
                                </div>
                            ) : null}

                            <div className="space-y-3">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {(() => {
                                            const isStream = Boolean(message.isStreaming);

                                            return (
                                                <div
                                                    className={`max-w-[85%] rounded-3xl px-4 py-3 leading-relaxed shadow-lg ${isStream
                                                        ? 'bg-[#0a0f18] text-slate-300 shadow-black/30 text-xs'
                                                        : message.role === 'user'
                                                            ? 'bg-[#49BBBD] text-white shadow-teal-900/20 text-sm'
                                                            : 'bg-white text-slate-800 shadow-black/10 text-sm'
                                                        }`}
                                                >
                                                    {message.isStreaming && !message.content ? (
                                                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                                                            <Loader2 className="h-4 w-4 animate-spin text-[#49BBBD]" />
                                                            Đang nhận luồng suy nghĩ từ backend...
                                                        </div>
                                                    ) : null}

                                                    <ReactMarkdown
                                                        components={{
                                                            h1: ({ children }) => <h1 className={`mb-3 mt-4 ${isStream ? 'text-sm' : 'text-base'} font-bold first:mt-0`}>{children}</h1>,
                                                            h2: ({ children }) => <h2 className={`mb-2 mt-3 ${isStream ? 'text-[13px]' : 'text-sm'} font-bold first:mt-0`}>{children}</h2>,
                                                            h3: ({ children }) => <h3 className={`mb-2 mt-2 ${isStream ? 'text-[12px]' : 'text-sm'} font-semibold first:mt-0`}>{children}</h3>,
                                                            h4: ({ children }) => <h4 className={`mb-2 mt-2 ${isStream ? 'text-[11px]' : 'text-xs'} font-semibold first:mt-0`}>{children}</h4>,
                                                            h5: ({ children }) => <h5 className={`mb-1 mt-2 ${isStream ? 'text-[11px]' : 'text-xs'} font-semibold first:mt-0`}>{children}</h5>,
                                                            h6: ({ children }) => <h6 className={`mb-1 mt-2 ${isStream ? 'text-[11px]' : 'text-xs'} font-semibold first:mt-0`}>{children}</h6>,
                                                            p: ({ children }) => <p className={`mb-2 ${isStream ? 'text-xs' : ''} last:mb-0`}>{children}</p>,
                                                            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                            em: ({ children }) => <em className="italic">{children}</em>,
                                                            ul: ({ children }) => (
                                                                <ul className="mb-1 list-disc space-y-0.5 pl-4 text-xs [&_ul]:mt-1 [&_ul]:list-circle [&_ul]:pl-4">
                                                                    {children}
                                                                </ul>
                                                            ),
                                                            ol: ({ children, start }) => (
                                                                <ol start={start} className={`mb-2 list-decimal space-y-0.5 pl-5 ${isStream ? 'text-xs' : ''} [&_ol]:mt-1 [&_ol]:pl-5`}>
                                                                    {children}
                                                                </ol>
                                                            ),
                                                            li: ({ children }) => <li className="ml-1">{children}</li>,
                                                            blockquote: ({ children }) => (
                                                                <blockquote className={`mb-2 border-l-2 py-1 pl-3 italic ${message.role === 'user' ? 'border-white/60 text-white/90' : isStream ? 'border-slate-500 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                                                    {children}
                                                                </blockquote>
                                                            ),
                                                            code: ({ children, className }) => {
                                                                if (className) {
                                                                    return (
                                                                        <pre className={`mb-2 overflow-x-auto rounded p-3 ${isStream ? 'text-[11px]' : 'text-xs'} ${message.role === 'user' ? 'bg-black/25 text-white' : 'bg-slate-900 text-slate-100'}`}>
                                                                            <code>{children}</code>
                                                                        </pre>
                                                                    );
                                                                }

                                                                return (
                                                                    <code className={`rounded px-1.5 py-0.5 ${isStream ? 'text-[11px]' : 'text-xs'} ${message.role === 'user' ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                            pre: ({ children }) => <pre className="mb-2 overflow-x-auto">{children}</pre>,
                                                            a: ({ children, href }) => (
                                                                <a
                                                                    href={href}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`underline transition hover:opacity-80 ${message.role === 'user' ? 'text-cyan-100' : 'text-blue-600'}`}
                                                                >
                                                                    {children}
                                                                </a>
                                                            ),
                                                            hr: () => <hr className={`my-2 ${message.role === 'user' ? 'border-white/30' : 'border-slate-300'}`} />,
                                                            table: ({ children }) => (
                                                                <table className={`mb-2 w-full border-collapse ${isStream ? 'text-[11px]' : 'text-xs'}`}>
                                                                    {children}
                                                                </table>
                                                            ),
                                                            thead: ({ children }) => <thead className={message.role === 'user' ? 'bg-black/15' : 'bg-slate-100'}>{children}</thead>,
                                                            tbody: ({ children }) => <tbody>{children}</tbody>,
                                                            tr: ({ children }) => <tr className={message.role === 'user' ? 'border border-white/30' : 'border border-slate-300'}>{children}</tr>,
                                                            th: ({ children }) => (
                                                                <th className={`border px-2 py-1 text-left font-semibold ${message.role === 'user' ? 'border-white/30' : 'border-slate-300'}`}>
                                                                    {children}
                                                                </th>
                                                            ),
                                                            td: ({ children }) => (
                                                                <td className={`border px-2 py-1 ${message.role === 'user' ? 'border-white/30' : 'border-slate-300'}`}>
                                                                    {children}
                                                                </td>
                                                            ),
                                                        }}
                                                    >
                                                        {normalizeMarkdownContent(message.content)}
                                                    </ReactMarkdown>

                                                    <div className={`mt-2 flex items-center gap-2 text-[11px] ${message.role === 'user' ? 'text-white/80' : 'text-slate-400'}`}>
                                                        <span>{formatTime(message.createdAt)}</span>
                                                        {message.role === 'assistant' && message.completionTime != null ? (
                                                            <span>• {formatCompletionTime(message.completionTime)}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ))}

                                <div ref={bottomRef} />
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="border-t border-white/10 bg-[#0f1728] p-4">
                    {errorMessage ? (
                        <p className="mb-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-100">
                            {errorMessage}
                        </p>
                    ) : null}

                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 focus-within:border-[#49BBBD]/50 focus-within:bg-white/10">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                if (errorMessage) {
                                    setErrorMessage(null);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    void handleSend();
                                }
                            }}
                            rows={2}
                            disabled={!isAuthenticated || sending}
                            placeholder={
                                isAuthenticated
                                    ? 'Nhập câu hỏi cho AI...'
                                    : 'Đăng nhập để chat với AI'
                            }
                            className="min-h-[52px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-400 disabled:cursor-not-allowed pl-2 pt-1"
                        />

                        <button
                            type="button"
                            onClick={() => void handleSend()}
                            disabled={!isAuthenticated || sending || !input.trim()}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#49BBBD] p-0 text-white transition hover:bg-[#3aa4a6] disabled:cursor-not-allowed disabled:bg-slate-500"
                            aria-label="Gửi tin nhắn"
                        >
                            <Send
                                size={20}
                                strokeWidth={1.5}
                                className="shrink-0"
                            />
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <Link to="/chat" onClick={onClose} className="transition hover:text-white">
                            Mở chat đầy đủ
                        </Link>
                        <span>Nhấn Esc để đóng</span>
                    </div>
                </div>
            </aside>
        </>
    );
}