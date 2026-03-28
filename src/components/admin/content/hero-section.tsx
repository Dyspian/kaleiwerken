"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from "lucide-react";

interface HeroSectionProps {
  content: {
    title1: string;
    title2: string;
    subtitle: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export const HeroSection = ({ content, onUpdate }: HeroSectionProps) => {
  return (
    <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
        <Globe size={20} className="text-brand-bronze" />
        <h2 className="font-serif text-2xl">Home: Hero Sectie</h2>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 1</Label>
            <Input 
              value={content.title1} 
              onChange={(e) => onUpdate("title1", e.target.value)}
              className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 2 (Italic)</Label>
            <Input 
              value={content.title2} 
              onChange={(e) => onUpdate("title2", e.target.value)}
              className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze italic"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Subtitel</Label>
          <Textarea 
            value={content.subtitle} 
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[100px]"
          />
        </div>
      </div>
    </section>
  );
};