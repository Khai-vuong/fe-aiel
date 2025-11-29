import { useState } from 'react';
import { FaArrowLeft, FaSearch, FaPaperPlane } from 'react-icons/fa';

// Fake user list
const users = [
  {
    id: 1,
    name: 'TKBOT',
    avatar: '/bot.png',
    lastMsg: 'The passage experienced…',
    time: '6:57 PM',
    online: true,
  },
  {
    id: 2,
    name: 'Cody Fisher',
    avatar: '/user1.jpg',
    lastMsg: 'The passage experienced…',
    time: '6:32 PM',
    online: true,
  },
  {
    id: 3,
    name: 'Savannah Nguyen',
    avatar: '/user2.jpg',
    lastMsg: 'The passage experienced…',
    time: '6:20 PM',
    online: false,
  },
  {
    id: 4,
    name: 'Robert Fox',
    avatar: '/user3.jpg',
    lastMsg: 'The passage experienced…',
    time: '6:15 PM',
    online: true,
  },
  {
    id: 5,
    name: 'Bessie Cooper',
    avatar: '/user4.jpg',
    lastMsg: 'The passage experienced…',
    time: '6:07 PM',
    online: true,
  },
  {
    id: 6,
    name: 'Theresa Webb',
    avatar: '/user5.jpg',
    lastMsg: 'The passage experienced…',
    time: '5:57 PM',
    online: false,
  },
  {
    id: 7,
    name: 'Kathryn Murphy',
    avatar: '/user6.jpg',
    lastMsg: 'The passage experienced…',
    time: '5:37 PM',
    online: true,
  },
];

// Chat message format
interface Message {
  sender: 'me' | 'bot';
  text: string;
  time: string;
}

export default function ChatPage() {
  const [selectedUser] = useState(users[0]); // default chat with TKBOT
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'The passage experiences a surge',
      time: '07:14 PM',
    },
    {
      sender: 'bot',
      text: 'Creation ipsum is simply dummy text of the printing industry.',
      time: '07:16 PM',
    },
    {
      sender: 'me',
      text: 'Creation ipsum is simply dummy text.',
      time: '07:18 PM',
    },
    {
      sender: 'bot',
      text: 'Creation ipsum is simply dummy text of the industry.',
      time: '08:10 PM',
    },
    {
      sender: 'me',
      text: 'Creation ipsum is simply dummy text.',
      time: '08:12 PM',
    },
  ]);

  const [input, setInput] = useState('');

  // Format time
  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // AI BOT (fake or OpenAI)
  const sendToBot = async (text: string) => {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
        }),
      });

      const data = await res.json();
      const botReply =
        data.choices?.[0]?.message?.content || 'AI bot response error';

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: getTime(),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      sender: 'me',
      text: input,
      time: getTime(),
    };

    setMessages(prev => [...prev, newMessage]);
    sendToBot(input);

    setInput('');
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-white border-r p-6 space-y-4">
        <button className="p-2 rounded-lg bg-[#49BBBD] text-white w-fit">
          <FaArrowLeft />
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mt-3">Chat</h1>

        {/* Search Bar */}
        <div className="relative mt-4">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* User List */}
        <div className="space-y-3">
          {users.map(user => (
            <div
              key={user.id}
              className="flex items-center p-3 rounded-lg bg-[#F0F6FF] hover:bg-[#E0ECFF] cursor-pointer"
            >
              <img
                src={user.avatar}
                className="w-12 h-12 rounded-full mr-3 object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-500 text-sm truncate w-32">
                  {user.lastMsg}
                </p>
              </div>
              <div className="ml-auto text-gray-400 text-xs">{user.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col p-6">
        {/* Top Header */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow">
          <img src={selectedUser.avatar} className="w-12 h-12 rounded-full" />
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {selectedUser.name}
            </h2>
            <p className="text-green-500 text-sm">Online</p>
          </div>
          <div className="ml-auto cursor-pointer p-2">⋮</div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 mt-6 space-y-6 overflow-y-auto pr-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-lg text-sm shadow ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
                <div className="text-[10px] text-right opacity-70 mt-1">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT BOX */}
        <div className="mt-4 p-4 bg-white rounded-xl shadow flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-3 
                       text-gray-800 placeholder-gray-500 
                       bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-[#49BBBD] text-white p-3 rounded-full"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
