"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((msgs) => [...msgs, { role: "assistant", content: data.reply }]);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch {
      setError("Failed to send message.");
    }
    setInput("");
    setLoading(false);
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
      <div className="border rounded-lg p-4 mb-4 bg-white min-h-[200px]">
        {messages.length === 0 && <div className="text-gray-400">Start the conversation...</div>}
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
            <span className={msg.role === "user" ? "bg-blue-100 text-blue-800 px-2 py-1 rounded" : "bg-gray-100 text-gray-800 px-2 py-1 rounded"}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </main>
  );
} 