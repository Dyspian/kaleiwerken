"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
    }
  }, [user, authLoading]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fout bij ophalen projecten");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit project wilt verwijderen?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Fout bij verwijderen");
    } else {
      toast.success("Project verwijderd");
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <AdminSidebar />

      <main className="flex-1 p-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-serif text-4xl mb-2">Projecten</h1>
            <p className="text-brand-dark/60">Beheer de realisaties op de website.</p>
          </div>
          <Button asChild className="bg-brand-dark text-white rounded-none px-6">
            <Link href="/admin/projects/new">
              <Plus size={18} className="mr-2" /> Nieuw Project
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {projects.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Nog geen projecten toegevoegd.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white p-6 border border-brand-dark/5 flex items-center justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-brand-stone flex items-center justify-center overflow-hidden">
                    {project.image_url ? (
                      <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-brand-dark/20">Geen foto</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl">{project.title}</h3>
                    <p className="text-sm text-brand-dark/40">{project.category} — {project.year}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild className="rounded-none border-brand-dark/10 hover:bg-brand-stone">
                    <Link href={`/projecten/${project.id}`} target="_blank">
                      <ExternalLink size={16} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild className="rounded-none border-brand-dark/10 hover:bg-brand-stone">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit size={16} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deleteProject(project.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}