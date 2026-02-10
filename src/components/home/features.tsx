"use client";

import { ShieldCheck, Clock, Wind } from "lucide-react";
import { siteContent } from "@/content/site";
import { motion } from "framer-motion";

const icons = [ShieldCheck, Clock, Wind];

export const Features = () => {
  return (
    <section className="py-32 bg-brand-stone relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24 md:flex justify-between items-end border-b border-brand-dark/10 pb-12">
            <h2 className="font-serif text-5xl md:text-7xl text-brand-dark max-w-xl leading-[0.9]">
                De kunst van <span className="italic text-brand-bronze">kalei.</span>
            </h2>
            <p className="text-brand-dark/60 mt-8 md:mt-0 max-w-sm text-sm leading-relaxed text-balance">
                Een eeuwenoude techniek met moderne voordelen. De perfecte balans tussen esthetiek en functionaliteit.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
          {siteContent.benefits.map((benefit, idx) => {
            const Icon = icons[idx];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-default"
              >
                <div className="w-16 h-16 border border-brand-dark/10 rounded-none flex items-center justify-center mb-8 group-hover:border-brand-bronze group-hover:bg-brand-bronze/5 transition-all duration-700">
                  <Icon className="text-brand-dark w-6 h-6 group-hover:text-brand-bronze transition-colors duration-500" strokeWidth={1} />
                </div>
                
                <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-xs text-brand-bronze">0{idx + 1}</span>
                    <h3 className="font-serif text-3xl text-brand-dark group-hover:translate-x-2 transition-transform duration-700 ease-out">
                        {benefit.title}
                    </h3>
                </div>
                
                <p className="text-brand-dark/60 text-sm leading-relaxed mb-8 ml-8 border-l border-brand-dark/10 pl-6 group-hover:border-brand-bronze transition-colors duration-500">
                    {benefit.desc}
                </p>

                <div className="w-8 h-[1px] bg-brand-dark/20 group-hover:w-full group-hover:bg-brand-bronze transition-all duration-1000 ease-out delay-100"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};