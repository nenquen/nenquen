"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type Message = {
  id: string;
  created_at: string;
  nickname: string;
  content: string;
};

export function ChatOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load nickname from local storage if available
  useEffect(() => {
    const savedNickname = localStorage.getItem("chat_nickname");
    if (savedNickname) setNickname(savedNickname);
  }, []);

  // Fetch initial messages and subscribe to real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);
      
      if (!error && data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => {
            // Prevent duplicate messages if we already added it optimistically
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !nickname.trim() || isLoading) return;

    setIsLoading(true);
    localStorage.setItem("chat_nickname", nickname);

    // Insert and immediately return the inserted row
    const { data, error } = await supabase
      .from("messages")
      .insert([{ nickname: nickname.trim(), content: newMessage.trim() }])
      .select()
      .single();

    if (!error && data) {
      // Add it instantly to our own screen without waiting for the WebSockets!
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      setNewMessage("");
      scrollToBottom();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 bottom-0 z-[110] flex w-[380px] max-w-[85vw] flex-col overflow-hidden border-r border-[#c084fc]/20 border-t-[#c084fc]/40 bg-[#0a0210]/90 shadow-[50px_0_50px_rgba(145,99,203,0.1),inset_0_1px_0_0_rgba(192,132,252,0.2)] backdrop-blur-3xl backdrop-saturate-200 animate-in slide-in-from-left duration-300 before:absolute before:inset-x-0 before:top-0 before:h-1/3 before:bg-gradient-to-b before:from-[#c084fc]/10 before:to-transparent before:opacity-50">
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/20 text-[#a5b0ff] shadow-[inset_0_1px_0_0_rgba(88,101,242,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">Live Chat</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-white/30"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <p className="text-sm text-zinc-400">No messages yet.<br/>Be the first to say hi!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1 animate-in slide-in-from-bottom-2 fade-in duration-300">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#c084fc]">{msg.nickname}</span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 border-t border-white/5 bg-black/20 p-4">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#c084fc]/50 focus:outline-none focus:ring-1 focus:ring-[#c084fc]/50"
              maxLength={20}
              required
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-4 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#c084fc]/50 focus:outline-none focus:ring-1 focus:ring-[#c084fc]/50"
                maxLength={200}
                required
              />
              <button
                type="submit"
                disabled={isLoading || !newMessage.trim() || !nickname.trim()}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#c084fc]/20 text-[#e1c4ff] transition-colors hover:bg-[#c084fc]/30 disabled:opacity-50 disabled:hover:bg-[#c084fc]/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
