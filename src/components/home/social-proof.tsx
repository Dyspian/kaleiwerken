import { Check } from "lucide-react";
import { siteContent } from "@/content/site";

export const SocialProof = () => {
  return (
    <section className="bg-brand-dark text-brand-stone py-12 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-12 items-center opacity-80">
          {siteContent.socialProof.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center group-hover:bg-brand-bronze transition-colors duration-500">
                 <Check className="text-brand-stone w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-xs md:text-sm font-medium uppercase tracking-widest">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};