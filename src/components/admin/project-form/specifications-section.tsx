"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { ProjectFormValues } from "./project-form";

interface SpecificationsSectionProps {
  register: UseFormRegister<ProjectFormValues>;
}

export const SpecificationsSection = ({ register }: SpecificationsSectionProps) => {
  const specifications = [
    { name: "technique", label: "Techniek", placeholder: "Bijv. Kalei op maat" },
    { name: "type", label: "Type", placeholder: "Bijv. Gevel" },
    { name: "finishing", label: "Afwerking", placeholder: "Bijv. Hydrofuge" },
  ] as const;

  return (
    <div className="space-y-8 pt-8 border-t border-brand-dark/5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-brand-bronze" />
        <h3 className="font-serif text-xl">Specificaties</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {specifications.map((spec) => (
          <div key={spec.name} className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">{spec.label}</Label>
            <Input 
              {...register(spec.name)} 
              className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" 
              placeholder={spec.placeholder} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};