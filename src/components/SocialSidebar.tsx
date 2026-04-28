"use client";

import React from "react";

export default function SocialSidebar() {
  return (
    <div className="absolute left-[6%] top-[420px] z-[90] flex-col items-center space-y-8 hidden lg:flex">
      <a
        href="https://discord.com/invite/sgpBTVPqnu"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300 flex items-center justify-center w-6 h-6"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107a14.314 14.314 0 0 0 1.226 1.994a.075.075 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.966 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </a>
      <a
        href="https://www.youtube.com/@jkey"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300 flex items-center justify-center w-6 h-6"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M21.582 6.186a2.665 2.665 0 00-1.87-1.884C18.062 3.864 12 3.864 12 3.864s-6.061 0-7.711.438a2.66 2.66 0 00-1.871 1.884c-.438 1.66-.438 5.127-.438 5.127s0 3.468.438 5.128a2.66 2.66 0 001.87 1.884c1.65.438 7.712.438 7.712.438s6.061 0 7.711-.438a2.665 2.665 0 001.87-1.884c.438-1.66.438-5.128.438-5.128s0-3.467-.438-5.127zM9.545 14.596V8.423l5.88 3.087-5.88 3.086z" />
        </svg>
      </a>
      <a
        href="https://x.com/JKeyOfficial"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300 flex items-center justify-center w-6 h-6"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.93H5.078z" />
        </svg>
      </a>
      <a
        href="https://www.tiktok.com/@jkeyofficialyt"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:text-primary hover:scale-110 transition-all duration-300 flex items-center justify-center w-6 h-6"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.23-2.74.24-.81.47-1.37 1.33-1.45 2.24-.02.57.09 1.14.39 1.64.43.82 1.25 1.39 2.17 1.5.51.06 1.03.01 1.52-.16.94-.37 1.65-1.17 1.87-2.12.11-1.21.1-2.42.11-3.63V.02z" />
        </svg>
      </a>
    </div>
  );
}
