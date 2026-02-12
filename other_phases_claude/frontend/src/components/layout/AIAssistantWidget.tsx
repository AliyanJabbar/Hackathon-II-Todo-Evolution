"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import clsx from "clsx";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, RefreshCw, Send, Lock } from "lucide-react";
import { marked } from "marked";
import TodoAPI, { ChatMessage } from "../../services/api"; 
import { useSession } from "next-auth/react";

// --- 1. Context Setup ---
interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  draftText: string;
  setDraftText: (v: string) => void;
  clearDraftText: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftText, setDraftText] = useState("");
  const clearDraftText = () => setDraftText("");

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, draftText, setDraftText, clearDraftText }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};

// --- 2. Main Widget Logic ---
function WidgetContent() {
  const { isOpen, setIsOpen, draftText, clearDraftText } = useChat();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingReply, setStreamingReply] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLarge, setIsLarge] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const token = (session as any)?.accessToken; 
  const inputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = status === "authenticated" && !!token;

  const suggestedQuestions = [
    "Prioritize my task list for today.",
    "Break down my project into steps.",
    "Draft a schedule for next week.",
  ];

  useEffect(() => {
    if (draftText && isAuthenticated) {
      setInput(draftText);
      clearDraftText();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [draftText, clearDraftText, isAuthenticated]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth JS scroll
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, streamingReply]);

  const sendMessage = async (messageText?: string) => {
    if (!isAuthenticated) return;
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    const cleanText = messageToSend.replace(/<[^>]*>?/gm, "");
    setMessages((prev) => [...prev, { role: "user", text: cleanText }]);
    setInput("");
    setIsLoading(true);
    setShowWelcome(false);
    setStreamingReply("");

    try {
      const res = await TodoAPI.streamChat([...messages, { role: "user", text: cleanText }], token);
      if (res.status === 401) throw new Error("Unauthorized: Please log in.");
      if (!res.ok) throw new Error("Server error.");
      if (!res.body) throw new Error("No response.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.chunk) {
                botReply += parsed.chunk;
                setStreamingReply(botReply);
              }
            } catch (e) {}
          }
        }
      }

      setStreamingReply("");
      setMessages((prev) => [...prev, { role: "bot", text: botReply || "⚠️ No response." }]);
      setIsLoading(false);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "bot", text: error.message }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-200" data-lenis-prevent>
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all hover:bg-violet-500"
      >
        <div className="relative h-8 w-8">
          <Image src="/logo.png" alt="Genie" fill className="object-contain drop-shadow-md" />
        </div>
        <span className="absolute h-full w-full animate-ping rounded-full border border-violet-400 opacity-20" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={clsx(
              "fixed right-4 bottom-24 z-50 flex flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl md:right-8 bg-slate-950/95 border-violet-500/20",
              isLarge ? "h-[80vh] w-[90vw] md:w-[50vw]" : "h-[70vh] w-[90vw] md:w-[380px]"
            )}
            style={{ transition: "width 0.3s, height 0.3s" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-violet-500/10 bg-slate-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-lg">
                  <div className="relative h-6 w-6">
                    <Image src="/logo.png" alt="Genie Logo" fill className="object-contain" />
                  </div>
                  <motion.div
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute left-0 h-[2px] w-full bg-white/30 shadow-[0_0_4px_white]"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-white">TaskGenie AI</h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400">
                    <span className={clsx("h-1.5 w-1.5 rounded-full shadow-[0_0_5px]", 
                      !isAuthenticated ? "bg-red-500 shadow-red-500" : (isLoading ? "bg-violet-400 animate-pulse shadow-violet-400" : "bg-emerald-500 shadow-emerald-500"))} />
                    {!isAuthenticated ? "LOCKED" : (isLoading ? "THINKING..." : "ONLINE")}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <HeaderButton onClick={() => {setMessages([]); setShowWelcome(true);}} icon={<RefreshCw size={18} />} title="Reset Chat" />
                <div className="hidden md:block">
                  <HeaderButton onClick={() => setIsLarge(!isLarge)} icon={isLarge ? <Minimize2 size={18} /> : <Maximize2 size={18} />} title="Resize" />
                </div>
                <HeaderButton onClick={() => setIsOpen(false)} icon={<X size={20} />} isClose title="Close" />
              </div>
            </div>

            {/* Content Area with Smooth Scrolling */}
            <div className="relative flex-1 overflow-y-auto p-4 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {showWelcome && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center opacity-90">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-6 h-20 w-20 relative drop-shadow-[0_0_35px_rgba(139,92,246,0.3)]">
                    <Image src="/logo.png" alt="TaskGenie" fill className="object-contain" />
                  </motion.div>
                  
                  {!isAuthenticated ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 p-6 rounded-xl border border-dashed border-violet-500/20 bg-violet-500/5 w-full">
                      <Lock size={24} className="text-violet-500" />
                      <h3 className="text-md font-semibold text-white">Authentication Required</h3>
                      <p className="text-xs text-slate-400">Please authenticate yourself to use the AI Assistant.</p>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-white">Your Personal Task Genie</h3>
                      <p className="mb-6 text-sm text-slate-400">Ready to organize your chaos.</p>
                      <div className="flex w-full flex-col gap-2">
                        {suggestedQuestions.map((q, i) => (
                          <button key={i} onClick={() => sendMessage(q)} className="w-full rounded-lg border border-violet-500/10 bg-slate-900/50 p-3 text-left font-mono text-xs text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all">
                            <span className="mr-2 text-violet-500 font-bold">{">"}</span>{q}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={clsx("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={clsx("max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md",
                        msg.role === "user" ? "bg-violet-600 text-white rounded-tr-sm" : "bg-slate-900 text-slate-200 border border-violet-500/10 rounded-tl-sm")}>
                        {msg.role === "user" ? msg.text : <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />}
                      </div>
                    </div>
                  ))}
                  {isLoading && streamingReply && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-slate-900 text-slate-200 border border-violet-500/10 rounded-tl-sm shadow-md">
                        <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: marked.parse(streamingReply) as string }} />
                      </div>
                    </div>
                  )}
                  {isLoading && !streamingReply && (
                    <div className="flex justify-start">
                      <div className="flex gap-1.5 bg-slate-900 px-4 py-3 rounded-2xl border border-violet-500/10 rounded-tl-sm">
                        {[0, 1, 2].map((i) => <motion.span key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="h-1.5 w-1.5 rounded-full bg-violet-400" />)}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/50 border-t border-violet-500/10 backdrop-blur-md">
              <div className={clsx(
                "flex items-center gap-2 rounded-xl border px-2 py-1 shadow-inner transition-all",
                !isAuthenticated ? "border-slate-800 bg-slate-950/20 opacity-50" : "border-slate-700/50 bg-slate-950/50 focus-within:border-violet-500"
              )}>
                <input
                  ref={inputRef}
                  disabled={!isAuthenticated}
                  className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none disabled:cursor-not-allowed"
                  placeholder={isAuthenticated ? "Type a command..." : "Authentication required..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !isAuthenticated}
                  className={clsx("flex h-8 w-8 items-center justify-center rounded-lg transition-all shadow-lg",
                    (!isAuthenticated || isLoading) ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-violet-600 text-white hover:bg-violet-500 active:scale-95")}
                >
                  {!isAuthenticated ? <Lock size={12} /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIAssistantWidget() {
  return <ChatProvider><WidgetContent /></ChatProvider>;
}

const HeaderButton = ({ onClick, icon, title, isClose = false }: any) => (
  <button onClick={onClick} title={title} className={clsx("p-1.5 rounded-lg text-slate-400 transition-colors", isClose ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-white/10 hover:text-white")}>
    {icon}
  </button>
);