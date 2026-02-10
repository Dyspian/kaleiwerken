"use client";

import { motion } from "framer-motion";

const steps = [
    { step: "01", title: "Opmeting", desc: "We komen ter plaatse voor een nauwkeurige analyse van de gevel." },
    { step: "02", title: "Advies", desc: "Samen kiezen we de juiste techniek en kleur voor uw woning." },
    { step: "03", title: "Uitvoering", desc: "Onze vakmannen brengen de kalei aan met oog voor elk detail." },
    { step: "04", title: "Oplevering", desc: "Een grondige check-up garandeert een perfect resultaat." }
];

export const Process = () => {
  return (
    <section className="py-32 bg-brand-dark text-brand-stone relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
        
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Werkwijze</span>
                    <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">
                        Transparant <br/>van begin <br/><span className="italic text-brand-bronze">tot eind.</span>
                    </h2>
                    <p className="text-brand-stone/60 max-w-sm font-light leading-relaxed">
                        Wij geloven in duidelijke communicatie en een strakke planning. Zo weet u altijd waar u aan toe bent.
                    </p>
                </div>

                <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12 gap-y-16">
                    {steps.map((s, i) => (
                        <motion.div 
                            key={s.step} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="relative group"
                        >
                            <span className="absolute -top-12 -left-6 text-[120px] font-serif font-bold text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.05] transition-colors duration-700">
                                {s.step}
                            </span>
                            <div className="relative pt-6 border-t border-white/10 group-hover:border-brand-bronze transition-colors duration-700">
                                <h3 className="font-serif text-2xl mb-4 group-hover:translate-x-2 transition-transform duration-500">{s.title}</h3>
                                <p className="text-brand-stone/50 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};