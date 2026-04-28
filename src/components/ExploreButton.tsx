"use client";

import React from "react";

export default function ExploreButton() {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - 120;
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
  };

  return (
    <a 
      href="#features" 
      onClick={handleScrollToFeatures}
      className="inline-block px-8 py-3.5 border-2 border-primary rounded-md text-foreground font-medium hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300"
    >
      Explore Features
    </a>
  );
}
