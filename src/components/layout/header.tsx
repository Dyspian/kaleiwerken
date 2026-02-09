"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projecten", label: "Realisaties" },
    { href: "/offerte", label: "Offerte", primary: true },
  ];

  return (
    <header className="fixed top-0 w-full bg-brand-light/95 backdrop-blur-sm border-b border-brand-gold/20 z-40 h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-brand-dark flex items-center">
          <span className="w-2 h-8 bg-brand-gold mr-3"></span>
          Van Roey <span className="text-brand-gold font-normal ml-1">Kalei</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.primary ? (
              <Button key={link.href} asChild className="bg-brand-dark text-white hover:bg-brand-dark/90">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-dark/80 hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-dark" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 bg-brand-light z-50 flex flex-col justify-center items-center gap-8 text-2xl"
          >
            <button
              className="absolute top-4 right-4 text-brand-dark"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold ${link.primary ? "text-brand-gold" : "text-brand-dark"}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};