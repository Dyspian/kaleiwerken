"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projecten", label: "Realisaties" },
    { href: "/offerte", label: "Offerte", primary: true },
  ];

  return (
    <>
    <header 
        className={cn(
            "fixed top-0 w-full z-40 transition-all duration-500 border-b",
            scrolled 
                ? "bg-brand-light/90 backdrop-blur-md h-16 border-brand-dark/5" 
                : "bg-transparent h-20 border-transparent"
        )}
    >
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center border border-brand-dark/20 group-hover:border-brand-gold transition-colors duration-500 overflow-hidden">
             <div className="absolute inset-0 bg-brand-gold/10 scale-0 group-hover:scale-100 transition-transform origin-bottom duration-500"></div>
             <span className="font-serif text-xl font-bold italic relative z-10">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-[0.2em] font-medium leading-none">Van Roey</span>
            <span className="text-[10px] text-brand-dark/50 tracking-widest leading-tight group-hover:text-brand-gold transition-colors">Kaleiwerken</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.primary ? (
              <Button 
                key={link.href} 
                asChild 
                className="bg-brand-dark hover:bg-brand-gold hover:text-brand-dark text-white rounded-none px-6 py-5 uppercase text-xs tracking-widest font-medium transition-all duration-300"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs uppercase tracking-widest text-brand-dark/80 hover:text-brand-dark transition-colors group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-dark p-2" onClick={() => setIsOpen(true)}>
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>
    </header>
    
    {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
            className="fixed inset-0 bg-brand-light z-50 flex flex-col justify-center items-center"
          >
            <motion.div 
                className="absolute inset-0 bg-brand-gold/5 pointer-events-none"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            <button
              className="absolute top-6 right-6 text-brand-dark p-4 hover:rotate-90 transition-transform duration-500"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>

            <nav className="flex flex-col gap-8 text-center relative z-10">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + (i * 0.1) }}
              >
                  <Link
                    href={link.href}
                    className={`font-serif text-4xl md:text-5xl ${link.primary ? "text-brand-gold italic" : "text-brand-dark"} hover:opacity-70 transition-opacity`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
              </motion.div>
            ))}
            </nav>
            
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 text-center text-brand-dark/40 text-xs tracking-widest uppercase"
            >
                Antwerpen • Vlaams-Brabant • Limburg
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};