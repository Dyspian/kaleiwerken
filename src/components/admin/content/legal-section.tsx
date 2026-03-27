"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/content/rich-text-editor";

interface LegalSectionProps {
  title: string;
  content: string;
  onUpdate: (field: "title" | "content", value: string) => void;
  icon: React.ReactNode;
  sectionTitle: string;
}

export const LegalSection = ({ title, content, onUpdate, icon, sectionTitle }: LegalSectionProps) => {
  return (
    <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
        {icon}
        <h2 className="font-serif text-2xl">{sectionTitle}</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Pagina Titel</Label>
          <Input 
            value={title} 
            onChange={(e) => onUpdate("title", e.target.value)}
            className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
            placeholder={sectionTitle}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">{sectionTitle} Inhoud</Label>
          <RichTextEditor
            value={content}
            onChange={(value) => onUpdate("content", value)}
            placeholder={`Typ hier uw ${sectionTitle.toLowerCase()}...`}
            className="min-h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};