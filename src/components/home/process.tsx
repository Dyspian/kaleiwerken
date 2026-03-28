"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const Process = ({ dict }: { dict: any }) => {
  const title = dict?.title || "Transparant van begin tot eind.";
  const subtitle = dict?.subtitle || "Werkwijze";
  const desc = dict?.desc || "Wij geloven in duidelijke communicatie en een strakke planning. Zo weet u altijd waar u aan toe bent.";
  
  const steps = dict?.steps || [
    { title: "Opmeting", desc: "We komen ter plaatse voor een nauwkeurige analyse van de gevel." },
    { title: "Advies", desc: "Samen kiezen we de juiste techniek en kleur voor uw woning." },
    { title: "Uitvoering", desc: "Onze vakmannen brengen de kalei aan met oog voor elk detail." },
    { title: "Oplevering", desc: "Een grondige check-up garandeert een perfect resultaat." }
  ];

  // Use CMS process image if available
  const processImage = dict?.imageUrl;

  return (
    <section className="py-32 bg-brand-dark text-brand-stone relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
        
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-24 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-32">
                    <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">
                        {subtitle}
                    </span>
                    <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
                        {title}
                    </h2>
                    <p className="text-brand-stone/60 max-w-sm font-light leading-relaxed mb-12">
                        {desc}
                    </p>

                    {processImage && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] w-full bg-white/5 overflow-hidden hidden lg:block"
                        >
                            <Image 
                                src={processImage} 
                                alt="Werkwijze" 
                                fill 
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                unoptimized
                            />
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
                    {steps.map((s: any, i: number) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="relative group"
                        >
                            <span className="absolute -top-12 -left-6 text-[120px] font-serif font-bold text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.05] transition-colors duration-700">
                                0{i + 1}
                            </span>
                            <div className="relative pt-6 border-t border-white/10 group-hover:border-brand-bronze transition-colors duration-700">
                                <h3 className="font-serif text-2xl mb-4 group-hover:translate-x-2 transition-transform duration-500">{s.title}</h3>
                                <p className="text-brand-stone/50 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}

                    {processImage && (
                        <div className="col-span-full lg:hidden mt-8">
                            <div className="relative aspect-video w-full bg-white/5 overflow-hidden">
                                <Image 
                                    src={processImage} 
                                    alt="Werkwijze" 
                                    fill 
                                    className="object-cover grayscale"
                                    unoptimized
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
};