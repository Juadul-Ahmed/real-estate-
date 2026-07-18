"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

const SUGGESTIONS = [
  "How do I list a property?",
  "Show me apartments for rent",
  "How do I contact a broker?",
  "Is it free for buyers?",
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => typeof window !== "undefined" ? `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` : "");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(`chat_${sessionId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
  }, [messages, open, sessionId]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const full = await api.streamPost("/chat/stream", { message: text, sessionId });
      setMessages((m) => [...m, { role: "assistant", text: full }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4 w-[360px] max-h-[520px] bg-canvas rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          <div className="bg-surface px-4 py-3 flex items-center justify-between border-b border-border">
            <div>
              <p className="font-semibold text-sm text-title">EstateHub AI</p>
              <p className="text-xs text-muted">Always here to help</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-title text-sm px-2 transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/50">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-title font-medium text-sm mb-2">How can I help you today?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 bg-surface border border-border rounded-full text-title hover:border-primary hover:text-primary transition btn-interactive"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-surface border border-border text-title rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-xl rounded-bl-none px-3 py-2 text-xs text-muted">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-surface border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EstateHub AI..."
                className="flex-1 px-3 py-2 text-sm border border-border bg-canvas text-title placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition btn-interactive disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-full shadow-lg font-medium text-sm hover:bg-primary-hover transition btn-interactive"
      >
        <span>💬</span>
        {open ? "Close" : "EstateHub AI"}
      </button>
    </div>
  );
}
