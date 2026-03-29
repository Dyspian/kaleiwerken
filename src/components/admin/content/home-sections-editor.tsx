"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LayoutGrid, CheckCircle2, Zap, ListChecks, ArrowLeftRight, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface HomeSectionsEditorProps {
  content: any;
  onUpdate: (section: string, field: string, value: any) => void;
  onImageUpload: (file: File, section: string, fieldName?: string) => Promise<void>;
  uploading: boolean;
}

export const HomeSectionsEditor = ({ content, onUpdate, onImageUpload, uploading }: HomeSectionsEditorProps) => {
  const processFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const defaultBeforeImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/voor-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci92b29yLWZvdG8uanBlZyIsImlhdCI6MTc3MzUwNzkyMSwiZXhwIjoyMDg4ODY3OTIxfQ.szVq8e3NYlBPaoh4fJJKQwycCtYZeS1tVqvm0J9yzUg";
  const defaultAfterImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/sign/before%20-%20after/na-foto.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjFlYzljYS0wYTI5LTRhZDYtYWY5My0yYWFhZjJmZmNiNzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZWZvcmUgLSBhZnRlci9uYS1mb3RvLmpwZWciLCJpYXQiOjE3NzM1MDc5NDgsImV4cCI6MjA4ODg2Nzk0OH0.ggn0wqDGB9VEToA30UbLA4nOK8o6AcN6HmaMdOWDBF4";

  // Helper to update arrays
  const updateArrayItem = (section: string, field: string, index: number, subfield: string, value: string) => {
    const newArray = [...(content[section][field] || [])];
    if (subfield) {
      newArray[index] = { ...newArray[index], [subfield]: value };
    } else {
      newArray[index] = value;
    }
    onUpdate(section, field, newArray);
  };

  const addArrayItem = (section: string, field: string, defaultValue: any) => {
    const newArray = [...(content[section][field] || []), defaultValue];
    onUpdate(section, field, newArray);
  };

  const removeArrayItem = (section: string, field: string, index: number) => {
    const newArray = [...(content[section][field] || [])].filter((_, i) => i !== index);
    onUpdate(section, field, newArray);
  };

  const handleProcessFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file, "process");
    }
  };

  const handleBeforeFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file, "beforeAfter", "beforeImage");
    }
  };

  const handleAfterFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImageUpload(file, "beforeAfter", "afterImage");
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Social Proof */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <CheckCircle2 size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Social Proof (Vinkjes)</h2>
        </div>
        <div className="space-y-4">
          {content.socialProof?.items?.map((item: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input 
                value={item} 
                onChange={(e) => updateArrayItem("socialProof", "items", idx, "", e.target.value)}
                className="rounded-none border-brand-dark/10"
              />
              <Button variant="outline" size="icon" onClick={() => removeArrayItem("socialProof", "items", idx)} className="shrink-0 rounded-none">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => addArrayItem("socialProof", "items", "Nieuw item")} className="w-full rounded-none border-dashed">
            <Plus size={14} className="mr-2" /> Item toevoegen
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <Zap size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Features (De kunst van...)</h2>
        </div>
        <div className="grid gap-6 mb-8">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Sectie Titel</Label>
            <Input value={content.features?.title} onChange={(e) => onUpdate("features", "title", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Sectie Subtitel</Label>
            <Textarea value={content.features?.subtitle} onChange={(e) => onUpdate("features", "subtitle", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
        </div>
        <div className="space-y-6">
          {content.features?.items?.map((item: any, idx: number) => (
            <div key={idx} className="p-4 border border-brand-dark/5 bg-brand-stone/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze">Feature {idx + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeArrayItem("features", "items", idx)} className="h-6 text-red-500">Verwijder</Button>
              </div>
              <Input value={item.title} onChange={(e) => updateArrayItem("features", "items", idx, "title", e.target.value)} placeholder="Titel" className="rounded-none border-brand-dark/10" />
              <Textarea value={item.desc} onChange={(e) => updateArrayItem("features", "items", idx, "desc", e.target.value)} placeholder="Beschrijving" className="rounded-none border-brand-dark/10 text-xs" />
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <ListChecks size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Werkwijze (Stappenplan)</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Sectie Titel</Label>
              <Input value={content.process?.title} onChange={(e) => onUpdate("process", "title", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Sectie Beschrijving</Label>
              <Textarea value={content.process?.desc} onChange={(e) => onUpdate("process", "desc", e.target.value)} className="rounded-none border-brand-dark/10 min-h-[100px]" />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Sectie Foto</Label>
            <div className="relative aspect-video bg-brand-stone border border-brand-dark/5 overflow-hidden group">
              {content.process?.imageUrl ? (
                <img src={content.process.imageUrl} alt="Werkwijze preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-dark/20 text-xs uppercase tracking-widest">Geen foto</div>
              )}
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => processFileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-white text-brand-dark border-none rounded-none uppercase text-[10px] tracking-widest"
                >
                  {uploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload className="mr-2" size={14} />}
                  Foto Wijzigen
                </Button>
                {content.process?.imageUrl && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onUpdate("process", "imageUrl", "")}
                    className="rounded-none uppercase text-[10px] tracking-widest"
                  >
                    <X className="mr-2" size={14} /> Verwijderen
                  </Button>
                )}
              </div>
            </div>
            <input type="file" ref={processFileInputRef} onChange={handleProcessFileChange} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="space-y-6">
          {content.process?.steps?.map((step: any, idx: number) => (
            <div key={idx} className="p-4 border border-brand-dark/5 bg-brand-stone/10 space-y-4">
              <Input value={step.title} onChange={(e) => updateArrayItem("process", "steps", idx, "title", e.target.value)} placeholder="Stap Titel" className="rounded-none border-brand-dark/10" />
              <Textarea value={step.desc} onChange={(e) => updateArrayItem("process", "steps", idx, "desc", e.target.value)} placeholder="Stap Beschrijving" className="rounded-none border-brand-dark/10 text-xs" />
            </div>
          ))}
        </div>
      </section>

      {/* Before/After */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <ArrowLeftRight size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Voor / Na Sectie</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Kleine Tag</Label>
              <Input value={content.beforeAfter?.tag} onChange={(e) => onUpdate("beforeAfter", "tag", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
              <Input value={content.beforeAfter?.title} onChange={(e) => onUpdate("beforeAfter", "title", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Instructie tekst</Label>
              <Input value={content.beforeAfter?.instruction} onChange={(e) => onUpdate("beforeAfter", "instruction", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Voor Foto</Label>
              <div className="relative aspect-[4/5] bg-brand-stone border border-brand-dark/5 overflow-hidden group">
                <img src={content.beforeAfter?.beforeImage || defaultBeforeImage} alt="Voor preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => beforeFileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white text-brand-dark border-none rounded-none uppercase text-[10px] tracking-widest"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                  </Button>
                </div>
              </div>
              <input type="file" ref={beforeFileInputRef} onChange={handleBeforeFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-2">Na Foto</Label>
              <div className="relative aspect-[4/5] bg-brand-stone border border-brand-dark/5 overflow-hidden group">
                <img src={content.beforeAfter?.afterImage || defaultAfterImage} alt="Na preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => afterFileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white text-brand-dark border-none rounded-none uppercase text-[10px] tracking-widest"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                  </Button>
                </div>
              </div>
              <input type="file" ref={afterFileInputRef} onChange={handleAfterFileChange} className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};