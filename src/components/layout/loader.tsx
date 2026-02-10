"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Inspecteren",
  "Mengen",
  "Strijken", 
  "Drogen",
  "Van Roey"
];

export const Loader = () => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cycle through words
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === words.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 450); // Speed of word change

    // Dismiss loader after sequence
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Optional: Store in session storage to only show once
      // sessionStorage.setItem("hasSeenLoader", "true");
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center text-brand-stone"
        >
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

          <div className="relative w-full max-w-md px-6">
            
            {/* The SVG Brush Stroke Animation */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-visible">
                <svg viewBox="0 0 400 20" className="w-full h-auto overflow-visible">
                    <motion.path
                        d="M 0 10 Q 100 20 200 10 T 400 10"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand-bronze opacity-50"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Word Cycler */}
            <div className="h-20 flex items-center justify-center overflow-hidden relative z-10 mix-blend-difference">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="font-serif text-4xl md:text-5xl italic tracking-tight"
                    >
                        {words[index]}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Progress Line */}
            <div className="mt-8 h-[1px] w-full bg-white/10 relative overflow-hidden">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-brand-bronze"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
            </div>
            
            <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest text-white/30 font-mono">
                <span>Est. 1998</span>
                <span>Antwerpen</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};