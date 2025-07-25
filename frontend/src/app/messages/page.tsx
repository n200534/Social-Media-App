"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const mockChats = [
  {
    id: 2,
    name: "Emma Wilson",
    initials: "E",
    lastMessage: "See you soon!",
    messages: [
      { id: 1, sender: "Emma Wilson", text: "Hey! How are you?", time: "2:00 PM" },
      { id: 2, sender: "You", text: "I'm good! How about you?", time: "2:01 PM" },
      { id: 3, sender: "Emma Wilson", text: "Doing great! See you soon!", time: "2:02 PM" },
    ],
  },
  {
    id: 3,
    name: "David Park",
    initials: "D",
    lastMessage: "Let's catch up tomorrow.",
    messages: [
      { id: 1, sender: "You", text: "Hey David!", time: "1:00 PM" },
      { id: 2, sender: "David Park", text: "Let's catch up tomorrow.", time: "1:05 PM" },
    ],
  },
  {
    id: 4,
    name: "Lisa Zhang",
    initials: "L",
    lastMessage: "Thanks!",
    messages: [
      { id: 1, sender: "Lisa Zhang", text: "Happy Birthday!", time: "12:00 PM" },
      { id: 2, sender: "You", text: "Thanks!", time: "12:01 PM" },
    ],
  },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockChats[0].id);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(mockChats);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentChat = chats.find(c => c.id === activeChat)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setChats(chats => chats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, { id: Date.now(), sender: "You", text: trimmed, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }
        : chat
    ));
    setInput("");
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen bg-white pt-16">
      {/* Chat list */}
      <div className="w-1/3 max-w-xs border-r bg-gray-50 flex flex-col">
        <div className="font-bold text-lg p-4 border-b">Chats</div>
        <ul className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <li
              key={chat.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-50 ${activeChat === chat.id ? 'bg-purple-100' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">{chat.initials}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{chat.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-[120px]">{chat.lastMessage}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="font-bold text-lg p-4 border-b flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">{currentChat.initials}</div>
          <span>{currentChat.name}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {currentChat.messages.map(msg => (
            <div
              key={msg.id}
              className={`max-w-xs p-2 rounded-lg text-sm ${msg.sender === "You" ? 'bg-purple-100 ml-auto mr-4' : 'bg-gray-100'} flex flex-col`}
            >
              <span className="text-left">{msg.text}</span>
              <span className="text-xs text-gray-400 mt-1 text-left">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2 p-4 border-t bg-white">
          <input
            className="flex-1 px-3 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-purple-200"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-full flex items-center gap-1 disabled:bg-gray-300" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
} 