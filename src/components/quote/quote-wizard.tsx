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
import { Check, ChevronLeft, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className="text-center p-12 bg-white border border-brand-bronze/20 shadow-2xl relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[500px]"
      >
        <div className="w-24 h-24 bg-brand-stone/50 rounded-full flex items-center justify-center mb-8 border border-brand-bronze/30">
          <Check className="text-brand-bronze w-10 h-10" />
        </div>
        <h3 className="font-serif text-4xl font-medium mb-4 text-brand-dark">Bedankt.</h3>
        <p className="text-brand-dark/60 mb-12 max-w-sm mx-auto font-light leading-relaxed">We hebben uw gegevens goed ontvangen. We nemen binnen de 48u contact op voor een plaatsbezoek.</p>
        <Button 
            className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze hover:text-white transition-colors" 
            onClick={() => window.location.reload()}
        >
            Nieuwe aanvraag
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-8 md:p-12 lg:p-16 shadow-2xl border border-brand-dark/5 relative flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-stone">
        <motion.div 
            className="h-full bg-brand-bronze"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-end mb-16 border-b border-brand-dark/5 pb-4">
        <span className="font-serif text-3xl italic text-brand-dark">{steps[step-1].title}</span>
        <span className="text-xs uppercase tracking-widest text-brand-dark/30 font-mono">0{step} / 03</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
            
          {step === 1 && (
            <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
              <h3 className="text-brand-dark/50 font-light text-lg mb-8">Wat voor type project betreft het?</h3>
              <div className="grid grid-cols-2 gap-6">
                {['gevel', 'binnen', 'totaal', 'renovatie'].map((type) => (
                    <label key={type} className={cn(
                        "cursor-pointer border p-8 hover:border-brand-bronze transition-all group relative overflow-hidden aspect-square flex flex-col justify-between",
                        watch('projectType') === type ? 'border-brand-bronze bg-brand-stone/30' : 'border-brand-dark/10 bg-transparent'
                    )}>
                        <input 
                            type="radio" 
                            value={type} 
                            {...register('projectType')} 
                            className="sr-only"
                        />
                        <div className="w-2 h-2 rounded-full bg-brand-bronze opacity-0 group-hover:opacity-100 transition-opacity self-end mb-auto" />
                        
                        <div>
                            <div className="relative z-10 capitalize font-serif text-2xl mb-2 group-hover:translate-x-1 transition-transform">{type}</div>
                            <div className="relative z-10 text-[10px] text-brand-dark/40 uppercase tracking-wider group-hover:text-brand-bronze transition-colors">Selecteer</div>
                        </div>
                    </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
            >
              <div className="space-y-8">
                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-3 block group-focus-within:text-brand-bronze transition-colors">Oppervlakte (m²)</Label>
                    <Input 
                        {...register('surfaceArea')} 
                        placeholder="150" 
                        type="number" 
                        className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-6 text-4xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent placeholder:text-brand-dark/10 transition-colors" 
                    />
                    {errors.surfaceArea && <span className="text-red-500 text-xs mt-2 block opacity-70">{errors.surfaceArea.message}</span>}
                </div>

                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-4 block group-focus-within:text-brand-bronze transition-colors">Huidige ondergrond</Label>
                    <RadioGroup defaultValue="baksteen" onValueChange={(val) => setValue('surfaceType', val as any)} className="flex gap-8 border-b border-brand-dark/10 pb-6">
                        {['baksteen', 'crepi', 'onbekend'].map((val) => (
                            <div key={val} className="flex items-center space-x-3 group/radio cursor-pointer">
                                <RadioGroupItem value={val} id={val} className="text-brand-bronze border-brand-dark/20 w-4 h-4" />
                                <Label htmlFor={val} className="capitalize text-lg font-light text-brand-dark/60 group-hover/radio:text-brand-dark transition-colors cursor-pointer">{val}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-3 block group-focus-within:text-brand-bronze transition-colors">Timing</Label>
                    <select {...register('timing')} className="w-full border-b border-brand-dark/10 rounded-none py-4 bg-transparent text-2xl font-serif focus:outline-none focus:border-brand-bronze appearance-none cursor-pointer text-brand-dark/80 transition-colors">
                        <option value="asap">Zo snel mogelijk</option>
                        <option value="1-3_maanden">Binnen 1-3 maanden</option>
                        <option value="later">Later dit jaar</option>
                    </select>
                </div>
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
              <h3 className="text-brand-dark/50 font-light text-lg mb-8">Hoe kunnen we u bereiken?</h3>
              
              <div className="grid gap-12">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block group-focus-within:text-brand-bronze transition-colors">Naam</Label>
                        <Input {...register('name')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent transition-colors placeholder:text-brand-dark/10" placeholder="Uw naam" />
                        {errors.name && <span className="text-red-500 text-xs mt-1 block opacity-70">{errors.name.message}</span>}
                    </div>
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block group-focus-within:text-brand-bronze transition-colors">Telefoon</Label>
                        <Input {...register('phone')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent transition-colors placeholder:text-brand-dark/10" placeholder="+32 ..." />
                        {errors.phone && <span className="text-red-500 text-xs mt-1 block opacity-70">{errors.phone.message}</span>}
                    </div>
                </div>
                
                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block group-focus-within:text-brand-bronze transition-colors">Email</Label>
                    <Input {...register('email')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent transition-colors placeholder:text-brand-dark/10" placeholder="naam@bedrijf.be" />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block opacity-70">{errors.email.message}</span>}
                </div>

                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block group-focus-within:text-brand-bronze transition-colors">Postcode werfadres</Label>
                    <Input {...register('postalCode')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent transition-colors placeholder:text-brand-dark/10" placeholder="2000" />
                    {errors.postalCode && <span className="text-red-500 text-xs mt-1 block opacity-70">{errors.postalCode.message}</span>}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        
        <div className="flex justify-between items-center pt-16 mt-auto">
            {step > 1 ? (
                 <Button type="button" variant="ghost" onClick={prevStep} className="hover:bg-transparent text-brand-dark/40 hover:text-brand-dark px-0 uppercase text-[10px] tracking-widest transition-colors">
                 <ChevronLeft className="mr-2 w-3 h-3" /> Vorige
               </Button>
            ) : <div/>}
           
           {step < 3 ? (
             <Button type="button" onClick={nextStep} className="bg-brand-dark text-white rounded-none px-10 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-bronze hover:text-white transition-all duration-500 group">
               Volgende <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </Button>
           ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-brand-bronze text-white rounded-none px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-500 shadow-xl group">
            {isSubmitting ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Verwerken...</> : <>Offerte aanvragen <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" /></>}
          </Button>
           )}
        </div>
      </form>
    </div>
  );
};