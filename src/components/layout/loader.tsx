"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush } from "lucide-react";

interface LoaderProps {
  words?: string[];
}

const defaultWords = [
  "Inspecteren",
  "Mengen",
  "Strijken", 
  "Drogen",
  "Van Roey"
];

export const Loader = ({ words = defaultWords }: LoaderProps) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === words.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); 

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [words]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center text-brand-stone"
        >
          {/* Texture & Decorative elements */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-bronze/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-bronze/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative w-full max-w-md px-6 flex flex-col items-center">
            {/* Word Sequence */}
            <div className="h-24 flex items-center justify-center overflow-hidden relative z-10 w-full">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="font-serif text-4xl md:text-5xl italic tracking-tight text-center block text-brand-white"
                    >
                        {words[index]}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Animated Brush & Paint Line */}
            <div className="mt-16 w-full max-w-[280px] relative">
                {/* Background Track */}
                <div className="h-[4px] w-full bg-white/5 rounded-full relative overflow-hidden">
                    {/* The Paint Stroke */}
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-bronze/20 via-brand-bronze/60 to-brand-bronze rounded-full shadow-[0_0_15px_rgba(140,123,108,0.4)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.8, ease: "linear" }}
                    />
                </div>

                {/* The Brush - Positioned at the leading edge of the paint stroke */}
                <motion.div
                    className="absolute -top-10 left-0 z-20 text-brand-bronze"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ 
                        left: "100%",
                        y: [0, -3, 1, -3, 0], // Brushing motion
                        opacity: [0, 1, 1, 0],
                        rotate: [15, 35, 15, 35, 15, 35, 15] // Dynamic rotation
                    }}
                    transition={{ 
                        left: { duration: 2.8, ease: "linear" },
                        y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" },
                        opacity: { times: [0, 0.1, 0.9, 1], duration: 2.8 },
                        rotate: { repeat: Infinity, duration: 0.4, ease: "easeInOut" }
                    }}
                    style={{ translateX: "-50%" }}
                >
                    <Paintbrush size={32} strokeWidth={1.2} className="drop-shadow-lg" />
                    
                    {/* Subtle paint drip from the brush head */}
                    <motion.div 
                        className="absolute top-[80%] left-1/2 w-[2px] h-3 bg-brand-bronze/60 rounded-full"
                        animate={{ height: [3, 10, 3], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                    />
                </motion.div>
            </div>
            
            {/* Footer info */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex justify-between w-full max-w-[280px] mt-8 text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono"
            >
                <span>Est. 2015</span>
                <span>Vakmanschap</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};