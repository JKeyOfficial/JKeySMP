"use client";

import { useState } from "react";
import { StoreItem } from "@/config/store";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  item: StoreItem | null;
  onClose: () => void;
}

export default function CheckoutModal({ item, onClose }: CheckoutModalProps) {
  const [username, setUsername] = useState("");
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

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          username: username.trim(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1 text-white">Purchase {item.name}</h2>
          <p className="text-zinc-400">Enter your Minecraft username to receive your rank.</p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1">
              Minecraft Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Notch"
              className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
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
