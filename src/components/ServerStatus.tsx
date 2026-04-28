"use client";

import { useEffect, useState } from "react";
import { Copy, CheckCircle2, Users } from "lucide-react";

export default function ServerStatus() {
  const [status, setStatus] = useState<{ online: boolean; players: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const serverIp = "jkeysmp.net";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch server status");
        setStatus({ online: false, players: 0 });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyIp = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        onClick={copyIp}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-full cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] hover:-translate-y-1"
      >
        <span className="flex items-center space-x-2 text-lg">
          <span>{serverIp}</span>
          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-70 group-hover:opacity-100" />}
        </span>
        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-xs px-3 py-1.5 rounded-md">
          {copied ? "Copied!" : "Click to copy"}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-foreground bg-card px-6 py-3 rounded-full border border-border shadow-sm">
        <Users className="w-5 h-5 text-primary" />
        {status ? (
          <span className="font-medium">
            {status.online ? (
              <>
                <span className="text-emerald-500 font-bold">{status.players}</span> players online
              </>
            ) : (
              <span className="text-red-500">Server is currently offline</span>
            )}
          </span>
        ) : (
          <span className="animate-pulse">Checking server status...</span>
        )}
      </div>
    </div>
  );
}
