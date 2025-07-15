"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export default function ChatPopup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'INIT_MESSAGES') {
        setMessages(event.data.messages || []);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Load initial welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: "Hi! I'm your Monkey LoveStack assistant. I can help with full-stack development, cloud architecture, AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom when needed
  useEffect(() => {
    if (shouldAutoScroll || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldAutoScroll(false);
    }
  }, [messages, isTyping, shouldAutoScroll]);

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

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your Monkey LoveStack assistant. I can help with full-stack development, cloud architecture, AWS, Azure, GCP, DevOps, containerization, infrastructure, and other technical topics. How can I help you today?",
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="font-bold">ML</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Monkey LoveStack Assistant</h1>
            <p className="text-blue-100 text-sm">AI-powered technical support</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-blue-100 hover:text-white text-sm px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md ${
              msg.role === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-800 border"
            } rounded-lg px-4 py-3 shadow-sm`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-2 ${
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
            <div className="bg-white text-gray-800 rounded-lg px-4 py-3 shadow-sm border">
              <div className="flex items-center space-x-1">
                <span className="text-sm">Monkey LoveStack assistant is typing</span>
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
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
  );
}
