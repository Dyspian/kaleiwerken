import { CheckCircle2 } from "lucide-react";
import { siteContent } from "@/content/site";

export const SocialProof = () => {
  return (
    <section className="bg-brand-dark text-brand-light py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center">
          {siteContent.socialProof.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <CheckCircle2 className="text-brand-gold w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};