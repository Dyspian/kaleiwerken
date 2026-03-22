"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Loader2, ArrowRight, Home, Building, Wrench, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  projectType: z.enum(["gevel", "binnen", "totaal", "renovatie"]),
  surfaceArea: z.string().min(1, "Oppervlakte is verplicht"),
  surfaceType: z.enum(["baksteen", "crepi", "onbekend"]),
  timing: z.enum(["asap", "1-3_maanden", "later"]),
  name: z.string().min(2, "Naam is te kort"),
  email: z.string().email("Ongeldig emailadres"),
  phone: z.string().min(9, "Ongeldig telefoonnummer"),
  postalCode: z.string().min(4, "Ongeldige postcode"),
  city: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const projectTypeIcons = {
  gevel: Home,
  binnen: Building,
  totaal: Paintbrush,
  renovatie: Wrench,
};

interface QuoteWizardProps {
  onFormChange?: (data: FormValues, currentStep: number) => void;
  dict: any;
}

export const QuoteWizard = ({ onFormChange, dict }: QuoteWizardProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const lastSyncedRef = useRef<string>("");

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "gevel",
      surfaceType: "baksteen",
      timing: "1-3_maanden",
    }
  });

  const formValues = watch();

  // Sync form state with parent, but only if something actually changed
  // to prevent infinite re-render loops
  useEffect(() => {
    if (onFormChange) {
      const currentDataStr = JSON.stringify({ data: formValues, step });
      if (currentDataStr !== lastSyncedRef.current) {
        lastSyncedRef.current = currentDataStr;
        onFormChange(formValues, step);
      }
    }
  }, [formValues, step, onFormChange]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from("leads")
      .insert({
        project_type: data.projectType,
        surface_area: data.surfaceArea,
        surface_type: data.surfaceType,
        timing: data.timing,
        name: data.name,
        email: data.email,
        phone: data.phone,
        postal_code: data.postalCode,
        city: data.city || "",
      });

    if (error) {
      toast.error("Er is iets misgegaan bij het verzenden.");
    } else {
      setIsSuccess(true);
      toast.success(dict.success);
    }
    setIsSubmitting(false);
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
        <h3 className="font-serif text-4xl font-medium mb-4 text-brand-dark">{dict.success}</h3>
        <p className="text-brand-dark/60 mb-12 max-w-sm mx-auto font-light leading-relaxed">{dict.successDesc}</p>
        <Button 
            className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze hover:text-white transition-colors" 
            onClick={() => window.location.reload()}
        >
            {dict.newRequest}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-8 md:p-12 lg:p-16 shadow-2xl border border-brand-dark/5 relative flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-stone">
        <motion.div 
            className="h-full bg-brand-bronze"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-end mb-16 border-b border-brand-dark/5 pb-4">
        <span className="font-serif text-3xl italic text-brand-dark">
            {step === 1 ? dict.step1 : step === 2 ? dict.step2 : dict.step3}
        </span>
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
              <h3 className="text-brand-dark/50 font-light text-lg mb-8">{dict.question1}</h3>
              <div className="grid grid-cols-2 gap-6">
                {['gevel', 'binnen', 'totaal', 'renovatie'].map((type) => {
                    const Icon = projectTypeIcons[type as keyof typeof projectTypeIcons];
                    return (
                        <label key={type} className={cn(
                            "cursor-pointer border p-8 hover:border-brand-bronze transition-all group relative overflow-hidden aspect-square flex flex-col justify-between",
                            watch('projectType') === type ? 'border-brand-bronze bg-brand-stone/30' : 'border-brand-dark/10 bg-transparent'
                        )}>
                            <input type="radio" value={type} {...register('projectType')} className="sr-only" />
                            <div className="w-10 h-10 rounded-full bg-brand-stone/50 flex items-center justify-center mb-auto border border-brand-dark/10 group-hover:border-brand-bronze group-hover:bg-brand-bronze/10 transition-all duration-500">
                                <Icon className="w-5 h-5 text-brand-dark/60 group-hover:text-brand-bronze transition-colors" />
                            </div>
                            <div>
                                <div className="relative z-10 capitalize font-serif text-2xl mb-2 group-hover:translate-x-1 transition-transform">
                                    {dict.types[type]}
                                </div>
                            </div>
                        </label>
                    );
                })}
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
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-3 block">{dict.surface}</Label>
                    <Input {...register('surfaceArea')} placeholder="150" type="number" className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-6 text-4xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                </div>

                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-4 block">{dict.surfaceType}</Label>
                    <RadioGroup defaultValue="baksteen" onValueChange={(val) => setValue('surfaceType', val as any)} className="flex gap-8 border-b border-brand-dark/10 pb-6">
                        {['baksteen', 'crepi', 'onbekend'].map((val) => (
                            <div key={val} className="flex items-center space-x-3 cursor-pointer">
                                <RadioGroupItem value={val} id={val} className="text-brand-bronze border-brand-dark/20 w-4 h-4" />
                                <Label htmlFor={val} className="capitalize text-lg font-light text-brand-dark/60 cursor-pointer">{dict.surfaces[val]}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-3 block">{dict.timing}</Label>
                    <select {...register('timing')} className="w-full border-b border-brand-dark/10 rounded-none py-4 bg-transparent text-2xl font-serif focus:outline-none focus:border-brand-bronze appearance-none cursor-pointer">
                        <option value="asap">{dict.timings.asap}</option>
                        <option value="1-3_maanden">{dict.timings['1-3_maanden']}</option>
                        <option value="later">{dict.timings.later}</option>
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
              <h3 className="text-brand-dark/50 font-light text-lg mb-8">{dict.question3}</h3>
              <div className="grid gap-12">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block">{dict.name}</Label>
                        <Input {...register('name')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                    </div>
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block">{dict.phone}</Label>
                        <Input {...register('phone')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                    </div>
                </div>
                <div className="group relative">
                    <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block">{dict.email}</Label>
                    <Input {...register('email')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block">{dict.postalCode}</Label>
                        <Input {...register('postalCode')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                    </div>
                    <div className="group relative">
                        <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 mb-2 block">{dict.city}</Label>
                        <Input {...register('city')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" />
                    </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        
        <div className="flex justify-between items-center pt-16 mt-auto">
            {step > 1 ? (
                 <Button type="button" variant="ghost" onClick={prevStep} className="hover:bg-transparent text-brand-dark/40 hover:text-brand-dark px-0 uppercase text-[10px] tracking-widest">
                 <ChevronLeft className="mr-2 w-3 h-3" /> {dict.prev}
               </Button>
            ) : <div/>}
           
           {step < 3 ? (
             <Button type="button" onClick={nextStep} className="bg-brand-dark text-white rounded-none px-10 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-bronze transition-all duration-500 group">
               {dict.next} <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
             </Button>
           ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-brand-bronze text-white rounded-none px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-xl group">
            {isSubmitting ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> ...</> : <>{dict.submit} <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" /></>}
          </Button>
           )}
        </div>
      </form>
    </div>
  );
};