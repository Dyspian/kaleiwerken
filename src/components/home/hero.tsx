"use client";

import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <section className="relative min-h-[95vh] w-full flex flex-col justify-center bg-brand-light overflow-hidden pt-24 px-6 md:px-12 lg:px-24">
            
            {/* Background Grain */}
            <div className="absolute inset-0 z-0 bg-texture opacity-20 pointer-events-none"></div>

            {/* Subtle Gradient Spotlights */}
            <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-light/50 rounded-full blur-[100px] mix-blend-multiply"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-1 lg:col-span-7"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-brand-gold"></div>
                        <span className="uppercase text-xs tracking-[0.2em] text-brand-gold font-medium">Sinds 1998</span>
                    </div>
                    
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.05] text-brand-dark mb-8 text-balance">
                        Authentieke <br />
                        <span className="italic font-light text-brand-dark/90">Kaleiwerken.</span>
                    </h1>
                    
                    <p className="text-brand-dark/60 text-lg md:text-xl font-light leading-relaxed max-w-lg mb-12 ml-1">
                        {siteContent.hero.subtitle}
                        <br className="hidden md:block"/>
                        Transformeer uw woning met karakter.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Button 
                            size="lg" 
                            className="bg-brand-dark hover:bg-brand-gold text-white hover:text-brand-dark transition-all duration-300 rounded-none px-10 py-7 text-sm uppercase tracking-widest group"
                            asChild
                        >
                            <Link href="/offerte">
                                {siteContent.hero.ctaPrimary}
                                <ArrowUpRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                        </Button>
                        <Link 
                            href="/projecten" 
                            className="group flex items-center gap-3 px-6 py-4 text-brand-dark/80 hover:text-brand-dark transition-colors text-sm uppercase tracking-widest border-b border-transparent hover:border-brand-dark/20"
                        >
                            {siteContent.hero.ctaSecondary}
                            <div className="w-8 h-[1px] bg-brand-dark/20 group-hover:w-12 transition-all duration-300"></div>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div 
                    style={{ y: y2 }}
                    className="col-span-1 lg:col-span-5 relative h-[500px] lg:h-[700px] w-full"
                >
                    <div className="absolute inset-0 bg-brand-dark/5 overflow-hidden shadow-2xl z-10 border border-white/50 clip-image-slant group">
                        <Image
                            src="/KALEIwerken-Vincent-Van-Roey-1.jpg"
                            alt="Authentieke kaleiwerken in wijnkelder"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                         {/* Overlay for premium look */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/10 to-transparent mix-blend-multiply pointer-events-none"></div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-12 -left-12 w-full h-full border border-brand-gold/30 z-0 hidden lg:block"></div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-brand-dark/30 hidden md:flex"
            >
                <span className="text-[10px] uppercase tracking-widest writing-vertical-rl">Scroll</span>
                <div className="h-12 w-[1px] bg-brand-dark/10 relative overflow-hidden">
                    <motion.div 
                        animate={{ y: [0, 50] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "circIn" }}
                        className="absolute top-0 w-full h-1/2 bg-brand-dark/40"
                    />
                </div>
            </motion.div>
        </section>
    );
};