import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default async function CraftsmanshipPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('locale', locale)
    .maybeSingle();

  // Default values
  const defaults = {
    title: "Ons Vakmanschap",
    subtitle: "Passie voor detail en kwaliteit",
    heroImage: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg",
    mainContent: "<h2>Traditionele Technieken</h2><p>Wij combineren jarenlange ervaring met de beste materialen om uw gevel te transformeren.</p>",
    ctaText: "Bezoek Schilderwerken Vincent Van Roey",
    ctaLink: "https://schilderwerkenvincentvanroey.be/"
  };

  // Merge CMS content with defaults to ensure all fields exist
  const content = {
    ...defaults,
    ...(settings?.content?.craftsmanship || {})
  };

  const renderMarkdown = (text: string) => {
    if (!text) return "";
    return text
      .replace(/^## (.*$)/gim, '<h2 class="font-serif text-4xl md:text-5xl mb-8 mt-16 text-brand-dark">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="font-serif text-2xl mb-6 mt-12 text-brand-dark">$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold text-brand-dark">$1</strong>')
      .replace(/\*(.*)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-brand-bronze hover:underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-6">')
      .replace(/\n/g, '<br>');
  };

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header dict={dict} />
      
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={content.heroImage} 
            alt={content.title} 
            fill 
            className="object-cover" 
            priority
            unoptimized={content.heroImage.includes('supabase.co')}
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
          <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">Vakmanschap</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light opacity-80">
            {content.subtitle}
          </p>
        </div>
      </section>

      <section className="py-32 bg-brand-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg prose-headings:font-serif prose-p:font-light text-brand-dark/70 max-w-none leading-relaxed mb-16"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content.mainContent) }}
            />

            {content.ctaLink && (
                <div className="pt-12 border-t border-brand-dark/5 text-center">
                    <Button 
                        asChild
                        className="bg-brand-dark text-white rounded-none px-10 py-8 uppercase text-[11px] tracking-[0.25em] hover:bg-brand-bronze transition-all duration-500 group shadow-2xl"
                    >
                        <a href={content.ctaLink} target="_blank" rel="noopener noreferrer">
                            {content.ctaText || "Bezoek onze website"}
                            <ArrowUpRight className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </Button>
                </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer dict={dict} />
    </main>
  );
}