"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const prevPath = sessionStorage.getItem("prevPath");
    const isHome = pathname === "/" || pathname.startsWith("/#");
    
    if (prevPath === "/" && (pathname === "/store" || pathname === "/affiliates")) {
      setDirection(1);
    } else if ((prevPath === "/store" || prevPath === "/affiliates") && isHome) {
      setDirection(-1);
    } else if (prevPath === "/store" && pathname === "/affiliates") {
      setDirection(1);
    } else if (prevPath === "/affiliates" && pathname === "/store") {
      setDirection(-1);
    }
    sessionStorage.setItem("prevPath", pathname);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ 
        x: direction > 0 ? 40 : direction < 0 ? -40 : 0, 
        opacity: 0 
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
