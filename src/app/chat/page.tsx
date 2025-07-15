"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [persistChat, setPersistChat] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session data on mount
  useEffect(() => {
    const savedRememberSession = localStorage.getItem('chat-remember-session') === 'true';
    const savedPersistChat = localStorage.getItem('chat-persist-chat') === 'true';
    
    setRememberSession(savedRememberSession);
    setPersistChat(savedPersistChat);

    let initialMessages: Message[] = [];

    if (savedRememberSession) {
      const savedMessages = localStorage.getItem('chat-messages');
      if (savedMessages) {
        try {
          initialMessages = JSON.parse(savedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }
    }

    // Add welcome message if no messages exist
    if (initialMessages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: "Hi! I'm your Cloud Engineering Assistant. I can help with AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
        timestamp: Date.now()
      };
      initialMessages = [welcomeMessage];
    }

    setMessages(initialMessages);
  }, []);

  // Save messages to localStorage when rememberSession is enabled
  useEffect(() => {
    if (rememberSession && messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages, rememberSession]);

  // Auto-scroll to bottom only when needed
  useEffect(() => {
    if (shouldAutoScroll || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldAutoScroll(false);
    }
  }, [messages, isTyping, shouldAutoScroll]);

  // Handle checkbox changes
  const handleRememberSessionChange = (checked: boolean) => {
    setRememberSession(checked);
    localStorage.setItem('chat-remember-session', checked.toString());
    if (!checked) {
      localStorage.removeItem('chat-messages');
    }
  };

  const handlePersistChatChange = (checked: boolean) => {
    setPersistChat(checked);
    localStorage.setItem('chat-persist-chat', checked.toString());
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
          persistChat,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
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

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your Cloud Engineering Assistant. I can help with AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem('chat-messages');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Cloud Engineering Assistant</h1>
          <p className="text-blue-100">Get expert help with cloud infrastructure, DevOps, and technical solutions</p>
        </div>

        {/* Settings */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => handleRememberSessionChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Remember Session</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={persistChat}
                onChange={(e) => handlePersistChatChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Persist Chat</span>
            </label>
            <button
              onClick={clearChat}
              className="ml-auto text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-800"
              } rounded-2xl px-4 py-2 shadow-sm`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-xs mt-1 ${
                  msg.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 shadow-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">Cloud Engineer is typing</span>
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
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ask about cloud architecture, DevOps, infrastructure..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 