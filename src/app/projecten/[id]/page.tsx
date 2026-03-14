import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notFound } from "next/navigation";

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
      
      <section className="h-[70vh] relative flex items-end pb-24 px-6 md:px-12 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/40 z-10" />
        {images.length > 0 ? (
            <img src={images[0]} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-bronze/20 opacity-50"></div>
        )}
        
        <div className="relative z-20 container mx-auto">
            <Link href="/projecten" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
            </Link>
            <h1 className="font-serif text-5xl md:text-8xl text-white leading-[0.9] mb-6">
                {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/60 text-sm font-mono uppercase tracking-widest">
                {project.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-bronze" /> {project.location}</span>}
                {project.year && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-bronze" /> {project.year}</span>}
            </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
            <div className="lg:col-span-4 space-y-12">
                <div className="border-t border-brand-dark/10 pt-8">
                    <span className="block text-xs uppercase tracking-widest text-brand-bronze mb-4">Project Info</span>
                    <p className="font-serif text-3xl leading-tight text-brand-dark mb-8">
                        {project.subtitle}
                    </p>
                    <div className="space-y-6">
                        <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                            <span className="text-sm text-brand-dark/50">Categorie</span>
                            <span className="text-sm font-medium">{project.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8">
                <div className="prose prose-lg prose-headings:font-serif prose-p:font-light prose-p:leading-loose text-brand-dark/80 max-w-none">
                    <p className="whitespace-pre-wrap">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>

        {/* Gallery Grid */}
        {images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {images.slice(1).map((url: string, idx: number) => (
                    <div key={idx} className="aspect-[4/3] overflow-hidden bg-brand-dark/5 border border-brand-dark/5">
                        <img 
                            src={url} 
                            alt={`${project.title} detail ${idx + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                ))}
            </div>
        )}
      </section>

      <Footer />
    </main>
  );
}