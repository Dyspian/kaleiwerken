"use client";

import { motion } from "framer-motion";
import { Shield, Droplets, Hammer, Layers } from "lucide-react";

const layers = [
  {
    title: "01. De Basis",
    subtitle: "Voorbereiding & Reiniging",
    desc: "Elk project begint met een grondige reiniging van de gevel. We verwijderen vuil, mossen en oude verflagen om een perfecte hechting te garanderen.",
    icon: Hammer,
  },
  {
    title: "02. De Herstelling",
    subtitle: "Stabilisatie van het voegwerk",
    desc: "Loszittende voegen worden uitgehakt en hersteld. Dit zorgt voor een egale ondergrond en voorkomt structurele problemen in de toekomst.",
    icon: Layers,
  },
  {
    title: "03. De Kaleilaag",
    subtitle: "Artisanaal vakmanschap",
    desc: "De kalei wordt handmatig aangebracht met een blokborstel. Hierdoor ontstaat de typische, zachte textuur die de contouren van de steen volgt.",
    icon: Droplets,
  },
  {
    title: "04. De Hydrofuge",
    subtitle: "Onzichtbare bescherming",
    desc: "Een optionele maar aangeraden afwerking. Deze transparante laag stoot water en vuil af, terwijl de muur toch volledig blijft ademen.",
    icon: Shield,
  }
];

export const Anatomy = () => {
  return (
    <section className="py-32 bg-brand-dark text-brand-stone overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-24">
            <span className="uppercase text-[10px] tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Techniek</span>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8">
                De anatomie van <br/><span className="italic text-brand-bronze">een gevel.</span>
            </h2>
            <p className="text-brand-stone/50 font-light leading-relaxed text-lg">
                Kalei is meer dan een esthetische keuze. Het is een technisch systeem dat uw woning beschermt en laat ademen. Ontdek de lagen van ons vakmanschap.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left: Visual Representation */}
            <div className="lg:col-span-6 sticky top-32">
                <div className="relative aspect-[4/5] bg-white/5 border border-white/10 overflow-hidden group">
                    {/* Layered Wall Visualizer */}
                    <div className="absolute inset-0 flex flex-col">
                        {layers.map((_, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0.2 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ margin: "-20% 0px -20% 0px" }}
                                className="flex-1 border-b border-white/5 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-brand-bronze/10 mix-blend-overlay" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="font-serif text-[15vw] italic select-none">Layer 0{i+1}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Decorative Grain Overlay */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                </div>
            </div>

            {/* Right: Descriptions */}
            <div className="lg:col-span-6 space-y-24 py-12">
                {layers.map((layer, i) => {
                    const Icon = layer.icon;
                    return (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="group"
                        >
                            <div className="flex items-start gap-8">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-brand-bronze group-hover:bg-brand-bronze/10 transition-all duration-500">
                                    <Icon className="w-5 h-5 text-brand-bronze" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-4">
                                    <span className="font-mono text-xs text-brand-bronze tracking-widest">{layer.title}</span>
                                    <h3 className="font-serif text-3xl text-brand-stone group-hover:translate-x-2 transition-transform duration-500">{layer.subtitle}</h3>
                                    <p className="text-brand-stone/40 font-light leading-relaxed max-w-md">
                                        {layer.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
      </div>
    </section>
  );
};