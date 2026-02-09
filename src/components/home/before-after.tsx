"use client";
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";

export const BeforeAfter = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      // Simplistic implementation for MVP
      // In a real scenario, calculate based on rect
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Het verschil in detail</h2>
        <p className="text-brand-dark/60 mb-12">Sleep om de transformatie te zien</p>
        
        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden shadow-xl border border-brand-dark/5 group cursor-ew-resize">
            {/* After Image (Full width background) */}
            <div className="absolute inset-0 bg-brand-gold/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-brand-dark/20">NA (Prachtig wit)</span>
            </div>

            {/* Before Image (Clipped) */}
            <div 
                className="absolute inset-0 bg-gray-300 flex items-center justify-center border-r-2 border-white"
                style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
            >
                <div className="w-full h-full flex items-center justify-center" style={{ width: '100vw' }}> {/* Hack to keep content centered relative to parent if it was an image */}
                    <span className="text-4xl font-bold text-gray-500">VOOR (Oud)</span>
                </div>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-10 shadow-lg"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center shadow-md">
                    <MoveHorizontal className="w-4 h-4 text-white" />
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