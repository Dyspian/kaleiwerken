import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const revalidate = 0;

export default async function ProjectenPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const dict = await getDictionary(locale) as any;

  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category !== "alle") {
    query = query.eq("category", category);
  }

  const { data: projects } = await query;

  const { data: allProjects } = await supabase.from("projects").select("category");
  const categories = ["alle", ...Array.from(new Set(allProjects?.map(p => p.category).filter(Boolean)))];

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header dict={dict} />
      
      <section className="pt-32 md:pt-40 pb-20 px-6 md:px-12 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-dark/10 pb-8 mb-12">
            <div className="max-w-xl">
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-4 block">{dict.projects.tag}</span>
                <h1 className="font-serif text-4xl md:text-6xl leading-tight text-brand-dark mb-4">
                    {dict.projects.title.split(' ').map((word: string, i: number) => (
                        word.toLowerCase() === 'realisaties.' ? <span key={i} className="italic text-brand-bronze"> {word}</span> : <span key={i}> {word}</span>
                    ))}
                </h1>
                <p className="text-sm text-brand-dark/60 font-light leading-relaxed">
                    {dict.projects.subtitle}
                </p>
            </div>
            
            <div className="mt-8 md:mt-0 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={cat === "alle" ? `/${locale}/projecten` : `/${locale}/projecten?category=${cat}`}
                        className={cn(
                            "px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] border transition-all duration-500",
                            (category === cat || (!category && cat === "alle"))
                                ? "bg-brand-dark text-white border-brand-dark"
                                : "border-brand-dark/10 text-brand-dark/40 hover:border-brand-bronze hover:text-brand-bronze"
                        )}
                    >
                        {cat === "alle" ? dict.projects.all : cat}
                    </Link>
                ))}
            </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {!projects || projects.length === 0 ? (
                <div className="col-span-full py-24 text-center">
                    <p className="text-brand-dark/40 italic font-serif">Geen projecten gevonden.</p>
                </div>
            ) : (
                projects.map((project) => (
                    <Link 
                        key={project.id} 
                        href={`/${locale}/projecten/${project.id}`} 
                        className="group block"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-brand-dark/5 border border-brand-dark/5">
                            {project.image_url ? (
                                <Image 
                                    src={project.image_url} 
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    unoptimized={project.image_url.includes('supabase.co')}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/20">Geen beeld</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-serif text-xl group-hover:text-brand-bronze transition-colors duration-500">{project.title}</h3>
                                <ArrowUpRight className="w-4 h-4 text-brand-dark/20 group-hover:text-brand-bronze group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-dark/40">
                                <span>{project.category}</span>
                                <span>{project.year}</span>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
      </section>

      <Footer dict={dict} />
    </main>
  );
}