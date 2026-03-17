"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { usePathname } from "next/navigation";

export const Header = ({ dict }: { dict?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "nl";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
        setHidden(true);
    } else {
        setHidden(false);
    }
    setScrolled(latest > 50);
  });

  const navLinks = [
    { href: `/${locale}`, label: dict?.header?.home || "Home" },
    { href: `/${locale}/over-ons`, label: dict?.header?.about || "Over Ons" },
    { href: `/${locale}/projecten`, label: dict?.header?.projects || "Realisaties" },
    { href: `/${locale}/offerte`, label: dict?.header?.quote || "Offerte", primary: true },
  ];

  const logoUrl = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/logo/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ28ucG5nIiwiaWF0IjoxNzczNTA4ODM3LCJleHAiOjIwODg4Njg4Mzd9._JsyJFoJNsHg_-6zXibQmbbFoZoXAComlXyobGwVb4c";

  return (
    <>
    <motion.header 
        variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 text-brand-dark"
    >
        <div className={cn(
            "absolute inset-0 bg-brand-stone/95 backdrop-blur-md border-b border-brand-dark/5 transition-shadow duration-500",
            scrolled ? "shadow-sm" : "shadow-none"
        )} />

      <div className="container mx-auto px-6 h-20 md:h-24 flex justify-between items-center relative z-10">
        
        <Link href={`/${locale}`} className="group relative w-32 md:w-48 h-full flex items-center">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[140%] md:h-[160%] w-auto flex items-center pointer-events-none">
            <img 
                src={logoUrl} 
                alt="Van Roey Logo" 
                className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105 origin-left pointer-events-auto"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.primary ? (
              <Link
                key={link.href}
                href={link.href}
                className="
                  relative inline-flex items-center justify-center
                  px-8 py-4 rounded-xl
                  font-semibold tracking-wide
                  text-[#F5F2EA]
                  bg-[#0B0D10]
                  border border-[#C8B07A]/35
                  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                  transition-all duration-200
                  hover:-translate-y-[1px] hover:shadow-[0_14px_38px_rgba(0,0,0,0.45)]
                  active:translate-y-0 active:shadow-[0_8px_22px_rgba(0,0,0,0.35)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8B07A]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D10]
                  overflow-hidden
                  uppercase text-[10px] tracking-[0.2em]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0
                    opacity-[0.22]
                    [background:
                      radial-gradient(1200px_400px_at_30%_20%,rgba(200,176,122,0.18),transparent_55%),
                      radial-gradient(900px_280px_at_70%_80%,rgba(245,242,234,0.10),transparent_60%)
                    ]
                  "
                />
                <span className="relative z-10">{link.label}</span>
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            )
          )}
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button 
                className="p-2 hover:opacity-70 transition-opacity" 
                onClick={() => setIsOpen(true)}
            >
            <Menu size={24} strokeWidth={1} />
            </button>
        </div>
      </div>
    </motion.header>
    
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-brand-dark text-brand-stone flex flex-col"
          >
            <div className="container mx-auto px-6 h-24 flex justify-between items-center border-b border-brand-white/10">
                <span className="text-sm uppercase tracking-widest font-medium">Menu</span>
                <button
                className="p-2 hover:rotate-90 transition-transform duration-500"
                onClick={() => setIsOpen(false)}
                >
                <X size={28} strokeWidth={1} />
                </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-6 gap-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + (i * 0.1), duration: 0.5, ease: "easeOut" }}
              >
                  <Link
                    href={link.href}
                    className={cn(
                        "font-serif text-5xl font-light block py-2 border-b border-transparent hover:border-brand-bronze transition-colors hover:text-brand-bronze hover:pl-4 duration-300",
                        link.primary ? "text-brand-bronze italic" : "text-brand-stone"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
              </motion.div>
            ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};