"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

import { User } from "@supabase/supabase-js";

export type Message = {
  id: string;
  created_at: string;
  nickname: string;
  content: string;
  user_id: string;
  avatar_url: string;
  discord_id: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adminDiscordId = process.env.NEXT_PUBLIC_ADMIN_DISCORD_ID;

  // Handle Mount/Unmount Animations using CSS Transitions
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay to ensure the element is in the DOM before triggering the transition
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial messages and subscribe to real-time updates
  useEffect(() => {
    if (!isRendered) return;

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

    // Subscribe to new messages and deletions
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as Message];
            });
            scrollToBottom();
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete ALL messages?")) return;
    // Hack to delete all: delete where id is not empty
    await supabase.from("messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isLoading) return;

    setIsLoading(true);

    const discordName = user.user_metadata?.custom_claims?.global_name || user.user_metadata?.full_name || "User";
    const avatarUrl = user.user_metadata?.avatar_url || "";
    const discordId = user.user_metadata?.provider_id || user.user_metadata?.sub || "";

    // Insert and immediately return the inserted row
    const { data, error } = await supabase
      .from("messages")
      .insert([
        { 
          nickname: discordName, 
          content: newMessage.trim(),
          user_id: user.id,
          avatar_url: avatarUrl,
          discord_id: discordId
        }
      ])
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      setNewMessage("");
      scrollToBottom();
    }
    setIsLoading(false);
  };

  if (!isRendered) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 left-0 bottom-0 z-[110] flex w-full sm:w-[380px] max-w-none sm:max-w-[85vw] flex-col border-r border-[#c084fc]/20 bg-[#0a0210]/80 backdrop-blur-xl transition-all duration-300 ease-out ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        
        <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/20 text-[#a5b0ff] shadow-[inset_0_1px_0_0_rgba(88,101,242,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">Live Chat</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.user_metadata?.provider_id === adminDiscordId && adminDiscordId && (
              <button
                onClick={handleClearAll}
                title="Clear All Messages"
                className="flex h-8 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-white/30"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              <p className="text-sm text-zinc-400">No messages yet.<br/>Be the first to say hi!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = user?.user_metadata?.provider_id === adminDiscordId && adminDiscordId;
              
              return (
                <div key={msg.id} className="group flex flex-col gap-1 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {msg.avatar_url ? (
                        <img src={msg.avatar_url} alt="avatar" className="h-5 w-5 rounded-full" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-white/10" />
                      )}
                      <span className="text-sm font-bold text-[#c084fc]">{msg.nickname}</span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                        title="Delete Message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                  <div className="ml-7 w-fit max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 border-t border-white/5 bg-black/20 p-4">
          {!user ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-zinc-400">Join the conversation!</p>
              <button
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#5865F2]/30 bg-[#5865F2]/20 px-4 py-3 text-sm font-bold text-[#a5b0ff] transition-colors hover:bg-[#5865F2]/30 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37.07.07 0 0 0 3.66 4.43C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.019-.02ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/></svg>
                Login with Discord
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Logged in as <strong className="text-[#c084fc]">{user.user_metadata?.custom_claims?.global_name || user.user_metadata?.full_name || "User"}</strong></span>
                <button type="button" onClick={handleLogout} className="hover:text-red-400 transition-colors">Logout</button>
              </div>
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
                  disabled={isLoading || !newMessage.trim()}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#c084fc]/20 text-[#e1c4ff] transition-colors hover:bg-[#c084fc]/30 disabled:opacity-50 disabled:hover:bg-[#c084fc]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
