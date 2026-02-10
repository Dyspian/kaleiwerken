"use client";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const BeforeAfter = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

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
            <div className="absolute inset-0 bg-brand-stone flex items-center justify-center overflow-hidden">
                {/* CSS Pattern for "After" - Clean, textured look */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8C7B6C_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-white/80 to-transparent"></div>
                
                <span className="text-6xl md:text-9xl font-serif font-bold text-brand-dark/10 relative z-10">NA</span>
                <p className="absolute bottom-8 right-8 text-brand-dark/20 font-mono text-xs uppercase tracking-widest">Afgewerkt Resultaat</p>
            </div>

            {/* Before Image (Clipped) */}
            <div 
                className="absolute inset-0 bg-brand-dark flex items-center justify-center border-r border-white/20 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                {/* CSS Pattern for "Before" - Darker, rougher look */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] [background-size:20px_20px] [background-position:0_0,10px_10px]"></div>
                
                {/* We need a fixed width container inside the clipped container to keep content centered relative to the full view, 
                    but simpler here is just centering text in the clipped view or using a fixed width child */}
                <div className="absolute inset-0 w-full h-full" style={{ width: '100vw' }}> 
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl md:text-9xl font-serif font-bold text-brand-white/10">VOOR</span>
                    </div>
                </div>
                 <p className="absolute bottom-8 left-8 text-white/20 font-mono text-xs uppercase tracking-widest">Oorspronkelijke Staat</p>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-[1px] bg-white cursor-ew-resize flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,0,0,0.2)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-brand-dark/5 transition-transform duration-200 hover:scale-110">
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
        </div>
      </div>
    </section>
  );
};