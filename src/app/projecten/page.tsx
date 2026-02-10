import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: 1, title: "Villa Berchem", category: "Renovatie", year: "2023", image: "bg-brand-dark/5" },
  { id: 2, title: "Herenhuis Gent", category: "Gevelrestauratie", year: "2023", image: "bg-brand-bronze/10" },
  { id: 3, title: "Modern Hoeve", category: "Kalei & Schilder", year: "2022", image: "bg-brand-dark/10" },
  { id: 4, title: "Loft Antwerpen", category: "Interieur", year: "2022", image: "bg-brand-stone/50" },
  { id: 5, title: "Kasteelpark", category: "Totaalrenovatie", year: "2022", image: "bg-brand-bronze/5" },
  { id: 6, title: "De Schuur", category: "Nieuwbouw", year: "2021", image: "bg-brand-dark/5" }
];

export default function ProjectenPage() {
  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      {/* Editorial Header */}
      <section className="pt-40 md:pt-52 pb-24 px-6 md:px-12 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-dark/10 pb-12 mb-12">
            <div>
                <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Portfolio</span>
                <h1 className="font-serif text-5xl md:text-8xl leading-[0.9] text-brand-dark">
                    Onze <br/><span className="italic text-brand-bronze">Realisaties.</span>
                </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-brand-dark/60 max-w-sm font-light leading-relaxed mt-12 md:mt-0 text-right md:text-left self-end">
                Een selectie van projecten waar vakmanschap en esthetiek samenkomen.
            </p>
        </div>

        {/* Minimal Filters */}
        <div className="flex flex-wrap gap-8 md:gap-12 mb-20 text-sm uppercase tracking-widest font-medium text-brand-dark/40">
            <button className="text-brand-dark border-b border-brand-dark pb-1 transition-colors">Alles</button>
            {['Renovatie', 'Nieuwbouw', 'Interieur', 'Restauratie'].map((cat) => (
                <button key={cat} className="hover:text-brand-bronze hover:border-brand-bronze border-b border-transparent pb-1 transition-all duration-300">
                    {cat}
                </button>
            ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
            {projects.map((project, idx) => (
                <Link 
                    key={project.id} 
                    href={`/projecten/${project.id}`} 
                    className="group relative block overflow-hidden"
                >
                    {/* Image Aspect Ratio */}
                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-brand-dark/5">
                        <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 ${project.image}`}></div>
                        <div className="absolute inset-0 bg-brand-dark opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                        
                        {/* Hover Overlay Text */}
                        <div className="absolute top-4 left-4 font-mono text-xs uppercase tracking-widest text-brand-dark bg-brand-stone px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {project.category}
                        </div>
                    </div>
                    
                    {/* Minimal Info */}
                    <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4 group-hover:border-brand-bronze transition-colors duration-500">
                        <h3 className="font-serif text-3xl font-medium leading-[0.9] group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                        <span className="text-xs font-mono text-brand-dark/40 group-hover:text-brand-bronze transition-colors">{project.year}</span>
                    </div>

                    <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                        <span className="text-xs uppercase tracking-widest text-brand-bronze">Bekijk project</span>
                        <ArrowUpRight className="w-4 h-4 text-brand-bronze group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </Link>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}