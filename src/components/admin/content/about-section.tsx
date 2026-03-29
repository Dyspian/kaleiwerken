"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Image as ImageIcon, Upload, Loader2, Plus, Trash2, Check } from "lucide-react";

interface AboutSectionProps {
  content: {
    tag: string;
    title: string;
    description: string;
    imageUrl: string;
    features: string[];
    personal: string;
    personalDesc: string;
    pigments: string;
    pigmentsDesc: string;
    protection: string;
    protectionDesc: string;
  };
  onUpdate: (field: string, value: any) => void;
  onImageUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const AboutSection = ({ content, onUpdate, onImageUpload, uploading }: AboutSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultAboutImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/about%20us/Kaleiwerk-buitengevel-Pulle-Vincent-Van-Roey-Schilderwerken-3.jpg";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(content.features || [])];
    newFeatures[index] = value;
    onUpdate("features", newFeatures);
  };

  const addFeature = () => {
    onUpdate("features", [...(content.features || []), "Nieuw kenmerk"]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(content.features || [])].filter((_, i) => i !== index);
    onUpdate("features", newFeatures);
  };

  return (
    <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
        <User size={20} className="text-brand-bronze" />
        <h2 className="font-serif text-2xl">Pagina: Over Ons</h2>
      </div>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Kleine Tag (boven titel)</Label>
              <Input 
                value={content.tag} 
                onChange={(e) => onUpdate("tag", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdtitel</Label>
              <Input 
                value={content.title} 
                onChange={(e) => onUpdate("title", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdbeschrijving</Label>
              <Textarea 
                value={content.description} 
                onChange={(e) => onUpdate("description", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[120px]"
              />
            </div>

            <div className="space-y-4 pt-4">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block">Kenmerken (Bullet Points)</Label>
              <div className="space-y-3">
                {(content.features || []).map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-1 relative">
                      <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-bronze w-3 h-3" />
                      <Input 
                        value={feature} 
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className="rounded-none border-brand-dark/10 pl-10 text-xs"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeFeature(idx)}
                      className="shrink-0 rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addFeature}
                  className="w-full rounded-none border-dashed border-brand-dark/20 text-[10px] uppercase tracking-widest hover:bg-brand-stone"
                >
                  <Plus size={14} className="mr-2" /> Kenmerk toevoegen
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Hoofdfoto</Label>
            <div className="relative aspect-[4/5] bg-brand-stone border border-brand-dark/5 overflow-hidden group">
              <img 
                src={content.imageUrl || defaultAboutImage} 
                alt="Over ons preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-brand-dark/5">
          <div className="space-y-4">
            <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Persoonlijk</h4>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
              <Input 
                value={content.personal} 
                onChange={(e) => onUpdate("personal", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
              <Textarea 
                value={content.personalDesc} 
                onChange={(e) => onUpdate("personalDesc", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Pigmenten</h4>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
              <Input 
                value={content.pigments} 
                onChange={(e) => onUpdate("pigments", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
              <Textarea 
                value={content.pigmentsDesc} 
                onChange={(e) => onUpdate("pigmentsDesc", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Bescherming</h4>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
              <Input 
                value={content.protection} 
                onChange={(e) => onUpdate("protection", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
              <Textarea 
                value={content.protectionDesc} 
                onChange={(e) => onUpdate("protectionDesc", e.target.value)}
                className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};