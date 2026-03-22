"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CookieConsentProps {
  dict: any;
  locale: string;
}

type View = "banner" | "settings";

export const CookieConsent = ({ dict, locale }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [hasConsent, setHasConsent] = useState(false);
  
  const [prefs, setPrefs] = useState({
    functional: true, // Altijd aan
    analytical: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    const savedPrefs = localStorage.getItem("cookie-prefs");
    
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }

    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setHasConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allOn = { functional: true, analytical: true, marketing: true };
    setPrefs(allOn);
    saveConsent(allOn);
  };

  const handleSavePrefs = () => {
    saveConsent(prefs);
  };

  const saveConsent = (preferences: typeof prefs) => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-prefs", JSON.stringify(preferences));
    setIsVisible(false);
    setHasConsent(true);
    setView("banner");
  };

  if (!dict?.cookies) return null;

  return (
    <>
      {/* Kleine persistente knop om instellingen te heropenen */}
      <AnimatePresence>
        {hasConsent && !isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsVisible(true)}
            className="fixed bottom-6 left-6 z-[90] w-10 h-10 bg-brand-stone border border-brand-dark/10 rounded-full flex items-center justify-center text-brand-dark/40 hover:text-brand-bronze hover:border-brand-bronze transition-all shadow-lg group"
            title={dict.cookies.manage}
          >
            <Cookie size={18} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

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
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {view === "banner" ? (
                    <motion.div
                      key="banner"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
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

                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={handleAcceptAll}
                          className="w-full bg-brand-dark text-white rounded-none px-6 py-6 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500"
                        >
                          {dict.cookies.accept}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setView("settings")}
                          className="w-full border-brand-dark/10 text-brand-dark/40 rounded-none px-6 py-6 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-stone hover:text-brand-dark transition-all duration-500"
                        >
                          <Settings size={14} className="mr-2" /> {dict.cookies.decline}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <button 
                          onClick={() => setView("banner")}
                          className="p-2 -ml-2 hover:text-brand-bronze transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h3 className="font-serif text-xl text-brand-dark">{dict.cookies.manage}</h3>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-brand-dark">{dict.cookies.functional}</p>
                            <p className="text-xs text-brand-dark/40 leading-relaxed">{dict.cookies.functionalDesc}</p>
                          </div>
                          <Switch checked={true} disabled className="data-[state=checked]:bg-brand-bronze" />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-brand-dark">{dict.cookies.analytical}</p>
                            <p className="text-xs text-brand-dark/40 leading-relaxed">{dict.cookies.analyticalDesc}</p>
                          </div>
                          <Switch 
                            checked={prefs.analytical} 
                            onCheckedChange={(val) => setPrefs(p => ({ ...p, analytical: val }))}
                            className="data-[state=checked]:bg-brand-bronze"
                          />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-brand-dark">{dict.cookies.marketing}</p>
                            <p className="text-xs text-brand-dark/40 leading-relaxed">{dict.cookies.marketingDesc}</p>
                          </div>
                          <Switch 
                            checked={prefs.marketing} 
                            onCheckedChange={(val) => setPrefs(p => ({ ...p, marketing: val }))}
                            className="data-[state=checked]:bg-brand-bronze"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSavePrefs}
                        className="w-full bg-brand-dark text-white rounded-none px-6 py-6 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500 mt-4"
                      >
                        {dict.cookies.save}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
    </>
  );
};