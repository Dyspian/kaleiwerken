"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Award, Upload, Loader2, X } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";

interface CraftsmanshipSectionProps {
  content: {
    title: string;
    subtitle: string;
    heroImage: string;
    mainContent: string;
  };
  onUpdate: (field: string, value: string) => void;
  onImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const CraftsmanshipSection = ({ content, onUpdate, onImageUpload, uploading }: CraftsmanshipSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file);
    }
  };

  return (
    <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
        <Award size={20} className="text-brand-bronze" />
        <h2 className="font-serif text-2xl">Pagina: Ons Vakmanschap</h2>
      </div>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdtitel</Label>
            <Input 
              value={content.title} 
              onChange={(e) => onUpdate("title", e.target.value)}
              className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              placeholder="Ons Vakmanschap"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Subtitel</Label>
            <Input 
              value={content.subtitle} 
              onChange={(e) => onUpdate("subtitle", e.target.value)}
              className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              placeholder="Passie voor detail en kwaliteit"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Banner Foto</Label>
          <div className="relative aspect-video bg-brand-stone border border-brand-dark/5 overflow-hidden group max-w-2xl">
            {content.heroImage ? (
              <img src={content.heroImage} alt="Vakmanschap preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-dark/20 text-xs uppercase tracking-widest">Geen afbeelding</div>
            )}
            <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
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

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Inhoud Pagina</Label>
          <RichTextEditor
            value={content.mainContent}
            onChange={(value) => onUpdate("mainContent", value)}
            placeholder="Beschrijf hier uw vakmanschap..."
            className="min-h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};