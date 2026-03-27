"use client";

import { Info } from "lucide-react";

export const ContentTip = () => {
  return (
    <div className="mb-8 p-6 bg-brand-bronze/10 border border-brand-bronze/20 flex items-start gap-4">
      <Info className="text-brand-bronze shrink-0 mt-0.5" size={20} />
      <div>
        <h4 className="font-bold text-brand-dark text-sm mb-1">Belangrijke Tip</h4>
        <p className="text-xs text-brand-dark/70 leading-relaxed">
          Velden die u leeg laat zullen automatisch de standaardtekst uit de taalbestanden gebruiken. 
          U hoeft dus alleen de velden in te vullen die u daadwerkelijk wilt aanpassen.
        </p>
      </div>
    </div>
  );
};