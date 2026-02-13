"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { href: "/", label: "Home" },
    { href: "/projecten", label: "Realisaties" },
    { href: "/offerte", label: "Offerte", primary: true },
  ];

  return (
    <>
    <motion.header 
        variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            scrolled ? "text-brand-dark" : "text-brand-white"
        )}
    >
        {/* Dynamic Background */}
        <div className={cn(
            "absolute inset-0 bg-brand-stone/95 backdrop-blur-md border-b border-brand-dark/5 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
        )} />

      <div className="container mx-auto px-6 h-20 md:h-24 flex justify-between items-center relative z-10">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className={cn(
            "relative w-10 h-10 flex items-center justify-center border transition-colors duration-500 overflow-hidden",
            scrolled ? "border-brand-dark/20 group-hover:border-brand-bronze" : "border-brand-white/40 group-hover:border-brand-white"
          )}>
             <span className="font-serif text-2xl font-bold italic relative z-10 leading-none pb-1">V</span>
          </div>
          <div className="flex flex-col uppercase tracking-[0.2em] leading-none">
            <span className="text-sm font-medium">Van Roey</span>
            <span className={cn(
                "text-[10px] transition-colors mt-1",
                scrolled ? "text-brand-dark/50 group-hover:text-brand-bronze" : "text-brand-white/60 group-hover:text-brand-white"
            )}>Kaleiwerken</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) =>
            link.primary ? (
              <Button 
                key={link.href} 
                asChild 
                className="rounded-none px-8 py-6 uppercase text-xs tracking-widest font-bold transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(26,25,23,0.1)] bg-brand-white text-brand-dark border border-brand-dark/10 shadow-[2px_2px_0px_0px_#8C7B6C] active:translate-y-[1px] active:shadow-none"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs uppercase tracking-widest hover:opacity-70 transition-opacity group py-2"
              >
                {link.label}
                <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full",
                    scrolled ? "bg-brand-dark" : "bg-brand-white"
                )}></span>
              </Link>
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
            className="md:hidden p-2 hover:opacity-70 transition-opacity" 
            onClick={() => setIsOpen(true)}
        >
          <Menu size={24} strokeWidth={1} />
        </button>
      </div>
    </motion.header>
    
    {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-brand-dark text-brand-stone flex flex-col"
          >
            {/* Texture */}
            <div className="absolute inset-0 bg-texture opacity-5 pointer-events-none" />

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
            
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="p-8 border-t border-brand-white/10 grid grid-cols-2 gap-8"
            >
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-brand-white/40 mb-4">Contact</h4>
                    <p className="font-serif text-lg leading-tight">info@vanroey.be<br/>+32 470 12 34 56</p>
                </div>
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-brand-white/40 mb-4">Socials</h4>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="#" className="hover:text-brand-bronze transition-colors">Instagram</a>
                        <a href="#" className="hover:text-brand-bronze transition-colors">LinkedIn</a>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};