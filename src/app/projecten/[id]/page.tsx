import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notFound } from "next/navigation";
import Image from "next/image";

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
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col">
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
            <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-end pb-24">
            <div className="max-w-4xl">
                <Link href="/projecten" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors uppercase text-[10px] tracking-[0.3em] group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Terug naar portfolio
                </Link>
                
                <div className="flex items-center gap-4 mb-6">
                    <span className="h-[1px] w-12 bg-brand-bronze"></span>
                    <span className="text-white/60 text-xs uppercase tracking-[0.4em] font-medium">{project.category}</span>
                </div>

                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] mb-12 tracking-tighter">
                    {project.title.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i % 2 === 1 ? "italic text-brand-bronzeLight block" : "block"}>
                            {word}
                        </span>
                    ))}
                </h1>

                <div className="flex flex-wrap gap-12 pt-12 border-t border-white/20">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block">Locatie</span>
                        <span className="text-white font-serif text-xl flex items-center gap-2"><MapPin size={16} className="text-brand-bronze" /> {project.location || 'België'}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block">Jaar</span>
                        <span className="text-white font-serif text-xl flex items-center gap-2"><Calendar size={16} className="text-brand-bronze" /> {project.year}</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Content & Editorial Gallery */}
      <section className="py-32 bg-brand-stone">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-24 mb-32">
                <div className="lg:col-span-5">
                    <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-8 block">Over het project</span>
                    <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
                        {project.subtitle || "Een transformatie met oog voor detail."}
                    </h2>
                </div>
                <div className="lg:col-span-7">
                    <div className="prose prose-lg prose-headings:font-serif prose-p:font-light prose-p:leading-relaxed text-brand-dark/70 max-w-none">
                        <p className="whitespace-pre-wrap text-xl leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Editorial Image Grid */}
            <div className="space-y-32">
                {images.length > 1 && (
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 aspect-[4/5] relative overflow-hidden group">
                            <Image 
                                src={images[1]} 
                                alt="Detail 1" 
                                fill 
                                className="object-cover transition-transform duration-2000 group-hover:scale-105"
                                unoptimized={images[1].includes('supabase.co')}
                            />
                        </div>
                        <div className="md:col-span-5 space-y-8">
                            <div className="aspect-square relative overflow-hidden group">
                                {images[2] && (
                                    <Image 
                                        src={images[2]} 
                                        alt="Detail 2" 
                                        fill 
                                        className="object-cover transition-transform duration-2000 group-hover:scale-105"
                                        unoptimized={images[2].includes('supabase.co')}
                                    />
                                )}
                            </div>
                            <p className="font-serif italic text-2xl text-brand-dark/40 max-w-xs">
                                "Elke gevel vertelt een eigen verhaal door de textuur van de kalei."
                            </p>
                        </div>
                    </div>
                )}

                {images.length > 3 && (
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 aspect-[3/4] relative overflow-hidden group">
                            <Image 
                                src={images[3]} 
                                alt="Detail 3" 
                                fill 
                                className="object-cover transition-transform duration-2000 group-hover:scale-105"
                                unoptimized={images[3].includes('supabase.co')}
                            />
                        </div>
                        <div className="md:col-span-8 aspect-video relative overflow-hidden group">
                            {images[4] && (
                                <Image 
                                    src={images[4]} 
                                    alt="Detail 4" 
                                    fill 
                                    className="object-cover transition-transform duration-2000 group-hover:scale-105"
                                    unoptimized={images[4].includes('supabase.co')}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Remaining images in a clean grid */}
                {images.length > 5 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.slice(5).map((url: string, idx: number) => (
                            <div key={idx} className="aspect-square relative overflow-hidden group">
                                <Image 
                                    src={url} 
                                    alt={`Detail ${idx + 5}`} 
                                    fill 
                                    className="object-cover transition-transform duration-2000 group-hover:scale-105"
                                    unoptimized={url.includes('supabase.co')}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-dark text-brand-stone text-center">
        <div className="container mx-auto px-6">
            <h2 className="font-serif text-4xl md:text-6xl mb-12">Ook uw gevel <br/><span className="italic text-brand-bronze">vernieuwen?</span></h2>
            <Link 
                href="/offerte" 
                className="inline-flex items-center gap-4 bg-brand-bronze text-white px-12 py-6 uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-brand-dark transition-all duration-500 group"
            >
                Vraag een offerte aan <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}