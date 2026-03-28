"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Hero = ({ dict }: { dict: any }) => {
    const containerRef = useRef(null);
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "nl";

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Use default values if dict is empty or undefined
    const title1 = dict?.title1 || "Authentieke";
    const title2 = dict?.title2 || "Kaleiwerken.";
    const subtitle = dict?.subtitle || "Al 10 jaar specialist in authentieke kaleiwerken voor binnen en buiten. Actief in heel België en internationaal. Een vast team van twee vakmensen voor een persoonlijke aanpak.";
    const ctaPrimary = dict?.ctaPrimary || "Vraag offerte aan";
    const ctaSecondary = dict?.ctaSecondary || "Bekijk realisaties";
    const est = dict?.est || "Sinds 2015";

    // Use CMS hero image if available, otherwise fallback to default
    const heroImage = dict?.heroImage || "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg";

    return (
        <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            
            <motion.div 
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-black/40 z-10" />
                
                <Image
                    src={heroImage}
                    alt="Authentieke kaleiwerken"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                    unoptimized
                />
            </motion.div>

            <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col justify-end h-full pb-24">
                
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center gap-3 mb-6 opacity-80">
                        <span className="h-[1px] w-8 bg-brand-white/60"></span>
                        <span className="uppercase text-xs tracking-[0.25em] font-medium text-white">{est}</span>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] md:leading-[0.9] tracking-tight mb-8 text-white">
                        <span className="block overflow-hidden">
                            <motion.span 
                                initial={{ y: "100%" }} 
                                animate={{ y: 0 }} 
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="block"
                            >
                                {title1}
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden">
                            <motion.span 
                                initial={{ y: "100%" }} 
                                animate={{ y: 0 }} 
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="block italic text-brand-bronzeLight/90"
                            >
                                {title2}
                            </motion.span>
                        </span>
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-t border-brand-white/20 pt-8 mt-12">
                        <p className="text-brand-white/80 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                            {subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                            <Link 
                                href={`/${locale}/offerte`}
                                className="relative inline-flex items-center justify-center px-10 py-5 rounded-xl font-bold tracking-[0.15em] text-white bg-brand-bronze border border-brand-bronze shadow-lg transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl active:translate-y-0 active:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-black overflow-hidden uppercase text-xs group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {ctaPrimary}
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </Link>
                            
                            <Link 
                                href={`/${locale}/projecten`}
                                className="inline-flex items-center justify-center px-10 py-5 rounded-xl border-2 border-white text-white hover:bg-white hover:text-brand-dark transition-all duration-500 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm"
                            >
                                {ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};