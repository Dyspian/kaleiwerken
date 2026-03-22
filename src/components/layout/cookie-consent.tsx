"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

interface CookieConsentProps {
  dict: any;
  locale: string;
}

export const CookieConsent = ({ dict, locale }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!dict?.cookies) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:max-w-md z-[100]"
        >
          <div className="bg-brand-stone border border-brand-dark/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Subtiele textuur overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-bronze/10 flex items-center justify-center text-brand-bronze">
                  <Cookie size={20} />
                </div>
                <h3 className="font-serif text-xl text-brand-dark">{dict.cookies.title}</h3>
              </div>

              <p className="text-sm text-brand-dark/60 font-light leading-relaxed mb-8">
                {dict.cookies.description}{" "}
                <Link href={`/${locale}/privacy`} className="text-brand-bronze hover:underline underline-offset-4">
                  {dict.common.privacy}
                </Link>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-brand-dark text-white rounded-none px-6 py-6 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500"
                >
                  {dict.cookies.accept}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className="flex-1 border-brand-dark/10 text-brand-dark/40 rounded-none px-6 py-6 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-stone hover:text-brand-dark transition-all duration-500"
                >
                  {dict.cookies.decline}
                </Button>
              </div>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-brand-dark/20 hover:text-brand-dark transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};