import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const revalidate = 0;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const images = project.images || (project.image_url ? [project.image_url] : []);

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      {/* Compact Hero Section */}
      <section className="relative h-[70vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
            {images.length > 0 ? (
                <Image 
                    src={images[0]} 
                    alt={project.title} 
                    fill 
                    className="object-cover" 
                    priority
                    unoptimized={images[0].includes('supabase.co')}
                />
            ) : (
                <div className="absolute inset-0 bg-brand-dark"></div>
            )}
            <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-end pb-16">
            <div className="max-w-3xl">
                <Link href="/projecten" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors uppercase text-[9px] tracking-[0.3em] group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Terug naar portfolio
                </Link>
                
                <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6 tracking-tight">
                    {project.title}
                </h1>

                <div className="flex gap-8 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-brand-bronze" />
                        <span className="text-white/80 text-[10px] uppercase tracking-widest">{project.location || 'België'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand-bronze" />
                        <span className="text-white/80 text-[10px] uppercase tracking-widest">{project.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-bronze"></span>
                        <span className="text-white/80 text-[10px] uppercase tracking-widest">{project.category}</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Content & Compact Gallery */}
      <section className="py-20 bg-brand-stone">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-12 mb-24">
                <div className="lg:col-span-4">
                    <h2 className="font-serif text-3xl leading-tight mb-4">
                        {project.subtitle || "Authentiek vakmanschap."}
                    </h2>
                </div>
                <div className="lg:col-span-8">
                    <p className="text-brand-dark/70 font-light leading-relaxed text-lg whitespace-pre-wrap">
                        {project.description}
                    </p>
                </div>
            </div>

            {/* Compact Editorial Grid */}
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {images.slice(1).map((url: string, idx: number) => {
                    // Create a dynamic grid pattern
                    const isLarge = idx % 5 === 0;
                    const isMedium = idx % 5 === 1 || idx % 5 === 2;
                    
                    return (
                        <div 
                            key={idx} 
                            className={cn(
                                "relative overflow-hidden bg-brand-dark/5 group",
                                isLarge ? "col-span-12 md:col-span-8 aspect-video" : 
                                isMedium ? "col-span-6 md:col-span-4 aspect-square" : 
                                "col-span-12 md:col-span-6 aspect-[16/10]"
                            )}
                        >
                            <Image 
                                src={url} 
                                alt={`Detail ${idx + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                unoptimized={url.includes('supabase.co')}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Compact CTA */}
      <section className="py-20 bg-brand-dark text-brand-stone">
        <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-8">Interesse in een gelijkaardig project?</h2>
            <Link 
                href="/offerte" 
                className="inline-flex items-center gap-3 border border-brand-bronze text-brand-bronze px-8 py-4 uppercase text-[10px] tracking-[0.3em] hover:bg-brand-bronze hover:text-white transition-all duration-500 group"
            >
                Vraag offerte aan <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}