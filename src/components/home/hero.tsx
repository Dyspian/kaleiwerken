"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/content/site";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            
            {/* Background Parallax Image */}
            <motion.div 
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-brand-dark/40 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent z-10" />
                <Image
                    src="/KALEIwerken-Vincent-Van-Roey-1.jpg"
                    alt="Authentieke kaleiwerken detail"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                    unoptimized
                />
            </motion.div>

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-24 md:pb-32 text-brand-white">
                
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center gap-3 mb-6 opacity-80">
                        <span className="h-[1px] w-8 bg-brand-white/60"></span>
                        <span className="uppercase text-xs tracking-[0.25em] font-medium">Sinds 1998</span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] md:leading-[0.9] tracking-tight mb-8">
                        <span className="block overflow-hidden">
                            <motion.span 
                                initial={{ y: "100%" }} 
                                animate={{ y: 0 }} 
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="block"
                            >
                                Authentieke
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden">
                            <motion.span 
                                initial={{ y: "100%" }} 
                                animate={{ y: 0 }} 
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="block italic text-brand-bronzeLight/90"
                            >
                                Kaleiwerken.
                            </motion.span>
                        </span>
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-t border-brand-white/20 pt-8 mt-12">
                        <p className="text-brand-white/80 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                            {siteContent.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Button 
                                size="lg" 
                                className="bg-brand-bronze text-white hover:bg-brand-dark rounded-none px-8 py-8 text-sm uppercase tracking-widest transition-all duration-500 w-full sm:w-auto"
                                asChild
                            >
                                <Link href="/offerte">
                                    {siteContent.hero.ctaPrimary}
                                    <ArrowUpRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            
                            <Button 
                                variant="outline"
                                size="lg"
                                className="border-brand-white/30 text-brand-white hover:bg-brand-white hover:text-brand-dark rounded-none px-8 py-8 text-sm uppercase tracking-widest transition-all duration-500 w-full sm:w-auto bg-transparent backdrop-blur-sm"
                                asChild
                            >
                                <Link href="/projecten">
                                    {siteContent.hero.ctaSecondary}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                style={{ opacity }}
                className="absolute bottom-8 right-8 md:right-12 hidden md:flex flex-col items-center gap-4 z-20 mix-blend-difference text-white"
            >
                <span className="text-[10px] uppercase tracking-widest writing-vertical-rl rotate-180">Scroll</span>
                <div className="h-16 w-[1px] bg-white/20 overflow-hidden relative">
                     <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute top-0 w-full h-1/2 bg-white"
                    />
                </div>
            </motion.div>

        </section>
    );
};