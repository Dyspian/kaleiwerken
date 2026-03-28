"use client";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const BeforeAfter = ({ dict }: { dict?: any }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  // Use default values if dict is empty or undefined
  const tag = dict?.beforeAfter?.tag || "Transformatie";
  const title = dict?.beforeAfter?.title || "Het verschil in detail";
  const instruction = dict?.beforeAfter?.instruction || "Sleep om het resultaat te onthullen";

  // Use CMS images if available, otherwise fallback to defaults
  const beforeImage = dict?.beforeAfter?.beforeImage || "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/voor-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci92b29yLWZvdG8uanBlZyIsImlhdCI6MTc3MzUwNzkyMSwiZXhwIjoyMDg4ODY3OTIxfQ.szVq8e3NYlBPaoh4fJJKQwycCtYZeS1tVqvm0J9yzUg";
  const afterImage = dict?.beforeAfter?.afterImage || "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/na-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci9uYS1mb3RvLmpwZWciLCJpYXQiOjE3NzM1MDc5NDgsImV4cCI6MjA4ODg2Nzk0OH0.ggn0wqDGB9VEToA30UbLA4nOK8o6AcN6HmaMdOWDBF4";

  return (
    <section className="py-32 bg-brand-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
        >
            <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-4 block">
                {tag}
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-brand-dark mb-4">
                {title}
            </h2>
            <p className="text-brand-dark/40 italic font-serif">
                {instruction}
            </p>
        </motion.div>
        
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] bg-brand-stone overflow-hidden shadow-2xl border border-brand-dark/5 group cursor-ew-resize select-none">
            
            <div className="absolute inset-0">
                <img 
                  src={afterImage} 
                  alt="Na kaleiwerken" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5"></div>
                <p className="absolute bottom-6 right-6 text-white font-mono text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 z-20">Na</p>
            </div>

            <div 
                className="absolute inset-0 overflow-hidden z-10 border-r border-white/30"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="absolute inset-0 w-[calc(100vw-48px)] max-w-[1024px] h-full"> 
                    <img 
                      src={beforeImage} 
                      alt="Voor kaleiwerken" 
                      className="w-full h-full object-cover"
                      style={{ width: '1024px', maxWidth: 'none' }}
                    />
                    <div className="absolute inset-0 bg-black/15"></div>
                </div>
                <p className="absolute bottom-6 left-6 text-white font-mono text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 z-20">Voor</p>
            </div>

            <div 
                className="absolute top-0 bottom-0 w-[1px] bg-white/50 cursor-ew-resize flex items-center justify-center z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border border-brand-dark/5 transition-transform duration-200 group-hover:scale-110">
                    <MoveHorizontal className="w-3 h-3 text-brand-dark" />
                </div>
            </div>
            
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
        </div>
      </div>
    </section>
  );
};