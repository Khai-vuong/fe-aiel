import { useState } from 'react';
import { FaArrowLeft, FaSearch, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const users = [
  {
    id: 1,
    name: 'TKBOT',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
    lastMsg: 'Hệ thống đã sẵn sàng hỗ trợ bạn...',
    time: '6:57 PM',
    online: true,
  },
  {
    id: 2,
    name: 'Cody Fisher',
    avatar: 'https://i.pravatar.cc/150?u=cody',
    lastMsg: 'The passage experienced…',
    time: '6:32 PM',
    online: true,
  },
  {
    id: 3,
    name: 'Savannah Nguyen',
    avatar: 'https://i.pravatar.cc/150?u=savannah',
    lastMsg: 'The passage experienced…',
    time: '6:20 PM',
    online: false,
  },
  {
    id: 4,
    name: 'Robert Fox',
    avatar: 'https://i.pravatar.cc/150?u=robert',
    lastMsg: 'The passage experienced…',
    time: '6:15 PM',
    online: true,
  },
  {
    id: 5,
    name: 'Bessie Cooper',
    avatar: 'https://i.pravatar.cc/150?u=bessie',
    lastMsg: 'The passage experienced…',
    time: '6:07 PM',
    online: true,
  },
  {
    id: 6,
    name: 'Theresa Webb',
    avatar: 'https://i.pravatar.cc/150?u=theresa',
    lastMsg: 'The passage experienced…',
    time: '5:57 PM',
    online: false,
  },
  {
    id: 7,
    name: 'Kathryn Murphy',
    avatar: 'https://i.pravatar.cc/150?u=kathryn',
    lastMsg: 'The passage experienced…',
    time: '5:37 PM',
    online: true,
  },
];

interface Message {
  sender: 'me' | 'bot';
  text: string;
  time: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [selectedUser] = useState(users[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Chào mừng bạn! TKBOT có thể giúp gì cho bạn?',
      time: '07:14 PM',
    },
    { sender: 'me', text: 'Tôi muốn hỏi về lịch học.', time: '07:18 PM' },
  ]);
  const [input, setInput] = useState('');

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendToBot = async (text: string) => {};

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = { sender: 'me', text: input, time: getTime() };
    setMessages(prev => [...prev, newMessage]);
    sendToBot(input);
    setInput('');
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      <div className="w-1/4 bg-white border-r p-6 space-y-4">
        <button
          className="p-2 rounded-lg bg-[#49BBBD] text-white w-fit hover:bg-[#3aa4a6] transition-colors"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft />
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mt-3">Chat</h1>

        <div className="relative mt-4">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-[#49BBBD]/50 outline-none"
          />
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {users.map(user => (
            <div
              key={user.id}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                selectedUser.id === user.id
                  ? 'bg-[#F0F6FF]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  className="w-12 h-12 rounded-full mr-3 object-cover border border-gray-100"
                  alt={user.name}
                />
                {user.online && (
                  <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user.name}
                </h3>
                <p className="text-gray-500 text-sm truncate">{user.lastMsg}</p>
              </div>
              <div className="text-gray-400 text-[10px]">{user.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <img
            src={selectedUser.avatar}
            className="w-12 h-12 rounded-full object-cover"
            alt={selectedUser.name}
          />
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              {selectedUser.name}
            </h2>
            <p className="text-green-500 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Đang trực tuyến
            </p>
          </div>
        </div>

        <div className="flex-1 mt-6 space-y-6 overflow-y-auto pr-4 scrollbar-hide">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-lg text-sm shadow-sm ${
                  msg.sender === 'me'
                    ? 'bg-[#49BBBD] text-white'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
          <input
            type="text"
            placeholder="Viết tin nhắn..."
            className="flex-1 px-4 py-2 text-gray-800 outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-[#49BBBD] hover:bg-[#3aa4a6] text-white p-3 rounded-xl transition-all active:scale-95"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
