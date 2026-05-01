"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { X, Monitor, Gamepad2, ChevronRight } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<"java" | "bedrock">("java");
  const { login, isLoading } = useUser();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Add the '.' prefix for bedrock if it's not already there
      let finalName = name.trim();
      if (platform === "bedrock" && !finalName.startsWith(".")) {
        finalName = "." + finalName;
      }
      await login(finalName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header with Background Pattern */}
        <div className="h-32 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <img src="/jkeysmplogoblack.png" alt="Logo" className="h-12 invert brightness-200 relative z-10" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6 sm:mb-8">Enter your Minecraft Username</h2>

          {/* Platform Toggle */}
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setPlatform("java")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-bold ${
                platform === "java" 
                ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(228,1,46,0.4)]" 
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <Monitor className="w-5 h-5" />
              JAVA
            </button>
            <button
              onClick={() => setPlatform("bedrock")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-bold ${
                platform === "bedrock" 
                ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(228,1,46,0.4)]" 
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              BEDROCK
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={platform === "bedrock" ? "Username (without .)" : "Username"}
                className="w-full h-14 sm:h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg font-medium"
                required
                autoFocus
              />
              {platform === "bedrock" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xl pointer-events-none opacity-50">.</span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-14 sm:h-16 px-8 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? "..." : "Continue"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-center text-white/30 text-xs mt-8 uppercase tracking-widest font-bold">
            JKeySMP.net • Official Store
          </p>
        </div>
      </div>
    </div>
  );
}
