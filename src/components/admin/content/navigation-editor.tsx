"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Footprints, Info } from "lucide-react";

interface NavigationEditorProps {
  content: any;
  onUpdate: (section: string, field: string, value: any) => void;
}

export const NavigationEditor = ({ content, onUpdate }: NavigationEditorProps) => {
  const updateSubfield = (section: string, field: string, value: string) => {
    onUpdate(section, field, value);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header / Menu */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <Menu size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Menu & Navigatie</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Home</Label>
            <Input value={content.header?.home} onChange={(e) => updateSubfield("header", "home", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Over Ons</Label>
            <Input value={content.header?.about} onChange={(e) => updateSubfield("header", "about", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Vakmanschap</Label>
            <Input value={content.header?.craftsmanship} onChange={(e) => updateSubfield("header", "craftsmanship", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Realisaties</Label>
            <Input value={content.header?.projects} onChange={(e) => updateSubfield("header", "projects", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Offerte Knop</Label>
            <Input value={content.header?.quote} onChange={(e) => updateSubfield("header", "quote", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <Footprints size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Footer & Contact</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Beschrijving in Footer</Label>
            <Textarea value={content.footer?.desc} onChange={(e) => updateSubfield("footer", "desc", e.target.value)} className="rounded-none border-brand-dark/10 min-h-[80px]" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Label: Contact</Label>
              <Input value={content.footer?.contact} onChange={(e) => updateSubfield("footer", "contact", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Label: Menu</Label>
              <Input value={content.footer?.menu} onChange={(e) => updateSubfield("footer", "menu", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Label: Socials</Label>
              <Input value={content.footer?.socials} onChange={(e) => updateSubfield("footer", "socials", e.target.value)} className="rounded-none border-brand-dark/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Page */}
      <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
          <Info size={20} className="text-brand-bronze" />
          <h2 className="font-serif text-2xl">Projecten Pagina</h2>
        </div>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Kleine Tag</Label>
            <Input value={content.projects?.tag} onChange={(e) => updateSubfield("projects", "tag", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdtitel</Label>
            <Input value={content.projects?.title} onChange={(e) => updateSubfield("projects", "title", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Subtitel</Label>
            <Textarea value={content.projects?.subtitle} onChange={(e) => updateSubfield("projects", "subtitle", e.target.value)} className="rounded-none border-brand-dark/10" />
          </div>
        </div>
      </section>
    </div>
  );
};