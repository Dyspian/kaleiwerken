"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface HeroSectionProps {
  content: {
    title1: string;
    title2: string;
    subtitle: string;
    heroImage?: string;
  };
  onUpdate: (field: string, value: string) => void;
  onImageUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
}

export const HeroSection = ({ content, onUpdate, onImageUpload, uploading }: HeroSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultHeroImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file);
    }
  };

  return (
    <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
        <Globe size={20} className="text-brand-bronze" />
        <h2 className="font-serif text-2xl">Home: Hero Sectie</h2>
      </div>

      <div className="space-y-8">
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

        {/* Hero Image Upload */}
        <div className="space-y-4">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Hero Achtergrond Foto</Label>
          <div className="relative aspect-[16/9] bg-brand-stone border border-brand-dark/5 overflow-hidden group">
            {content.heroImage ? (
              <img src={content.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
            ) : (
              <img src={defaultHeroImage} alt="Default hero" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-white text-brand-dark border-none rounded-none uppercase text-[10px] tracking-widest"
              >
                {uploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload className="mr-2" size={14} />}
                Foto Wijzigen
              </Button>
              {content.heroImage && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => onUpdate("heroImage", "")}
                  className="rounded-none uppercase text-[10px] tracking-widest"
                >
                  <X className="mr-2" size={14} /> Verwijderen
                </Button>
              )}
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      </div>
    </section>
  );
};