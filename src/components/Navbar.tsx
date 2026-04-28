"use client";

import Link from "next/link";
import { Moon, Sun, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Avoid hydration mismatch and handle bfcache
  useEffect(() => {
    setMounted(true);
    
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setMounted(false);
        setTimeout(() => setMounted(true), 0);
      }
    };
    
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/") {
      if (href === "/" || href.startsWith("/#")) {
        e.preventDefault();
        
        let targetPosition = 0;
        if (href.startsWith("/#")) {
          const targetId = href.substring(2);
          const element = document.getElementById(targetId);
          if (element) {
            targetPosition = element.getBoundingClientRect().top + window.scrollY - 120;
          } else {
            return;
          }
        }

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1200; // 1.2 seconds for a premium feel
        let start: number | null = null;

        window.requestAnimationFrame(function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          // easeInOutQuart
          const percent = Math.min(progress / duration, 1);
          const ease = percent < 0.5 ? 8 * percent * percent * percent * percent : 1 - Math.pow(-2 * percent + 2, 4) / 2;
          
          window.scrollTo(0, startPosition + distance * ease);
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        });
      }
    }
  };

  return (
    <nav className="fixed w-full z-[100] transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          onClick={(e) => handleScroll(e, "/")}
          className="relative z-10 flex items-center shrink-0"
        >
          <div className="relative w-48 h-12">
            <Image 
              src="/jkeysmplogoblack.png"
              alt="JKey SMP Logo" 
              fill
              sizes="192px"
              className={`object-contain transition-all duration-300 ${mounted && resolvedTheme === "dark" ? "invert" : ""}`}
              priority
            />
          </div>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center">
          {[
            { name: "Home", href: "/" },
            { name: "Store", href: "/store" },
            { name: "Features", href: "/#features" },
            { name: "Affiliates", href: "/affiliates" }
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="inline-block mx-8 text-foreground font-medium hover:text-primary hover:-translate-y-0.5 transition-all duration-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

      {/* Right Content */}
      <div className="flex items-center relative z-10">
        <button
          onClick={() => {
            navigator.clipboard.writeText("jkeysmp.net");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={`inline-block px-6 py-2.5 rounded-md text-white font-medium hover:scale-105 cursor-pointer transition-all duration-300 ${
            copied ? "bg-[#1da1f2]" : "bg-primary hover:bg-opacity-80"
          }`}
        >
          {copied ? "IP copied" : "IP: jkeysmp.net"}
        </button>
        <button 
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="ml-6 text-foreground hover:text-primary hover:scale-110 cursor-pointer transition-all duration-300"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <button className="ml-6 md:hidden text-foreground hover:text-primary">
          <Menu className="w-8 h-8" />
        </button>
      </div>
      </div>
    </nav>
  );
}
