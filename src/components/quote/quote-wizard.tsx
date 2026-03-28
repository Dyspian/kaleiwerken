"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Naam is te kort"),
  email: z.string().email("Ongeldig emailadres"),
  phone: z.string().min(9, "Ongeldig telefoonnummer"),
  postalCode: z.string().min(4, "Ongeldige postcode"),
  city: z.string().optional(),
  comment: z.string().min(5, "Beschrijf a.u.b. kort uw project"),
});

export type FormValues = z.infer<typeof formSchema>;

interface QuoteWizardProps {
  dict: any;
}

export const QuoteWizard = ({ dict }: QuoteWizardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          postal_code: data.postalCode,
          city: data.city || "",
          comment: data.comment,
          project_type: "Algemene aanvraag",
          surface_type: "Onbekend",
          timing: "Nader te bepalen",
          status: "nieuw"
        });

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Er is iets misgegaan bij het verzenden.");
      } else {
        setIsSuccess(true);
        toast.success(dict.success || "Bedankt!");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Er is een onverwachte fout opgetreden.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="flex justify-between items-end mb-12 border-b border-brand-dark/5 pb-4">
        <span className="font-serif text-3xl italic text-brand-dark">
            Uw Aanvraag
        </span>
        <span className="text-xs uppercase tracking-widest text-brand-dark/30 font-mono">Direct contact</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">{dict.name}</Label>
                <Input {...register('name')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" placeholder="Uw volledige naam" />
                {errors.name && <p className="text-red-500 text-[10px] uppercase">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">{dict.phone}</Label>
                <Input {...register('phone')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" placeholder="0400 00 00 00" />
                {errors.phone && <p className="text-red-500 text-[10px] uppercase">{errors.phone.message}</p>}
            </div>
        </div>

        <div className="space-y-2">
            <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">{dict.email}</Label>
            <Input {...register('email')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" placeholder="email@voorbeeld.be" />
            {errors.email && <p className="text-red-500 text-[10px] uppercase">{errors.email.message}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">{dict.postalCode}</Label>
                <Input {...register('postalCode')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" placeholder="2000" />
                {errors.postalCode && <p className="text-red-500 text-[10px] uppercase">{errors.postalCode.message}</p>}
            </div>
            <div className="space-y-2">
                <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">{dict.city}</Label>
                <Input {...register('city')} className="border-0 border-b border-brand-dark/10 rounded-none px-0 py-4 text-xl font-serif focus-visible:ring-0 focus-visible:border-brand-bronze bg-transparent" placeholder="Antwerpen" />
            </div>
        </div>

        <div className="space-y-2">
            <Label className="uppercase text-[10px] tracking-[0.2em] text-brand-dark/40 block">Projectomschrijving & Opmerkingen</Label>
            <Textarea 
                {...register('comment')}
                placeholder="Vertel ons meer over uw project (bijv. oppervlakte, gewenste kleur, binnen of buiten...)"
                className="bg-brand-stone/20 rounded-none border-brand-dark/10 min-h-[150px] focus-visible:ring-brand-bronze p-4 text-lg font-light"
            />
            {errors.comment && <p className="text-red-500 text-[10px] uppercase">{errors.comment.message}</p>}
        </div>

        <div className="pt-8">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-dark text-white rounded-none py-8 uppercase text-xs tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500 shadow-xl group">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Bezig met verzenden...</> : <>{dict.submit} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </Button>
        </div>
      </form>
    </div>
  );
};