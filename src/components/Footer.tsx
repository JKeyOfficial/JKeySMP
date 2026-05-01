"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="w-full bg-background border-t border-border py-8 md:py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-40 h-10">
              <Image 
                src="/jkeysmplogoblack.png"
                alt="JKey SMP Logo" 
                fill
                className={`object-contain transition-all duration-300 ${mounted && resolvedTheme === "dark" ? "invert" : ""}`}
              />
            </div>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/store" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Store
            </Link>
            <Link href="/info" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Info
            </Link>
            <Link href="/affiliates" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Affiliates
            </Link>
            <Link href="/privacy" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-zinc-500 font-medium">
            © {new Date().getFullYear()} JKey SMP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
