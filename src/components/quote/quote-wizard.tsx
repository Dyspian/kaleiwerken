"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema definition (same as before)
const formSchema = z.object({
  projectType: z.enum(["gevel", "binnen", "totaal", "renovatie"]),
  surfaceArea: z.string().min(1, "Oppervlakte is verplicht"),
  surfaceType: z.enum(["baksteen", "crepi", "onbekend"]),
  timing: z.enum(["asap", "1-3_maanden", "later"]),
  name: z.string().min(2, "Naam is te kort"),
  email: z.string().email("Ongeldig emailadres"),
  phone: z.string().min(9, "Ongeldig telefoonnummer"),
  postalCode: z.string().min(4, "Ongeldige postcode"),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Project" },
  { id: 2, title: "Details" },
  { id: 3, title: "Contact" },
];

export const QuoteWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "gevel",
      surfaceType: "baksteen",
      timing: "1-3_maanden",
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Submitting:", data);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Aanvraag succesvol verstuurd");
    }, 1500);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white border border-brand-gold/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-gold/20">
          <Check className="text-brand-gold w-8 h-8" />
        </div>
        <h3 className="font-serif text-3xl font-medium mb-4 text-brand-dark">Bedankt.</h3>
        <p className="text-brand-dark/60 mb-8 max-w-sm mx-auto font-light">We hebben uw gegevens goed ontvangen. We nemen binnen de 48u contact op voor een plaatsbezoek.</p>
        <Button 
            className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors" 
            onClick={() => window.location.reload()}
        >
            Nieuwe aanvraag
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-white p-8 md:p-12 shadow-2xl border border-brand-dark/5 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-light">
        <motion.div 
            className="h-full bg-brand-gold"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-center mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-dark/40">Stap {step} / 3</span>
        <span className="font-serif text-xl italic text-brand-dark">{steps[step-1].title}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
            
          {step === 1 && (
            <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-brand-dark">Wat is de omvang?</h3>
              <div className="grid grid-cols-2 gap-4">
                {['gevel', 'binnen', 'totaal', 'renovatie'].map((type) => (
                    <label key={type} className={cn(
                        "cursor-pointer border border-brand-dark/10 p-6 hover:border-brand-gold transition-all group relative overflow-hidden",
                        watch('projectType') === type ? 'border-brand-gold bg-brand-light' : 'bg-white'
                    )}>
                        <input 
                            type="radio" 
                            value={type} 
                            {...register('projectType')} 
                            className="sr-only"
                        />
                        <div className="relative z-10 capitalize font-serif text-xl mb-2 group-hover:translate-x-1 transition-transform">{type}</div>
                        <div className="relative z-10 text-xs text-brand-dark/40 uppercase tracking-wider group-hover:text-brand-gold transition-colors">Selecteer</div>
                    </label>
                ))}
              </div>
              <div className="flex justify-end pt-8 border-t border-brand-dark/5">
                <Button type="button" onClick={nextStep} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">
                  Volgende <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-brand-dark">Technische details</h3>
              
              <div className="space-y-6">
                <div className="border-b border-brand-dark/5 pb-6">
                    <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-3 block">Oppervlakte (m²)</Label>
                    <Input 
                        {...register('surfaceArea')} 
                        placeholder="bv. 150" 
                        type="number" 
                        className="border-0 border-b border-brand-dark/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-brand-gold bg-transparent placeholder:text-brand-dark/20" 
                    />
                    {errors.surfaceArea && <span className="text-red-500 text-xs mt-2 block">{errors.surfaceArea.message}</span>}
                </div>

                <div className="border-b border-brand-dark/5 pb-6">
                    <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-4 block">Huidige ondergrond</Label>
                    <RadioGroup defaultValue="baksteen" onValueChange={(val) => setValue('surfaceType', val as any)} className="flex flex-col gap-3">
                        {['baksteen', 'crepi', 'onbekend'].map((val) => (
                            <div key={val} className="flex items-center space-x-3">
                                <RadioGroupItem value={val} id={val} className="text-brand-gold border-brand-dark/20" />
                                <Label htmlFor={val} className="capitalize text-lg font-light cursor-pointer">{val}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div>
                    <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-3 block">Timing</Label>
                    <select {...register('timing')} className="w-full border-b border-brand-dark/20 rounded-none py-3 bg-transparent text-lg focus:outline-none focus:border-brand-gold appearance-none cursor-pointer">
                        <option value="asap">Zo snel mogelijk</option>
                        <option value="1-3_maanden">Binnen 1-3 maanden</option>
                        <option value="later">Later dit jaar</option>
                    </select>
                </div>
              </div>

              <div className="flex justify-between pt-8 border-t border-brand-dark/5">
                <Button type="button" variant="ghost" onClick={prevStep} className="hover:bg-transparent hover:text-brand-gold px-0">
                  <ChevronLeft className="mr-2 w-4 h-4" /> Vorige stap
                </Button>
                <Button type="button" onClick={nextStep} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">
                  Volgende <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-brand-dark">Uw contactgegevens</h3>
              
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                        <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-2 block group-focus-within:text-brand-gold transition-colors">Naam</Label>
                        <Input {...register('name')} className="border-0 border-b border-brand-dark/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-brand-gold bg-transparent transition-colors" placeholder="Uw volledige naam" />
                        {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                    </div>
                    <div className="group">
                        <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-2 block group-focus-within:text-brand-gold transition-colors">Telefoon</Label>
                        <Input {...register('phone')} className="border-0 border-b border-brand-dark/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-brand-gold bg-transparent transition-colors" placeholder="04..." />
                        {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                    </div>
                </div>
                
                <div className="group">
                    <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-2 block group-focus-within:text-brand-gold transition-colors">Email</Label>
                    <Input {...register('email')} className="border-0 border-b border-brand-dark/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-brand-gold bg-transparent transition-colors" placeholder="naam@email.be" />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                </div>

                <div className="group">
                    <Label className="uppercase text-xs tracking-widest text-brand-dark/50 mb-2 block group-focus-within:text-brand-gold transition-colors">Postcode werfadres</Label>
                    <Input {...register('postalCode')} className="border-0 border-b border-brand-dark/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-brand-gold bg-transparent transition-colors" placeholder="bv. 2000" />
                    {errors.postalCode && <span className="text-red-500 text-xs mt-1 block">{errors.postalCode.message}</span>}
                </div>
              </div>

              <div className="bg-brand-light/50 p-6 text-sm text-brand-dark/60 italic font-serif border-l-2 border-brand-gold">
                "Wij behandelen uw gegevens vertrouwelijk en gebruiken deze enkel voor uw offerte."
              </div>

              <div className="flex justify-between pt-8 border-t border-brand-dark/5">
                <Button type="button" variant="ghost" onClick={prevStep} className="hover:bg-transparent hover:text-brand-gold px-0">
                  <ChevronLeft className="mr-2 w-4 h-4" /> Vorige
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-brand-gold text-brand-dark rounded-none px-10 py-6 uppercase text-xs tracking-widest hover:bg-brand-dark hover:text-white transition-all shadow-lg hover:shadow-xl">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verwerken...</> : "Offerte aanvragen"}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>
    </div>
  );
};