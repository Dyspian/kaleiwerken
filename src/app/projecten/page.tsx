import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const revalidate = 0;

export default async function ProjectenPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "alle") {
    query = query.eq("category", category);
  }

  const { data: projects } = await query;

  // Haal unieke categorieën op voor de filters
  const { data: allProjects } = await supabase.from("projects").select("category");
  const categories = ["alle", ...Array.from(new Set(allProjects?.map(p => p.category).filter(Boolean)))];

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      <section className="pt-40 md:pt-52 pb-24 px-6 md:px-12 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-dark/10 pb-12 mb-12">
            <div>
                <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Portfolio</span>
                <h1 className="font-serif text-5xl md:text-8xl leading-[0.9] text-brand-dark">
                    Onze <br/><span className="italic text-brand-bronze">Realisaties.</span>
                </h1>
            </div>
            
            <div className="mt-12 md:mt-0">
                <p className="text-xl text-brand-dark/60 max-w-sm font-light leading-relaxed mb-8">
                    Een selectie van projecten waar vakmanschap en esthetiek samenkomen.
                </p>
                
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={cat === "alle" ? "/projecten" : `/projecten?category=${cat}`}
                            className={cn(
                                "px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300",
                                (category === cat || (!category && cat === "alle"))
                                    ? "bg-brand-dark text-white border-brand-dark"
                                    : "border-brand-dark/10 text-brand-dark/40 hover:border-brand-bronze hover:text-brand-bronze"
                            )}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
            {!projects || projects.length === 0 ? (
                <div className="col-span-2 py-24 text-center">
                    <p className="text-brand-dark/40 italic">Geen projecten gevonden in deze categorie.</p>
                </div>
            ) : (
                projects.map((project) => (
                    <Link 
                        key={project.id} 
                        href={`/projecten/${project.id}`} 
                        className="group relative block overflow-hidden"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-brand-dark/5">
                            {project.image_url ? (
                                <Image 
                                    src={project.image_url} 
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    unoptimized={project.image_url.includes('supabase.co')}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-brand-bronze/10 flex items-center justify-center">
                                    <span className="text-brand-dark/20 font-serif italic">Geen afbeelding</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-brand-dark opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                            
                            <div className="absolute top-4 left-4 font-mono text-xs uppercase tracking-widest text-brand-dark bg-brand-stone px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                {project.category}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4 group-hover:border-brand-bronze transition-colors duration-500">
                            <h3 className="font-serif text-3xl font-medium leading-[0.9] group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                            <span className="text-xs font-mono text-brand-dark/40 group-hover:text-brand-bronze transition-colors">{project.year}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                            <span className="text-xs uppercase tracking-widest text-brand-bronze">Bekijk project</span>
                            <ArrowUpRight className="w-4 h-4 text-brand-bronze group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </Link>
                ))
            )}
        </div>
      </section>

      <Footer />
    </main>
  );
}