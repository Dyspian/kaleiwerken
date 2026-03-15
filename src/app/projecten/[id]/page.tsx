import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ChevronRight, Info, ShieldCheck, Paintbrush } from "lucide-react";
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
  const heroImage = project.image_url || (images.length > 0 ? images[0] : null);

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      {/* Immersive Hero Section */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
            {heroImage ? (
                <Image 
                    src={heroImage} 
                    alt={project.title} 
                    fill 
                    className="object-cover" 
                    priority
                    unoptimized={heroImage.includes('supabase.co')}
                />
            ) : (
                <div className="absolute inset-0 bg-brand-dark"></div>
            )}
            <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-end pb-24">
            <div className="max-w-4xl">
                <Link href="/projecten" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors uppercase text-[10px] tracking-[0.4em] group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Terug naar portfolio
                </Link>
                
                <span className="text-brand-bronze font-mono text-xs uppercase tracking-[0.3em] mb-6 block">Project Realisatie</span>
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] mb-12 tracking-tighter">
                    {project.title}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/20">
                    <div>
                        <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Locatie</span>
                        <div className="flex items-center gap-2 text-white">
                            <MapPin size={14} className="text-brand-bronze" />
                            <span className="font-serif text-xl">{project.location || 'België'}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Jaar</span>
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={14} className="text-brand-bronze" />
                            <span className="font-serif text-xl">{project.year}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Expertise</span>
                        <div className="flex items-center gap-2 text-white">
                            <Paintbrush size={14} className="text-brand-bronze" />
                            <span className="font-serif text-xl">{project.category}</span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-2">Status</span>
                        <div className="flex items-center gap-2 text-white">
                            <ShieldCheck size={14} className="text-brand-bronze" />
                            <span className="font-serif text-xl">Opgeleverd</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section className="py-32 bg-brand-stone relative">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-24 items-start">
                {/* Left: Detailed Text */}
                <div className="lg:col-span-7 space-y-16">
                    <div className="space-y-8">
                        <h2 className="font-serif text-4xl md:text-6xl leading-tight text-brand-dark">
                            {project.subtitle || "Een transformatie met oog voor detail."}
                        </h2>
                        <div className="w-24 h-[1px] bg-brand-bronze"></div>
                        <p className="text-brand-dark/70 font-light leading-relaxed text-xl md:text-2xl whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </div>

                    {/* Technical Specs / Highlights */}
                    <div className="grid sm:grid-cols-2 gap-12 pt-16 border-t border-brand-dark/10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-brand-bronze">
                                <Info size={20} />
                                <h4 className="uppercase text-xs tracking-widest font-bold">De Uitdaging</h4>
                            </div>
                            <p className="text-brand-dark/60 text-sm leading-relaxed">
                                Elk project begint met een grondige analyse van de ondergrond. Bij dit project lag de focus op het herstellen van de authentieke textuur terwijl we een moderne, duurzame bescherming boden.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-brand-bronze">
                                <ShieldCheck size={20} />
                                <h4 className="uppercase text-xs tracking-widest font-bold">Het Resultaat</h4>
                            </div>
                            <p className="text-brand-dark/60 text-sm leading-relaxed">
                                Door gebruik te maken van onze zelfgemengde minerale pigmenten hebben we een kleurdiepte bereikt die mee verandert met de lichtinval gedurende de dag.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Sticky Info Box */}
                <div className="lg:col-span-5 lg:sticky lg:top-32">
                    <div className="bg-brand-dark text-brand-stone p-12 space-y-12">
                        <div>
                            <span className="text-brand-bronze text-[10px] uppercase tracking-[0.3em] block mb-6">Specificaties</span>
                            <ul className="space-y-6">
                                <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs text-white/40 uppercase tracking-widest">Techniek</span>
                                    <span className="font-serif text-lg">Kalei op maat</span>
                                </li>
                                <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs text-white/40 uppercase tracking-widest">Afwerking</span>
                                    <span className="font-serif text-lg">Hydrofuge</span>
                                </li>
                                <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs text-white/40 uppercase tracking-widest">Pigment</span>
                                    <span className="font-serif text-lg">Mineraal</span>
                                </li>
                                <li className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-xs text-white/40 uppercase tracking-widest">Team</span>
                                    <span className="font-serif text-lg">Vast team (2)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-8">
                            <p className="text-sm text-white/60 italic font-serif mb-8">
                                "Dit project is een perfect voorbeeld van hoe kalei een woning niet alleen beschermt, maar ook een volledig nieuwe ziel geeft."
                            </p>
                            <Link 
                                href="/offerte" 
                                className="w-full inline-flex items-center justify-center gap-3 bg-brand-bronze text-white py-5 uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-brand-dark transition-all duration-500 group"
                            >
                                Start uw project <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Dynamic Gallery Grid */}
      <section className="py-32 bg-brand-white">
        <div className="container mx-auto px-6 md:px-12">
            <div className="mb-24 text-center">
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-4 block">Galerij</span>
                <h2 className="font-serif text-4xl md:text-6xl text-brand-dark">Details in beeld</h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-8">
                {images.map((url: string, idx: number) => {
                    // Create a sophisticated editorial grid pattern
                    const isFull = idx % 7 === 0;
                    const isLarge = idx % 7 === 1 || idx % 7 === 4;
                    const isSmall = !isFull && !isLarge;
                    
                    return (
                        <div 
                            key={idx} 
                            className={cn(
                                "relative overflow-hidden bg-brand-dark/5 group",
                                isFull ? "col-span-12 aspect-[21/9]" : 
                                isLarge ? "col-span-12 md:col-span-8 aspect-video" : 
                                "col-span-12 md:col-span-4 aspect-square"
                            )}
                        >
                            <Image 
                                src={url} 
                                alt={`Project detail ${idx + 1}`} 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                unoptimized={url.includes('supabase.co')}
                            />
                            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Next Project Navigation */}
      <section className="py-32 bg-brand-dark text-brand-stone overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
            <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-8 block">Volgend Project</span>
            <Link href="/projecten" className="group inline-block">
                <h2 className="font-serif text-5xl md:text-8xl lg:text-9xl mb-12 group-hover:italic transition-all duration-700">
                    Ontdek meer <br/> <span className="text-brand-bronze">realisaties.</span>
                </h2>
                <div className="inline-flex items-center gap-4 text-brand-bronze border-b border-brand-bronze pb-2 group-hover:gap-8 transition-all duration-500">
                    <span className="uppercase text-xs tracking-widest">Bekijk portfolio</span>
                    <ChevronRight size={20} />
                </div>
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}