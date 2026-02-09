"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

// Schema definition
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
  { id: 1, title: "Type Project" },
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
    // Simulate API call to Supabase
    console.log("Submitting to Supabase:", data);
    
    // In real implementation:
    // await supabase.from('quote_requests').insert({ ...data });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Offerte aanvraag ontvangen!");
    }, 1500);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (isSuccess) {
    return (
      <div className="text-center p-12 bg-brand-light rounded-lg border border-brand-gold/30">
        <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-white w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Bedankt voor uw aanvraag!</h3>
        <p className="text-brand-dark/70">We hebben uw gegevens goed ontvangen en nemen binnen de 48u contact op.</p>
        <Button className="mt-8" variant="outline" onClick={() => window.location.reload()}>Nieuwe aanvraag</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-brand-dark/5">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
        <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-gold -z-10 transition-all duration-300" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= s.id ? 'border-brand-gold bg-brand-gold text-white' : 'border-gray-200 text-gray-400'}`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`text-xs font-medium ${step >= s.id ? 'text-brand-dark' : 'text-gray-400'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
            
          {step === 1 && (
            <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
              <h3 className="text-xl font-bold">Wat wilt u laten uitvoeren?</h3>
              <div className="grid grid-cols-2 gap-4">
                {['gevel', 'binnen', 'totaal', 'renovatie'].map((type) => (
                    <label key={type} className={`cursor-pointer border-2 rounded-lg p-4 hover:border-brand-gold/50 transition-all ${watch('projectType') === type ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-100'}`}>
                        <input 
                            type="radio" 
                            value={type} 
                            {...register('projectType')} 
                            className="sr-only"
                        />
                        <div className="capitalize font-medium text-lg">{type}</div>
                        <div className="text-xs text-gray-500 mt-1">Selecteer optie</div>
                    </label>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button type="button" onClick={nextStep} className="bg-brand-dark text-white">
                  Volgende <ChevronRight className="ml-2 w-4 h-4" />
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
                className="space-y-6"
            >
              <h3 className="text-xl font-bold">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                    <Label>Geschatte oppervlakte (m²)</Label>
                    <Input {...register('surfaceArea')} placeholder="bv. 150" type="number" className="mt-1" />
                    {errors.surfaceArea && <span className="text-red-500 text-sm">{errors.surfaceArea.message}</span>}
                </div>

                <div>
                    <Label className="mb-2 block">Ondergrond</Label>
                    <RadioGroup defaultValue="baksteen" onValueChange={(val) => setValue('surfaceType', val as any)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="baksteen" id="r1" />
                            <Label htmlFor="r1">Baksteen (zichtbaar)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="crepi" id="r2" />
                            <Label htmlFor="r2">Crepi / Pleister</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="onbekend" id="r3" />
                            <Label htmlFor="r3">Onbekend / Anders</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                    <Label className="mb-2 block">Gewenste timing</Label>
                    <select {...register('timing')} className="w-full border rounded-md p-2 bg-white">
                        <option value="asap">Zo snel mogelijk</option>
                        <option value="1-3_maanden">Binnen 1-3 maanden</option>
                        <option value="later">Later dit jaar</option>
                    </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={prevStep}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Vorige
                </Button>
                <Button type="button" onClick={nextStep} className="bg-brand-dark text-white">
                  Volgende <ChevronRight className="ml-2 w-4 h-4" />
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
                className="space-y-6"
            >
              <h3 className="text-xl font-bold">Uw Gegevens</h3>
              
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label>Naam</Label>
                        <Input {...register('name')} placeholder="Uw naam" />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>
                    <div>
                        <Label>Telefoon</Label>
                        <Input {...register('phone')} placeholder="04..." />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>
                </div>
                
                <div>
                    <Label>Email</Label>
                    <Input {...register('email')} placeholder="naam@email.be" />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div>
                    <Label>Postcode van de werken</Label>
                    <Input {...register('postalCode')} placeholder="bv. 2000" />
                    {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode.message}</span>}
                </div>
              </div>

              <div className="bg-brand-light p-4 rounded-md text-sm text-brand-dark/70 border border-brand-gold/20">
                <p>Na verzending nemen wij contact op om een plaatsbezoek in te plannen.</p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={prevStep}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Vorige
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-brand-gold hover:bg-brand-goldLight text-brand-dark w-full md:w-auto">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Even geduld...</> : "Offerte aanvragen"}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>
    </div>
  );
};