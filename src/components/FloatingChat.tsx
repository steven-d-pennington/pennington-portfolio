"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show chat after a delay to avoid conflicts with cookie consent
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  // Load initial messages with persistence
  useEffect(() => {
    // Try to load saved messages from localStorage
    const savedMessages = localStorage.getItem('floating-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
          return;
        }
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }

    // If no saved messages, add welcome message
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your Monkey LoveStack assistant. I can help with full-stack development, cloud architecture, AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Save messages to localStorage automatically
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('floating-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when needed
  useEffect(() => {
    if (shouldAutoScroll || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldAutoScroll(false);
    }
  }, [messages, isTyping, shouldAutoScroll]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const popoutChat = () => {
    // Open chat in new window
    const chatWindow = window.open('/chat-popup', 'chatWindow', 'width=400,height=600,scrollbars=no,resizable=yes');
    if (chatWindow) {
      // Pass current messages to the popup
      chatWindow.addEventListener('load', () => {
        chatWindow.postMessage({ type: 'INIT_MESSAGES', messages }, window.location.origin);
      });
      setIsOpen(false);
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your Monkey LoveStack assistant. I can help with full-stack development, cloud architecture, AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem('floating-chat-messages');
  };

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    setError("");
    setLoading(true);
    setIsTyping(true);
    
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now()
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    setShouldAutoScroll(true);
    const messageToSend = input.trim();
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageToSend,
          persistChat: true, // Enable persistence by default
          conversationHistory: messages.slice(-10)
        }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
          timestamp: Date.now()
        };
        setMessages((msgs) => [...msgs, assistantMessage]);
        setShouldAutoScroll(true);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch {
      setError("Failed to send message.");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  if (!isOpen && !showChat) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-xl border transition-all duration-200 ${
        isMinimized ? 'w-80 h-14' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">ML</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Monkey LoveStack</h3>
              <p className="text-xs text-blue-100">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={minimizeChat}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Minimize chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={popoutChat}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Pop out chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="Chat menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 min-w-32 z-10">
                  <button
                    onClick={() => {
                      clearChat();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-white text-gray-800 border"
                  } rounded-lg px-3 py-2 shadow-sm`}>
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    <div className={`text-xs mt-1 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg px-3 py-2 shadow-sm border">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">Typing</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-2 mx-3">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {/* Input Form */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
