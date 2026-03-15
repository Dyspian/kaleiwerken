"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";

const pigments = [
  {
    id: "zand",
    name: "Warm Zand",
    hex: "#D4C5B0",
    description: "Een zachte, aardse tint die een mediterrane warmte brengt naar elke gevel. Ideaal voor woningen met veel direct zonlicht.",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "klei",
    name: "Natuurlijke Klei",
    hex: "#B8A89A",
    description: "Onze meest authentieke kleur. Een diepe, minerale tint die de textuur van de kalei prachtig accentueert.",
    image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "steen",
    name: "Klassiek Steen",
    hex: "#E6E4DD",
    description: "Een tijdloze, lichte kleur die rust en elegantie uitstraalt. Perfect voor zowel moderne als klassieke architectuur.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "mist",
    name: "Ochtend Mist",
    hex: "#C2C5C0",
    description: "Een koelere, verfijnde grijstint die prachtig contrasteert met donker schrijnwerk en natuurlijke elementen.",
    image: "https://images.unsplash.com/photo-1590069230002-70cc69445991?q=80&w=2000&auto=format&fit=crop"
  }
];

export const ColorVisualizer = () => {
  const [activePigment, setActivePigment] = useState(pigments[1]);

  return (
    <section className="py-32 bg-brand-stone relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="uppercase text-[10px] tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Pigmenten</span>
              <h2 className="font-serif text-5xl md:text-7xl text-brand-dark leading-[0.9] mb-8">
                De kleuren van <br/><span className="italic text-brand-bronze">de natuur.</span>
              </h2>
              <p className="text-brand-dark/60 font-light leading-relaxed max-w-md">
                Wij mengen onze kalei zelf met minerale pigmenten. Dit zorgt voor een levendig kleurbeeld dat meebeweegt met de lichtinval van de dag.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-wrap gap-4">
                {pigments.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePigment(p)}
                    className={cn(
                      "group relative w-16 h-16 rounded-full transition-all duration-500 flex items-center justify-center",
                      activePigment.id === p.id ? "ring-2 ring-brand-bronze ring-offset-4 ring-offset-brand-stone" : "hover:scale-110"
                    )}
                  >
                    <div 
                      className="absolute inset-0 rounded-full shadow-inner" 
                      style={{ backgroundColor: p.hex }}
                    />
                    {activePigment.id === p.id && (
                      <motion.div 
                        layoutId="active-swatch"
                        className="absolute -inset-2 border border-brand-bronze/30 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePigment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="font-serif text-3xl text-brand-dark">{activePigment.name}</h3>
                  <p className="text-brand-dark/50 text-sm leading-relaxed italic font-serif">
                    "{activePigment.description}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-brand-dark/10">
                <div className="flex items-center gap-4 text-brand-dark/40">
                    <Paintbrush size={18} strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest">Handgemengd op de werf</span>
                </div>
            </div>
          </div>

          {/* Right: The Visualizer Canvas */}
          <div className="lg:col-span-7 relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] bg-brand-dark/5 overflow-hidden shadow-2xl border border-brand-dark/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePigment.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {/* Base Texture Image */}
                <img 
                  src={activePigment.image} 
                  alt={activePigment.name}
                  className="w-full h-full object-cover grayscale opacity-40"
                />
                
                {/* Color Overlay with Multiply Blend Mode for Realism */}
                <div 
                  className="absolute inset-0 mix-blend-multiply transition-colors duration-1000"
                  style={{ backgroundColor: activePigment.hex, opacity: 0.85 }}
                />
                
                {/* Subtle Grain/Noise Overlay for extra texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Label Overlay */}
            <div className="absolute bottom-8 left-8 z-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-white">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Geselecteerd: {activePigment.name}</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};