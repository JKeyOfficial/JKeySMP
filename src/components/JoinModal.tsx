"use client";

import React, { useState } from "react";
import { X, Copy, Check, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [copiedIP, setCopiedIP] = useState(false);
  const [copiedPort, setCopiedPort] = useState(false);

  const ip = "jkeysmp.net";
  const port = "40008";

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-primary/5">
              <h2 className="text-2xl font-bold font-heading text-foreground">How to Join</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-border transition-colors text-foreground/60 hover:text-foreground cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Java / Bedrock IP */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
                    Server Address (Java & Bedrock)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground select-all">
                      {ip}
                    </div>
                    <button
                      onClick={() => copyToClipboard(ip, setCopiedIP)}
                      className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center min-w-[50px] cursor-pointer"
                    >
                      {copiedIP ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
                    Bedrock Port
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg text-foreground select-all">
                      {port}
                    </div>
                    <button
                      onClick={() => copyToClipboard(port, setCopiedPort)}
                      className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center min-w-[50px] cursor-pointer"
                    >
                      {copiedPort ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Console Info */}
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold font-heading text-foreground">Console Players</h3>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                  <div className="flex gap-4">
                    <Smartphone className="w-10 h-10 text-primary shrink-0" />
                    <div>
                      <p className="text-foreground font-medium mb-2">Join using BedrockTogether</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                        Consoles (Xbox, PlayStation, Switch) cannot normally add custom servers.
                        Download the <span className="text-primary font-bold">BedrockTogether</span> app on your phone, enter our IP and Port, and the server will appear in your "Friends" tab on your console!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
