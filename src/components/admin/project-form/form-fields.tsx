"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProjectFormValues } from "./project-form";

interface FormFieldProps {
  name: keyof ProjectFormValues;
  label: string;
  placeholder?: string;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  className?: string;
  type?: "text" | "textarea";
}

export const FormField = ({ 
  name, 
  label, 
  placeholder, 
  register, 
  errors, 
  className = "",
  type = "text"
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">{label}</Label>
      {type === "textarea" ? (
        <Textarea 
          {...register(name)}
          className={`bg-white rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze ${className}`}
          placeholder={placeholder}
        />
      ) : (
        <Input 
          {...register(name)}
          className={`rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze ${className}`}
          placeholder={placeholder}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs">{errors[name]?.message}</p>}
    </div>
  );
};

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FormRow = ({ children, className = "" }: FormRowProps) => {
  return (
    <div className={`grid grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormSection = ({ title, icon, children }: FormSectionProps) => {
  return (
    <div className="space-y-8 pt-8 border-t border-brand-dark/5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-serif text-xl">{title}</h3>
      </div>
      {children}
    </div>
  );
};