"use client";

import { useState } from "react";
import { StoreItem } from "@/config/store";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  item: StoreItem | null;
  onClose: () => void;
  initialPrice?: number;
}

import { useUser } from "@/context/UserContext";
import { Monitor, Gamepad2, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function CheckoutModal({ item, onClose, initialPrice }: CheckoutModalProps) {
  const { username: loggedInUser } = useUser();
  const [username, setUsername] = useState(loggedInUser?.startsWith('.') ? loggedInUser.substring(1) : (loggedInUser || ""));
  const [platform, setPlatform] = useState<"java" | "bedrock">(loggedInUser?.startsWith('.') ? "bedrock" : "java");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dynamicPrice, setDynamicPrice] = useState<number>(initialPrice || item?.price || 0);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  // Auto-check for discounts when username changes
  useEffect(() => {
    if (!username.trim() || !item) return;

    const checkDiscount = async () => {
      setIsCheckingDiscount(true);
      try {
        let finalName = username.trim();
        if (platform === "bedrock" && !finalName.startsWith(".")) {
          finalName = "." + finalName;
        }

        const res = await fetch(`/api/user/info?username=${finalName}`);
        const data = await res.json();
        
        if (data.groups) {
          const { rankPriority } = await import("@/config/store");
          const userLevel = Math.max(...data.groups.map((g: string) => rankPriority[g] || 0));
          const targetLevel = rankPriority[item.id.replace("rank_", "")] || 0;

          if (userLevel > 0 && userLevel < targetLevel) {
            const currentRankKey = Object.keys(rankPriority).find(k => rankPriority[k] === userLevel);
            const { storeItems } = await import("@/config/store");
            const currentRankItem = storeItems.find(i => i.id === `rank_${currentRankKey}`);
            if (currentRankItem) {
              setDynamicPrice(Math.max(0, item.price - currentRankItem.price));
            }
          } else {
            setDynamicPrice(item.price);
          }
        }
      } catch (err) {
        console.error("Discount check failed:", err);
      } finally {
        setIsCheckingDiscount(false);
      }
    };

    const timer = setTimeout(checkDiscount, 500); // Debounce
    return () => clearTimeout(timer);
  }, [username, platform, item]);

  if (!item) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your Minecraft username.");
      return;
    }
    
    setLoading(true);
    setError("");

    // Add prefix for bedrock
    let finalName = username.trim();
    if (platform === "bedrock" && !finalName.startsWith(".")) {
      finalName = "." + finalName;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          username: finalName,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isUpgrade = dynamicPrice < item.price;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 bg-[#121212] border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Purchase {item.name}</h2>
          <p className="text-white/40">Choose your platform and enter your username.</p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Platform Toggle */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPlatform("java")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                platform === "java" 
                ? "bg-primary border-primary text-white" 
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <Monitor className="w-4 h-4" />
              JAVA
            </button>
            <button
              type="button"
              onClick={() => setPlatform("bedrock")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                platform === "bedrock" 
                ? "bg-primary border-primary text-white" 
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              BEDROCK
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-bold text-white/60 uppercase tracking-wider">
              Minecraft Username
            </label>
            <div className="relative group/input">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={platform === "bedrock" ? "Username (without .)" : "Username"}
                className="w-full h-16 px-5 pr-16 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                required
              />
              
              {/* Dynamic Avatar Preview */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                {isCheckingDiscount && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                )}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 shadow-inner">
                  <img
                    src={username.trim() 
                      ? `https://minotar.net/helm/${platform === "bedrock" && !username.startsWith('.') ? '.' + username : username}/40.png`
                      : "https://minotar.net/helm/Steve/40.png"
                    }
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://minotar.net/helm/Steve/40.png";
                    }}
                  />
                </div>
              </div>

              {platform === "bedrock" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg pointer-events-none opacity-50">.</span>
              )}
            </div>
            {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-zinc-400 text-sm">Total Due</span>
                {isUpgrade && (
                  <span className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-2 h-2" />
                    Rank Discount Applied
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                {isUpgrade && (
                  <span className="text-xs text-zinc-500 line-through">${(item.price / 100).toFixed(2)}</span>
                )}
                <span className="text-2xl font-black text-white">${(dynamicPrice / 100).toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || isCheckingDiscount}
              className={cn(
                "w-full flex items-center justify-center py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 uppercase tracking-widest text-sm",
                "bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(228,1,46,0.3)] hover:scale-105"
              )}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isUpgrade ? "Complete Upgrade" : "Complete Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
