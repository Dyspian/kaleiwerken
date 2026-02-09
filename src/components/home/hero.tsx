"use client";

import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-brand-light overflow-hidden pt-16">
      {/* Background Texture Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/texture.png')] mix-blend-overlay"></div>
      
      {/* Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/95 to-transparent z-10 w-full lg:w-2/3"></div>

      <div className="container mx-auto px-4 relative z-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-1 bg-brand-gold mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6 leading-tight">
            {siteContent.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/70 mb-8 max-w-lg">
            {siteContent.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-semibold px-8 py-6 text-lg rounded-sm" asChild>
              <Link href="/offerte">{siteContent.hero.ctaPrimary}</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white px-8 py-6 text-lg rounded-sm" asChild>
              <Link href="/projecten">{siteContent.hero.ctaSecondary}</Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Placeholder Visual Right Side */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block relative h-[600px] w-full"
        >
            <div className="absolute right-0 top-0 bottom-0 w-full bg-brand-dark/5 rounded-l-[100px] overflow-hidden shadow-2xl border-l-4 border-brand-gold">
               {/* Replace with actual image later */}
               <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-center p-8">High-Quality Kalei Texture Image Placeholder</span>
               </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};