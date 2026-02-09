"use client";

import { ShieldCheck, Clock, Wind, ArrowRight } from "lucide-react";
import { siteContent } from "@/content/site";
import { motion } from "framer-motion";

const icons = [ShieldCheck, Clock, Wind];

export const Features = () => {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-24 md:flex justify-between items-end border-b border-brand-dark/10 pb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-dark max-w-md leading-tight">
                Waarom kiezen voor <span className="italic text-brand-gold">kalei?</span>
            </h2>
            <p className="text-brand-dark/50 mt-6 md:mt-0 max-w-sm text-sm leading-relaxed">
                Een eeuwenoude techniek met moderne voordelen. De perfecte balans tussen esthetiek en functionaliteit.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
          {siteContent.benefits.map((benefit, idx) => {
            const Icon = icons[idx];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-default"
              >
                <div className="w-12 h-12 border border-brand-dark/10 rounded-full flex items-center justify-center mb-8 group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-all duration-500">
                  <Icon className="text-brand-dark w-5 h-5 group-hover:text-brand-gold transition-colors" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-serif text-2xl text-brand-dark mb-4 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                    {benefit.title}
                </h3>
                
                <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">
                    {benefit.desc}
                </p>

                <div className="w-8 h-[1px] bg-brand-dark/20 group-hover:w-full group-hover:bg-brand-gold transition-all duration-700"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};