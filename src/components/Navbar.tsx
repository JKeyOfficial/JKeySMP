"use client";

import Link from "next/link";
import { Moon, Sun, Menu, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { username, logout } = useUser();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

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
    <>
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
            {mounted && (
              <>
                {username ? (
                  <div className="flex items-center gap-4 mr-6 pr-6 border-r border-border">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-xs text-muted-foreground">Logged in as</span>
                      <span className="text-sm font-bold">{username}</span>
                    </div>
                    <div className="relative w-12 h-12 group">
                      <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/40 transition-all"></div>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-primary shadow-lg bg-zinc-800 flex items-center justify-center">
                        <Image 
                          src={avatarError 
                            ? `https://minotar.net/helm/char/64.png`
                            : `https://minotar.net/helm/${username.startsWith('.') ? username.substring(1) : username}/64.png`
                          }
                          alt={username}
                          fill
                          className="object-cover"
                          onError={() => setAvatarError(true)}
                        />
                        <button 
                          onClick={logout}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                          title="Logout"
                        >
                          <LogOut className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="mr-6 px-4 py-2 text-sm font-bold border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    Login
                  </button>
                )}

                <button
                  onClick={() => {
                    navigator.clipboard.writeText("jkeysmp.net");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`inline-block px-6 py-2.5 rounded-md text-white font-medium hover:scale-105 cursor-pointer transition-all duration-300 ${
                    copied ? "bg-[#1da1f2]" : "bg-primary hover:bg-[#1da1f2]"
                  }`}
                >
                  {copied ? "IP copied" : "IP: jkeysmp.net"}
                </button>

                <button 
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="ml-6 text-foreground hover:text-primary hover:scale-110 cursor-pointer transition-all duration-300"
                >
                  {resolvedTheme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
