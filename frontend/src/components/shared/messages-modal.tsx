"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Clock,
  User,
} from "lucide-react";

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageThread {
  id: string;
  hostName: string;
  propertyTitle: string;
  location: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: "host" | "user";
    text: string;
    time: string;
  }[];
}

const mockThreads: MessageThread[] = [
  {
    id: "1",
    hostName: "Rajesh Kumar (Superhost)",
    propertyTitle: "Luxury 4BHK Villa with Private Pool",
    location: "Goa, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    lastMessage: "Hi! We're preparing the poolside cabana for your check-in. Let us know if you need airport pickup!",
    timestamp: "10:45 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "host",
        text: "Namaste! Thank you for booking the Luxury Villa in Goa. We are thrilled to host you!",
        time: "Yesterday, 4:20 PM",
      },
      {
        id: "m2",
        sender: "user",
        text: "Hi Rajesh! What is the exact check-in time, and is early check-in possible?",
        time: "Yesterday, 5:10 PM",
      },
      {
        id: "m3",
        sender: "host",
        text: "Standard check-in is 2:00 PM, but you are welcome to arrive at 11:30 AM to drop luggage. We're preparing the poolside cabana for your check-in!",
        time: "10:45 AM",
      },
    ],
  },
  {
    id: "2",
    hostName: "Priya Sharma",
    propertyTitle: "Premium 2BHK Airbnb Noida | Party | Relax",
    location: "Noida, India",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    lastMessage: "The smart lock keycode is 4892#. Enjoy your stay!",
    timestamp: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m4",
        sender: "host",
        text: "Hi there! Self check-in instructions have been generated.",
        time: "2 days ago",
      },
      {
        id: "m5",
        sender: "host",
        text: "The smart lock keycode is 4892#. Enjoy your stay!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "3",
    hostName: "AirClone Concierge Support",
    propertyTitle: "Trip Protection & Customer Service",
    location: "24/7 Verified Support",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
    lastMessage: "Your reservation has been confirmed with 100% AirCover protection.",
    timestamp: "3 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m6",
        sender: "host",
        text: "Welcome to AirClone! Your booking is backed by comprehensive booking protection.",
        time: "3 days ago",
      },
    ],
  },
];

export default function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<MessageThread[]>(mockThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("1");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: "user" as const,
      text: inputText.trim(),
      time: "Just now",
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: newMessage.text,
            timestamp: "Just now",
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    setInputText("");
  };

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.hostName.toLowerCase().includes(q) ||
      t.propertyTitle.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[900px] h-[100dvh] sm:h-[82vh] bg-white dark:bg-[#181818] text-gray-900 dark:text-gray-100 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-[#333] animate-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#2a2a2a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#FF385C] flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Messages & Host Inbox</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Live
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct messaging between guests and verified hosts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c2c2c] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY (TWO COLUMNS: THREADS LIST + CONVERSATION) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden">
          {/* LEFT: THREADS LIST */}
          <div className="border-r border-gray-200 dark:border-[#2a2a2a] flex flex-col bg-gray-50/50 dark:bg-[#151515] overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-200 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] text-xs">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Threads scroll */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#222]">
              {filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThread?.id;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                      isSelected
                        ? "bg-white dark:bg-[#252525] shadow-sm border-l-4 border-l-[#FF385C]"
                        : "hover:bg-gray-100/70 dark:hover:bg-[#1e1e1e]"
                    }`}
                  >
                    <img
                      src={thread.avatar}
                      alt={thread.hostName}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#333]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {thread.hostName}
                        </h4>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {thread.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {thread.propertyTitle}
                      </p>

                      <p className="text-xs text-gray-700 dark:text-gray-300 truncate mt-1">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: CONVERSATION THREAD */}
          {activeThread ? (
            <div className="flex flex-col h-full bg-white dark:bg-[#181818] overflow-hidden">
              {/* Active Conversation Header */}
              <div className="px-6 py-3.5 border-b border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between bg-white dark:bg-[#1a1a1a] shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.hostName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-[#333]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeThread.hostName}</span>
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[320px]">
                      {activeThread.propertyTitle} • {activeThread.location}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-semibold px-3 py-1 bg-gray-100 dark:bg-[#282828] text-gray-700 dark:text-gray-300 rounded-full">
                  Response rate: 100%
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-[#141414]">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          isMe
                            ? "bg-[#FF385C] text-white rounded-tr-sm"
                            : "bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white rounded-tl-sm"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] flex items-center gap-3 shrink-0"
              >
                <input
                  type="text"
                  placeholder={`Write a message to ${activeThread.hostName.split(" ")[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#383838] rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#FF385C] text-gray-900 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-11 h-11 rounded-2xl bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-center text-gray-400">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
