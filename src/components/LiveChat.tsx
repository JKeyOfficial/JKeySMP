"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Users, Clock, Wifi, Loader2, Check, X } from "lucide-react";

interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  rank?: string;
  isSystem?: boolean;
  isBot?: boolean;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Fetch initial messages or new ones
  const fetchMessages = async (isInitial = false) => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (Array.isArray(data)) {
        if (isInitial) {
          setMessages(data);
        } else {
          // Only add messages we don't already have
          setMessages((prev) => {
            const lastId = prev[prev.length - 1]?.id;
            const newMessages = data.filter((m: ChatMessage) => {
              const prevIds = new Set(prev.map((p) => p.id));
              return !prevIds.has(m.id);
            });
            return [...prev, ...newMessages];
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  // Fetch older messages
  const fetchHistory = async () => {
    if (isFetchingHistory || !hasMore || messages.length === 0) return;
    
    setIsFetchingHistory(true);
    const oldestId = messages[0].id;
    
    try {
      const res = await fetch(`/api/chat?before=${oldestId}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Reverse because the API returns them in reverse order, but we want them sorted by time
        // Wait, the API already reverses them? Let's check route.ts
        // In route.ts: return NextResponse.json(formattedMessages.reverse());
        // So for history, they will come in chronologically (oldest first).
        
        // Save scroll position
        const scrollContainer = scrollRef.current;
        const previousScrollHeight = scrollContainer?.scrollHeight || 0;
        
        setMessages((prev) => [...data, ...prev]);
        
        // Restore scroll position after render
        setTimeout(() => {
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight - previousScrollHeight;
          }
        }, 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom only on first load or when close to bottom
  useEffect(() => {
    if (scrollRef.current && isInitialMount.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isInitialMount.current = false;
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // If scrolled to top, fetch history
    if (target.scrollTop < 50 && !isFetchingHistory && hasMore) {
      fetchHistory();
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatar = (name: string) => {
    if (name.startsWith(".")) {
      return "https://mc-heads.net/avatar/steve/64";
    }
    if (name === "System" || name.includes("Bot")) {
      return "https://ui-avatars.com/api/?name=S&background=random";
    }
    return `https://mc-heads.net/avatar/${name}/64`;
  };

  const getRankColor = (rank: string) => {
    const r = rank.toLowerCase();
    if (r.includes("ultra")) return "from-pink-500 to-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]";
    if (r.includes("elite")) return "from-cyan-400 to-blue-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]";
    if (r.includes("pro")) return "from-amber-400 to-yellow-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.3)]";
    if (r.includes("member")) return "bg-zinc-600 text-zinc-200";
    return "bg-zinc-500/50 text-zinc-300";
  };

  return (
    <div className="flex flex-col h-[700px] bg-card/80 border border-border rounded-3xl overflow-hidden backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-background/50 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-card animate-pulse shadow-lg shadow-green-500/50"></div>
          </div>
          <div>
            <h3 className="text-lg font-black font-heading text-foreground flex items-center gap-2">
              JKey SMP Live
              <span className="text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold">
                Online
              </span>
            </h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-ping"></span>
              {messages.length > 0 ? "Synced with Minecraft" : "Connecting..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Server Status</span>
            <span className="text-xs font-mono text-green-500">STABLE • 15ms</span>
          </div>
          <Wifi className="w-5 h-5 text-zinc-600" />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scroll-smooth relative"
      >
        {isFetchingHistory && (
          <div className="flex justify-center py-4 absolute top-0 left-0 w-full z-10 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Waking up the server...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
            >
              {msg.author === "Server_Up" ? (
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30 shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Check className="w-6 h-6" />
                </div>
              ) : msg.author === "Server_Down" ? (
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <X className="w-6 h-6" />
                </div>
              ) : (msg.author && msg.author !== "System" && !msg.author.startsWith("Server_")) && (
                <div className="relative shrink-0">
                  <img
                    src={getAvatar(msg.author)}
                    alt={msg.author}
                    className="w-10 h-10 rounded-xl shadow-xl border border-border/50 bg-background hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {!msg.isSystem && (
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.rank && (
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-gradient-to-r shadow-sm ${getRankColor(msg.rank)}`}>
                        {msg.rank}
                      </span>
                    )}
                    <span className="font-bold text-sm text-foreground/90 font-heading">
                      {msg.author}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-medium">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`
                  relative text-sm leading-relaxed p-3.5 rounded-2xl border transition-all duration-300
                  ${msg.author === "Server_Up"
                    ? "bg-green-500/10 border-green-500/20 text-green-400 font-bold"
                    : msg.author === "Server_Down"
                    ? "bg-red-500/10 border-red-500/20 text-red-400 font-bold"
                    : msg.isSystem 
                    ? "bg-zinc-800/30 border-zinc-700/30 text-zinc-400 italic text-xs" 
                    : "bg-background/80 border-border/50 text-zinc-300 hover:border-primary/20 hover:bg-background shadow-sm rounded-tl-none"}
                `}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-background/50 border-t border-border/50 flex items-center justify-center gap-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Direct Bridge: Minecraft ↔ Web
        </div>
      </div>
    </div>
  );
}
