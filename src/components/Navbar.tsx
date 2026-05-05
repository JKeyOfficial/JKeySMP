"use client";

import Link from "next/link";
import { Moon, Sun, Menu, LogOut, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Info", href: "/info" },
  ];

  return (
    <>
      <nav className="fixed w-full z-[100] transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleScroll(e, "/")}
            className="relative z-10 flex items-center shrink-0"
          >
            <div className="relative w-36 md:w-48 h-10 md:h-12">
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

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center">
            {navItems.map((item) => (
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
                  <div className="hidden sm:flex items-center gap-4 mr-4 md:mr-6 pr-4 md:pr-6 border-r border-border">
                    <div className="flex flex-col items-end hidden md:flex">
                      <span className="text-xs text-muted-foreground">Logged in as</span>
                      <span className="text-sm font-bold">{username}</span>
                    </div>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 group">
                      <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/40 transition-all"></div>
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-primary shadow-lg bg-zinc-800 flex items-center justify-center">
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
                    className="hidden sm:block mr-4 md:mr-6 px-4 py-2 text-sm font-bold border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    Login
                  </button>
                )}

                {/* IP Button – hidden on very small screens */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("jkeysmp.net");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`hidden sm:inline-block px-4 md:px-6 py-2 md:py-2.5 rounded-md text-white text-sm md:text-base font-medium hover:scale-105 cursor-pointer transition-all duration-300 ${copied ? "bg-[#1da1f2]" : "bg-primary hover:bg-[#1da1f2]"
                    }`}
                >
                  {copied ? "IP copied" : "IP: jkeysmp.net"}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="ml-4 md:ml-6 text-foreground hover:text-primary hover:scale-110 cursor-pointer transition-all duration-300"
                >
                  {resolvedTheme === "dark" ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
                </button>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden ml-3 p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mounted && (
        <div
          className={`fixed inset-0 z-[99] md:hidden transition-all duration-300 ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className={`absolute top-20 left-0 right-0 bg-card border-b border-border shadow-2xl transition-all duration-300 ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            <div className="px-6 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleScroll(e, item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="block px-4 py-3.5 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile-only actions */}
            <div className="px-6 pb-6 pt-2 border-t border-border space-y-3">
              {/* IP Copy Button (mobile) */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText("jkeysmp.net");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                  copied ? "bg-[#1da1f2]" : "bg-primary"
                }`}
              >
                {copied ? "IP Copied!" : "Copy Server IP"}
              </button>

              {/* Login / User info (mobile) */}
              {username ? (
                <div className="flex items-center justify-between px-4 py-3 bg-background rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary bg-zinc-800">
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
                    </div>
                    <span className="font-bold text-sm">{username}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-500 text-sm font-bold hover:underline cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
