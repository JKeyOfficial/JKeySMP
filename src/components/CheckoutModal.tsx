"use client";

import { useState } from "react";
import { StoreItem } from "@/config/store";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  item: StoreItem | null;
  onClose: () => void;
}

import { useUser } from "@/context/UserContext";
import { Monitor, Gamepad2 } from "lucide-react";

export default function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const { username: loggedInUser } = useUser();
  const [username, setUsername] = useState(loggedInUser?.startsWith('.') ? loggedInUser.substring(1) : (loggedInUser || ""));
  const [platform, setPlatform] = useState<"java" | "bedrock">(loggedInUser?.startsWith('.') ? "bedrock" : "java");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={platform === "bedrock" ? "Username (without .)" : "Username"}
                className="w-full h-14 px-5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                required
              />
              {platform === "bedrock" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg pointer-events-none opacity-50">.</span>
              )}
            </div>
            {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400">Total</span>
              <span className="text-xl font-bold text-white">${(item.price / 100).toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all duration-300",
                "bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(228,1,46,0.3)] hover:scale-105"
              )}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proceed to Checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
