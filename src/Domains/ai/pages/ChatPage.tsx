import { useState, useEffect, useRef } from 'react';
import {
  FaArrowLeft,
  FaArchive,
  FaEdit,
  FaPaperPlane,
  FaPlus,
  FaTrash,
  FaRobot,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import aiConversationService from '../services/AiConversation.service.js';
import type {
  ConversationSummary,
  Message,
} from '../services/AiConversation.service.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });

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

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Mỗi item trong sidebar conversation list */
function ConversationItem({
  conv,
  isActive,
  onClick,
  onRename,
  onArchive,
  onDelete,
}: {
  conv: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
  onRename: (e: React.MouseEvent) => void;
  onArchive: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all
        ${isActive
          ? 'bg-[#49BBBD] text-white shadow-md'
          : 'hover:bg-[#E8F7F7] text-gray-700'
        }`}
    >
      {/* Title + time */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm truncate flex-1">
          {conv.title ?? 'Untitled conversation'}
        </span>
        <span
          className={`text-[10px] shrink-0 ${isActive ? 'text-white/80' : 'text-gray-400'}`}
        >
          {conv.lastMessageAt ? formatDate(conv.lastMessageAt) : ''}
        </span>
      </div>

      {/* Preview */}
      <p
        className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-gray-400'}`}
      >
        {conv.preview ?? 'No messages yet'}
      </p>

      {/* Badge + action icons */}
      <div className="flex items-center justify-between mt-0.5">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive
            ? 'bg-white/20 text-white'
            : conv.status === 'archived'
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-green-100 text-green-600'
            }`}
        >
          {conv.messageCount} msgs
        </span>

        {/* Action button – chỉ hiện khi hover */}
        {hovered && (
          <div className="flex gap-1">
            <button
              title="Rename"
              onClick={onRename}
              className={`p-1 rounded-md transition ${isActive
                ? 'hover:bg-white/20 text-white'
                : 'hover:bg-blue-100 text-blue-500'
                }`}
            >
              <FaEdit size={11} />
            </button>
            <button
              title={conv.status === 'archived' ? 'Unarchive' : 'Archive'}
              onClick={onArchive}
              className={`p-1 rounded-md transition ${isActive
                ? 'hover:bg-white/20 text-white'
                : conv.status === 'archived'
                  ? 'hover:bg-green-100 text-green-600'
                  : 'hover:bg-yellow-100 text-yellow-600'
                }`}
            >
              <FaArchive size={11} />
            </button>
            <button
              title="Delete"
              onClick={onDelete}
              className={`p-1 rounded-md transition ${isActive
                ? 'hover:bg-white/20 text-white'
                : 'hover:bg-red-100 text-red-500'
                }`}
            >
              <FaTrash size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Bubble cho từng message */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const processingTime =
    typeof msg.metadata?.processingTime === 'number'
      ? msg.metadata.processingTime
      : null;
  const normalizedContent = normalizeMarkdownContent(msg.content);

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow
          ${isUser ? 'bg-blue-600' : 'bg-[#49BBBD]'}`}
      >
        {isUser ? (
          <FaUser size={13} className="text-white" />
        ) : (
          <FaRobot size={13} className="text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
            }`}
        >
          <ReactMarkdown
            components={{
              // Headings
              h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
              h4: ({ children }) => <h4 className="text-sm font-semibold mb-2 mt-2 first:mt-0">{children}</h4>,
              h5: ({ children }) => <h5 className="text-xs font-semibold mb-1 mt-2 first:mt-0">{children}</h5>,
              h6: ({ children }) => <h6 className="text-xs font-semibold mb-1 mt-2 first:mt-0">{children}</h6>,

              // Paragraph
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

              // Text formatting
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-outside mb-2 space-y-0.5 pl-5 [&_ul]:mt-1 [&_ul]:pl-5 [&_ul]:list-circle">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside mb-2 space-y-0.5 pl-5 [&_ol]:mt-1 [&_ol]:pl-5">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="ml-1">{children}</li>,

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-3 border-gray-300 pl-3 py-1 mb-2 italic text-gray-600">
                  {children}
                </blockquote>
              ),

              // Code
              code: ({ children, className }) => {
                // Code block (has language class)
                if (className) {
                  return (
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto mb-2">
                      <code>{children}</code>
                    </pre>
                  );
                }
                // Inline code
                return (
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                );
              },

              // Pre (for code blocks)
              pre: ({ children }) => <pre className="overflow-x-auto mb-2">{children}</pre>,

              // Links
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:opacity-80 ${isUser ? 'text-blue-200' : 'text-blue-500'}`}
                >
                  {children}
                </a>
              ),

              // Horizontal rule
              hr: () => <hr className="my-2 border-gray-300" />,

              // Table
              table: ({ children }) => (
                <table className="w-full border-collapse mb-2 text-xs">
                  {children}
                </table>
              ),
              thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border border-gray-300">{children}</tr>,
              th: ({ children }) => (
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-2 py-1">
                  {children}
                </td>
              ),
            }}
          >
            {normalizedContent}
          </ReactMarkdown>
        </div>

        {/* Timestamp + token info */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-gray-400">
            {formatTime(msg.createdAt)}
          </span>
          {msg.totalTokens && (
            <span className="text-[10px] text-gray-300">
              · {msg.totalTokens} tokens
            </span>
          )}
          {msg.modelName && (
            <span className="text-[10px] text-gray-300">
              · {msg.modelName}
              {processingTime !== null ? ` (${processingTime} ms)` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Skeleton loader cho conversations */
function ConversationSkeleton() {
  return (
    <div className="space-y-2 px-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3 rounded-xl bg-white/30 backdrop-blur-sm animate-pulse">
          <div className="h-3 bg-white/50 rounded w-3/4 mb-2" />
          <div className="h-2 bg-white/50 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton loader cho messages */
function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`flex gap-2 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm animate-pulse shrink-0" />
          <div
            className={`h-12 rounded-2xl bg-white/30 backdrop-blur-sm animate-pulse ${i % 2 === 0 ? 'w-1/2' : 'w-2/5'
              }`}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ChatPage() {
  const navigate = useNavigate();

  // ── State ──

  // Sidebar
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [convLoading, setConvLoading] = useState(true);
  const [convError, setConvError] = useState<string | null>(null);
  const [hasMoreConv, setHasMoreConv] = useState(false);
  const [convOffset, setConvOffset] = useState(0);
  const CONV_LIMIT = 20;

  // Active conversation
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [activeTitle, setActiveTitle] = useState<string>('');

  // Input
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // Ref để auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Effects ──

  // Fetch conversations khi mount
  useEffect(() => {
    fetchConversations(true);
  }, []);

  // Auto-scroll khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }, [messages]);

  // ── Fetch helpers ──

  const fetchConversations = async (reset = false) => {
    try {
      setConvLoading(true);
      setConvError(null);
      const offset = reset ? 0 : convOffset;

      const res = await aiConversationService.getConversations({
        limit: CONV_LIMIT,
        offset,
      });

      setConversations(prev =>
        reset ? res.conversations : [...prev, ...res.conversations],
      );
      setHasMoreConv(res.hasMore);
      setConvOffset(offset + res.conversations.length);
    } catch {
      setConvError('Không thể tải danh sách conversations');
    } finally {
      setConvLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMsgLoading(true);
      setMessages([]);

      const res = await aiConversationService.getConversationMessages(
        conversationId,
        { limit: 50 },
      );
      setMessages(res.messages);
      setActiveTitle(res.conversation.title ?? 'Untitled conversation');
    } catch {
      setMessages([]);
    } finally {
      setMsgLoading(false);
    }
  };

  // ── Handlers ──

  const handleSelectConversation = (conv: ConversationSummary) => {
    setActiveConvId(conv.conversationId);
    fetchMessages(conv.conversationId);
  };

  const handleDeleteConversation = async (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    if (!confirm('Xóa conversation này vĩnh viễn?')) return;

    try {
      await aiConversationService.deleteConversation(conversationId);
      setConversations(prev =>
        prev.filter(c => c.conversationId !== conversationId),
      );
      if (activeConvId === conversationId) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch {
      alert('Xóa thất bại');
    }
  };

  const handleRenameConversation = async (
    e: React.MouseEvent,
    conversationId: string,
    currentTitle: string | null,
  ) => {
    e.stopPropagation();

    const nextTitle = prompt('Nhập tên mới cho conversation', currentTitle ?? '');
    if (nextTitle === null) return;

    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) {
      alert('Tên conversation không được để trống');
      return;
    }

    try {
      await aiConversationService.renameConversation(conversationId, {
        title: trimmedTitle,
      });

      setConversations(prev =>
        prev.map(c =>
          c.conversationId === conversationId
            ? {
              ...c,
              title: trimmedTitle,
              updatedAt: new Date().toISOString(),
            }
            : c,
        ),
      );

      if (activeConvId === conversationId) {
        setActiveTitle(trimmedTitle);
      }
    } catch {
      alert('Đổi tên conversation thất bại');
    }
  };

  const handleArchiveConversation = async (
    e: React.MouseEvent,
    conversationId: string,
    archived: boolean,
  ) => {
    e.stopPropagation();

    try {
      await aiConversationService.archiveConversation(conversationId, {
        archived: !archived,
      });

      setConversations(prev =>
        prev.map(c =>
          c.conversationId === conversationId
            ? {
              ...c,
              status: archived ? 'active' : 'archived',
              updatedAt: new Date().toISOString(),
            }
            : c,
        ),
      );
    } catch {
      alert('Cập nhật trạng thái archive thất bại');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput('');
    setSending(true);

    // Tạo temporary user message để hiển thị ngay
    const tempUserMessage: Message = {
      messageId: `temp-user-${Date.now()}`,
      conversationId: activeConvId ?? '',
      role: 'user',
      content: userText,
      contentJson: null,
      parentMessageId: null,
      promptTokens: null,
      completionTokens: null,
      totalTokens: null,
      modelName: null,
      metadata: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Gọi API directChat
      const res = await aiConversationService.sendChat({
        text: userText,
        conversationId: activeConvId ?? undefined,
        provider: 'groq',
        metadata: {
          sendFrom: "ChatPage"
        },

      });

      if (!res.success) {
        throw new Error(res.error?.message ?? 'AI chat failed');
      }

      // Nếu là conversation mới (không có activeConvId trước đó)
      if (!activeConvId && res.conversationId) {
        setActiveConvId(res.conversationId);
        // Refresh danh sách conversations để hiển thị conversation mới
        await fetchConversations(true);
        setActiveTitle(res.conversationTitle ?? 'Cuộc hội thoại mới');
      }

      // Thêm message từ assistant
      const assistantCreatedAt = res.metadata?.createdAt ?? new Date().toISOString();
      const assistantMessage: Message = {
        messageId: res.messageId ?? `temp-assistant-${Date.now()}`,
        conversationId: res.conversationId ?? activeConvId ?? '',
        role: 'assistant',
        content: res.text,
        contentJson: null,
        parentMessageId: null,
        promptTokens: null,
        completionTokens: null,
        totalTokens: null,
        modelName: res.metadata?.provider ?? null,
        metadata: (res.metadata as Record<string, unknown> | undefined) ?? null,
        createdAt: assistantCreatedAt,
        updatedAt: assistantCreatedAt,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      alert('Gửi tin nhắn thất bại');
      // Remove temp message nếu gửi thất bại
      setMessages(prev => prev.filter(m => m.messageId !== tempUserMessage.messageId));
    } finally {
      setSending(false);
    }
  };

  // ── Render ──

  return (
    <div style={{ height: 'calc(100vh - 64px)' }} className="flex bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"></div>
      {/* ════════════════ LEFT SIDEBAR ════════════════ */}
      <div className="w-72 shrink-0 flex flex-col bg-white/70 backdrop-blur-xl border-r border-white/30 shadow-lg relative z-20">
        {/* Header */}
        <div className="p-4 border-b border-white/30">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-[#49BBBD] text-white hover:bg-[#3aadaf] transition"
              title="Về trang chủ"
            >
              <FaArrowLeft size={13} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">AI Chat</h1>
          </div>

          {/* New conversation button */}
          <button
            onClick={() => {
              setActiveConvId(null);
              setMessages([]);
              setActiveTitle('');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl
                       bg-[#49BBBD] text-white text-sm font-medium
                       hover:bg-[#3aadaf] active:scale-95 transition"
          >
            <FaPlus size={12} />
            Bắt đầu cuộc hội thoại mới
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {convLoading && conversations.length === 0 ? (
            <ConversationSkeleton />
          ) : convError ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm mb-3">{convError}</p>
              <button
                onClick={() => fetchConversations(true)}
                className="text-[#49BBBD] text-sm underline"
              >
                Thử lại
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <FaRobot size={28} className="mx-auto mb-2 opacity-30" />
              Chưa có conversation nào
            </div>
          ) : (
            <>
              {conversations.map(conv => (
                <ConversationItem
                  key={conv.conversationId}
                  conv={conv}
                  isActive={activeConvId === conv.conversationId}
                  onClick={() => handleSelectConversation(conv)}
                  onRename={e =>
                    handleRenameConversation(e, conv.conversationId, conv.title)
                  }
                  onArchive={e =>
                    handleArchiveConversation(
                      e,
                      conv.conversationId,
                      conv.status === 'archived',
                    )
                  }
                  onDelete={e =>
                    handleDeleteConversation(e, conv.conversationId)
                  }
                />
              ))}

              {/* Load more */}
              {hasMoreConv && (
                <button
                  onClick={() => fetchConversations(false)}
                  disabled={convLoading}
                  className="w-full py-2 text-xs text-[#49BBBD] hover:underline disabled:opacity-50"
                >
                  {convLoading ? 'Đang tải...' : 'Tải thêm'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ════════════════ RIGHT CHAT AREA ════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {activeTitle || 'New conversation'}
          </h2>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-b from-cyan-50/30 to-teal-50/20">
          {msgLoading ? (
            <MessagesSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FaRobot size={40} className="mb-3 opacity-20" />
              <p className="text-sm">
                {activeConvId
                  ? 'Chưa có tin nhắn nào'
                  : 'Bắt đầu cuộc trò chuyện mới bằng cách gửi tin nhắn bên dưới'}
              </p>
            </div>
          ) : (
            messages.map(msg => <MessageBubble key={msg.messageId} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="shrink-0 p-4 bg-white/70 backdrop-blur-xl border-t border-white/30">
          <div className="flex items-end gap-3 bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-inner border border-white/20">
            <textarea
              rows={1}
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent resize-none outline-none text-sm
                             text-gray-800 placeholder-gray-400 max-h-36 leading-relaxed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 w-9 h-9 rounded-full bg-[#49BBBD] text-white
                             flex items-center justify-center shadow
                             hover:bg-[#3aadaf] active:scale-95 transition
                             disabled:opacity-40 disabled:cursor-not-allowed"
              title="Gửi (Enter)"
            >
              {sending ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperPlane size={14} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-1.5">
            Enter để gửi · Shift+Enter xuống dòng
          </p>
        </div>
      </div>
    </div>
  );
}