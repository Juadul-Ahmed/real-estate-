"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Inquiry, Message } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function InquiryList({ role }: { role: "buyer" | "broker" }) {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Inquiry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<{ inquiries: Inquiry[] }>(`/inquiries/${role}`)
      .then((d) => setInquiries(d.inquiries))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [role]);

  const open = async (inq: Inquiry) => {
    setActive(inq);
    setError("");
    try {
      const d = await api.get<{ messages: Message[] }>(`/inquiries/${inq._id}/messages`);
      setMessages(d.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages");
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !text.trim()) return;
    try {
      await api.post("/inquiries/message", { inquiryId: active._id, text });
      const d = await api.get<{ messages: Message[] }>(`/inquiries/${active._id}/messages`);
      setMessages(d.messages);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    }
  };

  if (loading) return <p className="text-muted">Loading...</p>;

  const getUser = (inq: Inquiry) => {
    const other = role === "buyer" ? inq.broker : inq.buyer;
    return typeof other === "object" ? other : null;
  };

  const getProperty = (inq: Inquiry) => {
    return typeof inq.property === "object" ? inq.property : null;
  };

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-2 space-y-3">
        {inquiries.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-muted">No inquiries yet.</p>
          </div>
        )}
        {inquiries.map((inq) => {
          const prop = getProperty(inq);
          const other = getUser(inq);
          const img = prop?.images?.[0] || "https://picsum.photos/seed/empty/600/400";
          return (
            <button
              key={inq._id}
              onClick={() => open(inq)}
              className={`w-full text-left bg-surface border rounded-xl p-4 card-hover flex gap-4 ${
                active?._id === inq._id ? "border-primary" : "border-border"
              }`}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-canvas">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-title truncate">{prop?.title || "Property"}</p>
                {other && (
                  <div className="mt-1">
                    <p className="text-sm text-primary font-medium">
                      {role === "buyer" ? "Broker" : "Buyer"}: {other.name}
                    </p>
                    {other.email && <p className="text-xs text-muted">{other.email}</p>}
                    {other.phone && <p className="text-xs text-muted">{other.phone}</p>}
                  </div>
                )}
                <p className="text-sm text-muted mt-1 line-clamp-2">{inq.message}</p>
                <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${
                  inq.status === "open" ? "bg-primary/10 text-primary" :
                  inq.status === "answered" ? "bg-success/10 text-success" :
                  "bg-muted/10 text-muted"
                }`}>
                  {inq.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="md:col-span-3 bg-surface border border-border rounded-xl p-6 h-[28rem] flex flex-col">
        {!active ? (
          <p className="text-muted/70 m-auto text-center">Select an inquiry to view messages and contact details.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div>
                <p className="font-semibold text-title">Conversation</p>
                {(() => {
                  const other = getUser(active);
                  const prop = getProperty(active);
                  return (
                    <div className="mt-1">
                      <p className="text-sm text-muted">{prop?.title}</p>
                      {other && (
                        <div className="text-xs text-muted mt-1 space-y-0.5">
                          <p>{other.name}</p>
                          {other.email && <p>{other.email}</p>}
                          {other.phone && <p>{other.phone}</p>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                active.status === "open" ? "bg-primary/10 text-primary" :
                active.status === "answered" ? "bg-success/10 text-success" :
                "bg-muted/10 text-muted"
              }`}>
                {active.status}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.map((m) => {
                const senderId = typeof m.sender === "object" ? m.sender._id : m.sender;
                const mine = senderId === user?.id;
                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      mine
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-canvas border border-border text-title rounded-bl-md"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={send} className="mt-4 flex gap-2">
              <input
                className="flex-1 border border-border bg-canvas text-title rounded-lg px-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition btn-interactive">
                Send
              </button>
            </form>
          </>
        )}
        {error && <p className="text-error text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
