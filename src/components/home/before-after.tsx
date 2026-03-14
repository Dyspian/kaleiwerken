"use client";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const BeforeAfter = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const beforeImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/voor-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci92b29yLWZvdG8uanBlZyIsImlhdCI6MTc3MzUwNzkyMSwiZXhwIjoyMDg4ODY3OTIxfQ.szVq8e3NYlBPaoh4fJJKQwycCtYZeS1tVqvm0J9yzUg";
  const afterImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/na-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci9uYS1mb3RvLmpwZWciLCJpYXQiOjE3NzM1MDc5NDgsImV4cCI6MjA4ODg2Nzk0OH0.ggn0wqDGB9VEToA30UbLA4nOK8o6AcN6HmaMdOWDBF4";

  return (
    <section className="py-32 bg-brand-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
        >
            <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-4 block">Transformatie</span>
            <h2 className="font-serif text-4xl md:text-6xl text-brand-dark mb-4">Het verschil in detail</h2>
            <p className="text-brand-dark/40 italic font-serif">Sleep om het resultaat te onthullen</p>
        </motion.div>
        
        <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] md:aspect-[21/9] bg-brand-stone overflow-hidden shadow-2xl border border-brand-dark/5 group cursor-ew-resize select-none">
            
            {/* After Image (Full width background) */}
            <div className="absolute inset-0 bg-brand-stone overflow-hidden">
                <img 
                  src={afterImage} 
                  alt="Na kaleiwerken" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <p className="absolute bottom-8 right-8 text-white font-mono text-xs uppercase tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1">Na</p>
            </div>

            {/* Before Image (Clipped) */}
            <div 
                className="absolute inset-0 overflow-hidden border-r border-white/20 z-10"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="absolute inset-0 w-full h-full" style={{ width: '100vw', maxWidth: '100%' }}> 
                    <img 
                      src={beforeImage} 
                      alt="Voor kaleiwerken" 
                      className="w-full h-full object-cover"
                      style={{ width: 'calc(100vw - 48px)', maxWidth: '1152px' }} // Matching container max-width
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                 <p className="absolute bottom-8 left-8 text-white font-mono text-xs uppercase tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1">Voor</p>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border border-brand-dark/5 transition-transform duration-200 hover:scale-110">
                    <MoveHorizontal className="w-4 h-4 text-brand-dark" />
                </div>
            </div>
            
            {/* Input range for interaction */}
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