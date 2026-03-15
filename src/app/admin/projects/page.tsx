"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink, Loader2, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  year?: string;
  category?: string;
  image_url?: string;
  images?: string[];
  stats?: any;
  created_at: string;
  user_id: string;
}

const PROJECTS_PER_PAGE = 9;

export default function AdminProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Project>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const isAllSelected = useMemo(() => {
    const currentProjectsOnPage = projects.filter(project => {
      const matchesSearch = searchQuery ? (project.title.toLowerCase().includes(searchQuery.toLowerCase()) || (project.location?.toLowerCase().includes(searchQuery.toLowerCase())) || (project.category?.toLowerCase().includes(searchQuery.toLowerCase()))) : true;
      const matchesCategory = filterCategory !== 'all' ? project.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });
    return currentProjectsOnPage.length > 0 && currentProjectsOnPage.every(project => selectedProjects.has(project.id));
  }, [projects, selectedProjects, searchQuery, filterCategory]);
  const isAnySelected = selectedProjects.size > 0;


  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
      fetchCategories();
    }
  }, [user, authLoading, searchQuery, filterCategory, sortBy, sortOrder, currentPage]);

  const fetchProjects = async () => {
    setLoading(true);
    let query = supabase
      .from("projects")
      .select("*", { count: 'exact' });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }

    if (filterCategory !== 'all') {
      query = query.eq("category", filterCategory);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = (currentPage - 1) * PROJECTS_PER_PAGE;
    const to = from + PROJECTS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      toast.error("Fout bij ophalen projecten");
      console.error(error);
    } else {
      setProjects(data || []);
      setTotalProjectsCount(count || 0);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("projects").select("category");
    if (!error && data) {
      const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean) as string[]));
      setCategories(uniqueCategories);
    }
  };

  const totalPages = Math.ceil(totalProjectsCount / PROJECTS_PER_PAGE);

  const deleteProject = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit project wilt verwijderen?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Fout bij verwijderen");
    } else {
      toast.success("Project verwijderd");
      setProjects(projects.filter((p) => p.id !== id));
      setTotalProjectsCount(prev => prev - 1);
      setSelectedProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      fetchCategories(); // Refresh categories after deletion
    }
  };

  const handleSelectProject = (id: string, checked: boolean) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAllProjects = (checked: boolean) => {
    if (checked) {
      const currentProjectsOnPage = projects.filter(project => {
        const matchesSearch = searchQuery ? (project.title.toLowerCase().includes(searchQuery.toLowerCase()) || (project.location?.toLowerCase().includes(searchQuery.toLowerCase())) || (project.category?.toLowerCase().includes(searchQuery.toLowerCase()))) : true;
        const matchesCategory = filterCategory !== 'all' ? project.category === filterCategory : true;
        return matchesSearch && matchesCategory;
      });
      setSelectedProjects(new Set(currentProjectsOnPage.map(project => project.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const bulkDeleteProjects = async () => {
    if (!isAnySelected) return;
    if (!confirm(`Weet je zeker dat je ${selectedProjects.size} project(en) wilt verwijderen?`)) return;

    setLoading(true);
    const { error } = await supabase.from("projects").delete().in("id", Array.from(selectedProjects));

    if (error) {
      toast.error("Fout bij bulk verwijderen");
      console.error(error);
    } else {
      toast.success(`${selectedProjects.size} project(en) verwijderd`);
      setSelectedProjects(new Set());
      fetchProjects();
      fetchCategories();
    }
    setLoading(false);
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

        {/* Search, Filter, Sort Controls */}
        <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
            <Input
              placeholder="Zoek op titel, locatie of categorie..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
            />
          </div>

          <Select value={filterCategory} onValueChange={(val: string | 'all') => {
            setFilterCategory(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <Filter size={16} className="mr-2 text-brand-dark/40" />
              <SelectValue placeholder="Filter op categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle categorieën</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val: keyof Project) => setSortBy(val)}>
            <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <SelectValue placeholder="Sorteer op" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Datum</SelectItem>
              <SelectItem value="title">Titel</SelectItem>
              <SelectItem value="year">Jaar</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
          >
            {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>

        {/* Bulk Actions */}
        {isAnySelected && (
          <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
            <span className="text-sm text-brand-dark/60">{selectedProjects.size} geselecteerd</span>
            <Button
              variant="destructive"
              onClick={bulkDeleteProjects}
              className="rounded-none px-4 py-2 text-xs uppercase tracking-widest"
            >
              <Trash2 size={14} className="mr-2" /> Verwijder geselecteerde
            </Button>
          </div>
        )}

        <div className="grid gap-6">
          {projects.length === 0 && !loading ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Nog geen projecten toegevoegd.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 border border-brand-dark/5 flex items-center gap-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleSelectAllProjects(!!checked)}
                  className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
                />
                <span className="text-xs uppercase tracking-widest text-brand-dark/40">Selecteer alles op deze pagina</span>
              </div>

              {projects.map((project) => (
                <div key={project.id} className="bg-white p-6 border border-brand-dark/5 flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-6">
                    <Checkbox
                      checked={selectedProjects.has(project.id)}
                      onCheckedChange={(checked) => handleSelectProject(project.id, !!checked)}
                      className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
                    />
                    <div className="w-20 h-20 bg-brand-stone flex items-center justify-center overflow-hidden">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
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
              ))}
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
            >
              Vorige
            </Button>
            <span className="text-sm text-brand-dark/60">Pagina {currentPage} van {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
            >
              Volgende
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}