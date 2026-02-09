import { ShieldCheck, Clock, Wind } from "lucide-react";
import { siteContent } from "@/content/site";

const icons = [ShieldCheck, Clock, Wind];

export const Features = () => {
  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {siteContent.benefits.map((benefit, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-brand-gold hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-6">
                  <Icon className="text-brand-dark w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-dark">{benefit.title}</h3>
                <p className="text-brand-dark/70 leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};