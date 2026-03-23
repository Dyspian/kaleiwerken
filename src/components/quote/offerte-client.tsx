"use client";

import { QuoteWizard, FormValues } from "@/components/quote/quote-wizard";
import { Home, Building, Wrench, Paintbrush, Layers, Clock, User, Mail, Phone, MapPin, Check, MessageSquare } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const projectTypeIcons = {
  gevel: Home,
  binnen: Building,
  totaal: Paintbrush,
  renovatie: Wrench,
};

interface OfferteClientProps {
  dict: any;
}

export const OfferteClient = ({ dict }: OfferteClientProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const handleFormChange = useCallback((data: FormValues, step: number) => {
    setFormData(data);
    setCurrentStep(step);
  }, []);

  const statusMessages = {
    1: {
      title: "Start uw project.",
      subtitle: "Vul het formulier in voor een vrijblijvende offerte. Wij analyseren uw aanvraag en nemen binnen 48u contact op.",
      points: [
        "Meer dan 10 jaar ervaring in kaleiwerken",
        "Gebruik van hoogwaardige, natuurlijke materialen",
        "Persoonlijke begeleiding van A tot Z",
        "Eén aanspreekpunt tijdens de werken"
      ],
    },
    2: {
      title: "Project details.",
      subtitle: "Vertel ons meer over de omvang en aard van uw project. Dit helpt ons een nauwkeurige inschatting te maken.",
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
      points: [
        "Snelle reactie binnen 48 uur",
        "Persoonlijk contact voor plaatsbezoek",
        "Vrijblijvende offerte op maat",
        "Uw gegevens zijn veilig bij ons"
      ],
    },
  };

  const formatTiming = (timing: string) => {
    switch (timing) {
      case 'asap': return 'Zo snel mogelijk';
      case '1-3_maanden': return 'Binnen 1-3 maanden';
      case 'later': return 'Later dit jaar';
      default: return timing;
    }
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row pt-24 lg:pt-0">
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
                  {statusMessages[currentStep as keyof typeof statusMessages].title}
              </h1>
              <p className="text-xl text-brand-dark/60 mb-12 font-light leading-relaxed">
                  {statusMessages[currentStep as keyof typeof statusMessages].subtitle}
              </p>

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
                                      {(() => {
                                        const Icon = projectTypeIcons[formData.projectType as keyof typeof projectTypeIcons];
                                        return Icon ? <Icon className="w-3 h-3 text-brand-bronze" strokeWidth={2} /> : null;
                                      })()}
                                  </div>
                                  <span className="text-brand-dark/80 font-light leading-relaxed capitalize">Projecttype: <span className="font-medium">{formData.projectType}</span></span>
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
                          {currentStep >= 2 && formData.comment && (
                              <div className="flex items-start gap-4 group">
                                  <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center bg-brand-bronze/10">
                                      <MessageSquare className="w-3 h-3 text-brand-bronze" strokeWidth={2} />
                                  </div>
                                  <span className="text-brand-dark/80 font-light leading-relaxed">Opmerkingen: <span className="font-medium">{formData.comment}</span></span>
                              </div>
                          )}
                      </motion.div>
                  </AnimatePresence>
              )}

              <div className={cn("space-y-6 pt-12 border-t border-brand-dark/10", formData ? "mt-12" : "mt-0")}>
                  <h3 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-6">Waarom kiezen voor Van Roey?</h3>
                  {statusMessages[currentStep as keyof typeof statusMessages].points.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 group">
                          <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-dark/20 flex items-center justify-center group-hover:border-brand-bronze group-hover:bg-brand-bronze/10 transition-colors">
                              <Check className="w-3 h-3 text-brand-bronze opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                          </div>
                          <span className="text-brand-dark/80 font-light leading-relaxed group-hover:text-brand-dark transition-colors">{item}</span>
                      </div>
                  ))}
              </div>
          </motion.div>
      </div>

      <div className="lg:w-1/2 bg-brand-white flex flex-col justify-center px-4 md:px-12 py-12 lg:py-32">
          <div className="max-w-2xl mx-auto w-full">
              <QuoteWizard onFormChange={handleFormChange} dict={dict.quote} />
          </div>
      </div>
    </main>
  );
};