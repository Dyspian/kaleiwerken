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
  "Vakmanschap"
];

export const Loader = ({ words = defaultWords }: LoaderProps) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  const logoUrl = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/logo/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ28ucG5nIiwiaWF0IjoxNzczNTA4ODM3LCJleHAiOjIwODg4Njg4Mzd9._JsyJFoJNsHg_-6zXibQmbbFoZoXAComlXyobGwVb4c";

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIndex((prev) => {
        if (prev === words.length - 1) {
          clearInterval(wordInterval);
          // Na de woorden, toon het logo
          setTimeout(() => setShowLogo(true), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(wordInterval);
  }, [words]);

  useEffect(() => {
    if (showLogo) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2200); // Toon logo voor 2.2 seconden en start dan de fade-out
      return () => clearTimeout(timer);
    }
  }, [showLogo]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center text-brand-stone"
        >
          {/* Texture & Decorative elements */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-bronze/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-bronze/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative w-full max-w-md px-6 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!showLogo ? (
                <motion.div 
                  key="words-phase"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
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
                      <div className="h-[4px] w-full bg-white/5 rounded-full relative overflow-hidden">
                          <motion.div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-bronze/20 via-brand-bronze/60 to-brand-bronze rounded-full shadow-[0_0_15px_rgba(140,123,108,0.4)]"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 3, ease: "linear" }}
                          />
                      </div>

                      <motion.div
                          className="absolute -top-10 left-0 z-20 text-brand-bronze"
                          initial={{ left: "0%", opacity: 0 }}
                          animate={{ 
                              left: "100%",
                              y: [0, -3, 1, -3, 0],
                              opacity: [0, 1, 1, 0],
                              rotate: [15, 35, 15, 35, 15, 35, 15]
                          }}
                          transition={{ 
                              left: { duration: 3, ease: "linear" },
                              y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" },
                              opacity: { times: [0, 0.1, 0.9, 1], duration: 3 },
                              rotate: { repeat: Infinity, duration: 0.4, ease: "easeInOut" }
                          }}
                          style={{ translateX: "-50%" }}
                      >
                          <Paintbrush size={32} strokeWidth={1.2} className="drop-shadow-lg" />
                      </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-phase"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center"
                >
                  <img 
                    src={logoUrl} 
                    alt="Van Roey Logo" 
                    className="w-64 md:w-80 h-auto object-contain brightness-0 invert opacity-90"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Footer info */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex justify-between w-full max-w-[280px] mt-12 text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono"
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