"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface ContentHeaderProps {
  locale: string;
  onSave: () => void;
  saving: boolean;
}

export const ContentHeader = ({ locale, onSave, saving }: ContentHeaderProps) => {
  return (
    <header className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="font-serif text-4xl mb-2">Website Content</h1>
        <p className="text-brand-dark/60">Beheer de teksten voor: <span className="font-bold uppercase">{locale}</span></p>
      </div>
      <Button onClick={onSave} disabled={saving} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze transition-all duration-500">
        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
        Wijzigingen Opslaan
      </Button>
    </header>
  );
};