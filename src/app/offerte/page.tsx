"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuoteWizard, FormValues } from "@/components/quote/quote-wizard";
import { Check, Home, Building, Wrench, Paintbrush, Ruler, Layers, Clock, User, Mail, Phone, MapPin } from "lucide-react";
import { useState, useCallback } from "react"; // Import useCallback
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const projectTypeIcons = {
  gevel: Home,
  binnen: Building,
  totaal: Paintbrush,
  renovatie: Wrench,
};

const statusMessages = {
  1: {
    title: "Start uw project.",
    subtitle: "Vul het formulier in voor een vrijblijvende offerte. Wij analyseren uw aanvraag en nemen binnen 48u contact op.",
    image: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/offerte/offerte-step1.jpeg",
    points: [
      "Meer dan 25 jaar ervaring in gevelrenovatie",
      "Gebruik van hoogwaardige, natuurlijke materialen",
      "Persoonlijke begeleiding van A tot Z",
      "Eén aanspreekpunt tijdens de werken"
    ],
  },
  2: {
    title: "Project details.",
    subtitle: "Vertel ons meer over de omvang en aard van uw project. Dit helpt ons een nauwkeurige inschatting te maken.",
    image: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/offerte/offerte-step2.jpeg",
    points: [
      "Nauwkeurige opmeting ter plaatse",
      "Advies op maat voor techniek en kleur",
      "Transparante prijsopgave",
      "Geen verrassingen achteraf"
    ],
  },
  3: {
    title: "Laatste stap: uw contactgegevens.",
    subtitle: "Bijna klaar! Vul uw contactgegevens in zodat we uw persoonlijke offerte kunnen opstellen en u kunnen bereiken.",
    image: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/offerte/offerte-step3.jpeg",
    points: [
      "Snelle reactie binnen 48 uur",
      "Persoonlijk contact voor plaatsbezoek",
      "Vrijblijvende offerte op maat",
      "Uw gegevens zijn veilig bij ons"
    ],
  },
};

export default function OffertePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormValues | null>(null);

  // Memoize handleFormChange using useCallback
  const handleFormChange = useCallback((data: FormValues, step: number) => {
    setFormData(data);
    setCurrentStep(step);
  }, []); // Dependencies are empty because setFormData and setCurrentStep are stable

  const currentContent = statusMessages[currentStep as keyof typeof statusMessages];
  const ProjectIcon = formData?.projectType ? projectTypeIcons[formData.projectType as keyof typeof projectTypeIcons] : null;

  const formatTiming = (timing: string) => {
    switch (timing) {
      case 'asap': return 'Zo snel mogelijk';
      case '1-3_maanden': return 'Binnen 1-3 maanden';
      case 'later': return 'Later dit jaar';
      default: return timing;
    }
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-dark font-sans selection:bg-brand-bronze/30 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row pt-24 lg:pt-0">
        
        {/* Left Side: Editorial & Dynamic Summary */}
        <div className="lg:w-1/2 bg-brand-stone flex flex-col justify-center px-6 md:px-16 py-12 lg:min-h-screen border-r border-brand-dark/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            
            <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-lg mx-auto lg:sticky lg:top-32 relative z-10"
            >
                <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Offerte</span>
                <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-[0.9] text-brand-dark">
                    {currentContent.title.split('<br/>').map((line, index) => (
                        <span key={index} className="block">
                            {line.includes('<span') ? (
                                <span dangerouslySetInnerHTML={{ __html: line }} />
                            ) : (
                                line
                            )}
                        </span>
                    ))}
                </h1>
                <p className="text-xl text-brand-dark/60 mb-12 font-light leading-relaxed">
                    {currentContent.subtitle}
                </p>

                {/* Dynamic Summary based on form data */}
                {formData && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`summary-${currentStep}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 pt-12 border-t border-brand-dark/10"
                        >
                            <h3 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-6">Uw Keuzes</h3>
                            
                            {currentStep >= 1 && formData.projectType && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        {ProjectIcon && <ProjectIcon className="w-3 h-3 text-brand-bronze" strokeWidth={2} />}
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed capitalize">Projecttype: <span className="font-medium">{formData.projectType}</span></span>
                                </div>
                            )}
                            {currentStep >= 2 && formData.surfaceArea && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <Ruler className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Oppervlakte: <span className="font-medium">{formData.surfaceArea} m²</span></span>
                                </div>
                            )}
                            {currentStep >= 2 && formData.surfaceType && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <Layers className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed capitalize">Ondergrond: <span className="font-medium">{formData.surfaceType}</span></span>
                                </div>
                            )}
                            {currentStep >= 2 && formData.timing && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <Clock className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Timing: <span className="font-medium">{formatTiming(formData.timing)}</span></span>
                                </div>
                            )}
                            {currentStep >= 3 && formData.name && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <User className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Naam: <span className="font-medium">{formData.name}</span></span>
                                </div>
                            )}
                            {currentStep >= 3 && formData.email && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <Mail className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Email: <span className="font-medium">{formData.email}</span></span>
                                </div>
                            )}
                            {currentStep >= 3 && formData.phone && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <Phone className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Telefoon: <span className="font-medium">{formData.phone}</span></span>
                                </div>
                            )}
                            {currentStep >= 3 && formData.postalCode && (
                                <div className="flex items-start gap-4 group">
                                    <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                        <MapPin className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                    </div>
                                    <span className="text-brand-dark/80 font-light leading-relaxed">Postcode: <span className="font-medium">{formData.postalCode}</span></span>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Static trust points or dynamic based on step */}
                <div className={cn("space-y-6 pt-12 border-t border-brand-dark/10", formData ? "mt-12" : "mt-0")}>
                    <h3 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-6">Waarom kiezen voor Van Roey?</h3>
                    
                    {currentContent.points.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                            <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-dark/20 flex items-center justify-center group-hover:border-brand-bronze group-hover:bg-brand-bronze/10 transition-colors">
                                <Check className="w-3 h-3 text-brand-bronze opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="text-brand-dark/80 font-light leading-relaxed group-hover:text-brand-dark transition-colors">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-brand-dark/10 flex flex-col sm:flex-row gap-8 opacity-60">
                    <div>
                        <span className="uppercase text-[10px] tracking-widest block mb-1">Email</span>
                        <a href="mailto:info@vanroey.be" className="font-serif text-lg hover:text-brand-bronze transition-colors">info@vanroey.be</a>
                    </div>
                    <div>
                        <span className="uppercase text-[10px] tracking-widest block mb-1">Tel</span>
                        <a href="tel:+32470123456" className="font-serif text-lg hover:text-brand-bronze transition-colors">+32 470 12 34 56</a>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right Side: The Form */}
        <div className="lg:w-1/2 bg-brand-white flex flex-col justify-center px-4 md:px-12 py-12 lg:py-32">
            <div className="max-w-2xl mx-auto w-full">
                <QuoteWizard onFormChange={handleFormChange} />
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}