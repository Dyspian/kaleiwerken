"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export const HeroSimple = ({ dict }: { dict: any }) => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "nl";

    // Use default values if dict is empty or undefined
    const title1 = dict?.title1 || "Authentieke";
    const title2 = dict?.title2 || "Kaleiwerken.";
    const subtitle = dict?.subtitle || "Al 10 jaar specialist in authentieke kaleiwerken voor binnen en buiten. Actief in heel België en internationaal. Een vast team van twee vakmensen voor een persoonlijke aanpak.";
    const ctaPrimary = dict?.ctaPrimary || "Vraag offerte aan";
    const ctaSecondary = dict?.ctaSecondary || "Bekijk realisaties";
    const est = dict?.est || "Sinds 2015";

    return (
        <section className="relative h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700">
            <div className="container mx-auto px-6 md:px-12 text-center text-white">
                <div className="mb-6">
                    <span className="uppercase text-xs tracking-[0.25em] font-medium">{est}</span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tight mb-8">
                    <span className="block">{title1}</span>
                    <span className="block italic text-yellow-400">{title2}</span>
                </h1>
                
                <p className="text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto mb-12">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link 
                        href={`/${locale}/offerte`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        {ctaPrimary}
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                    
                    <Link 
                        href={`/${locale}/projecten`}
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
                    >
                        {ctaSecondary}
                    </Link>
                </div>
            </div>
        </section>
    );
};