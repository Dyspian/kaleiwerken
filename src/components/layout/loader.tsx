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
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

          <div className="relative w-full max-w-md px-6 flex flex-col items-center">
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

            <div className="mt-8 h-[1px] w-full bg-white/10 relative overflow-hidden max-w-[200px]">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-brand-bronze"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.2, ease: "linear" }}
                />
            </div>
            
            <div className="flex justify-between w-full max-w-[200px] mt-2 text-[10px] uppercase tracking-widest text-white/30 font-mono">
                <span>Est. 1998</span>
                <span>Antwerpen</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};