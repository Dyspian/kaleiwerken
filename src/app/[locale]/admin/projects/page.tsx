"use client";

import { useState, useEffect, useMemo } from "react";
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
import { DraggableProjectCard } from "@/components/admin/projects/draggable-project-card";
import { DragDropProvider } from "@/components/admin/projects/drag-drop-provider";
import { ReorderControls } from "@/components/admin/projects/reorder-controls";
import { useProjectOrdering } from "@/hooks/use-project-ordering";

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
  start_date?: string;
  end_date?: string;
  planning_status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  sort_order?: number;
}

const PROJECTS_PER_PAGE = 50;

export default function AdminProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Project>('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjectsCount, setTotalProjectsCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const {
    isReordering,
    orderedProjects,
    hasChanges,
    isSaving,
    toggleReordering,
    handleReorder,
    saveOrder,
    resetOrder
  } = useProjectOrdering<Project>(projects);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
      fetchCategories();
    }
  }, [user, authLoading, searchQuery, filterCategory, sortBy, sortOrder, currentPage, isReordering]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("projects")
        .select("*", { count: 'exact' });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }

      if (filterCategory !== 'all') {
        query = query.eq("category", filterCategory);
      }

      if (isReordering) {
        query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        if (sortBy === 'sort_order') {
          query = query.order('created_at', { ascending: false });
        }
      }

      const from = (currentPage - 1) * PROJECTS_PER_PAGE;
      const to = from + PROJECTS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Fout bij ophalen projecten");
      } else {
        // Initialize sort_order for projects that don't have it
        const projectsWithSortOrder = (data || []).map((project, index) => ({
          ...project,
          sort_order: project.sort_order ?? index
        }));
        
        setProjects(projectsWithSortOrder);
        setTotalProjectsCount(count || 0);
      }
    } catch (error: any) {
      console.error("Exception fetching projects:", error);
      toast.error("Fout bij ophalen projecten: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from("projects").select("category");
      if (data) {
        const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean) as string[]));
        setCategories(uniqueCategories);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSaveOrder = async () => {
    try {
      const success = await saveOrder();
      if (success) {
        await fetchProjects();
      }
    } catch (error: any) {
      console.error("Error in handleSaveOrder:", error);
      toast.error("Fout bij opslaan volgorde: " + error.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit project wilt verwijderen?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        console.error("Error deleting project:", error);
        toast.error("Fout bij verwijderen");
      } else {
        toast.success("Project verwijderd");
        fetchProjects();
      }
    } catch (error: any) {
      console.error("Exception deleting project:", error);
      toast.error("Fout bij verwijderen: " + error.message);
    }
  };

  const handleSelectProject = (id: string, checked: boolean) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  };

  const handleSelectAllProjects = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const bulkDeleteProjects = async () => {
    if (!isAnySelected) return;
    if (!confirm(`Weet je zeker dat je ${selectedProjects.size} project(en) wilt verwijderen?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("projects").delete().in("id", Array.from(selectedProjects));
      if (error) {
        console.error("Error bulk deleting projects:", error);
        toast.error("Fout bij bulk verwijderen");
      } else {
        toast.success("Projecten verwijderd");
        setSelectedProjects(new Set());
        fetchProjects();
      }
    } catch (error: any) {
      console.error("Exception bulk deleting projects:", error);
      toast.error("Fout bij bulk verwijderen: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected = useMemo(() => {
    if (projects.length === 0) return false;
    return projects.every(project => selectedProjects.has(project.id));
  }, [projects, selectedProjects]);
  
  const isAnySelected = selectedProjects.size > 0;
  const totalPages = Math.ceil(totalProjectsCount / PROJECTS_PER_PAGE);

  if (authLoading || (loading && projects.length === 0)) {
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
          {!isReordering && (
            <Button asChild className="bg-brand-dark text-white rounded-none px-6">
              <Link href="/admin/projects/new">
                <Plus size={18} className="mr-2" /> Nieuw Project
              </Link>
            </Button>
          )}
        </div>

        <ReorderControls
          isReordering={isReordering}
          onToggleReorder={toggleReordering}
          onSaveOrder={handleSaveOrder}
          onResetOrder={resetOrder}
          hasChanges={hasChanges}
          isSaving={isSaving}
        />

        {!isReordering && (
          <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
              <Input
                placeholder="Zoek op titel, locatie of categorie..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10 rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
              />
            </div>

            <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
              <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10">
                <Filter size={16} className="mr-2 text-brand-dark/40" />
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10">
                <SelectValue placeholder="Sorteer op" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sort_order">Eigen volgorde</SelectItem>
                <SelectItem value="created_at">Datum toegevoegd</SelectItem>
                <SelectItem value="title">Titel</SelectItem>
                <SelectItem value="year">Jaar project</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="rounded-none border-brand-dark/10"
            >
              {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        )}

        {isAnySelected && !isReordering && (
          <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
            <span className="text-sm text-brand-dark/60">{selectedProjects.size} geselecteerd</span>
            <Button variant="destructive" onClick={bulkDeleteProjects} className="rounded-none px-4 py-2 text-xs uppercase tracking-widest">
              <Trash2 size={14} className="mr-2" /> Verwijder geselecteerde
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          {!isReordering && projects.length > 0 && (
            <div className="bg-white p-4 border border-brand-dark/5 flex items-center gap-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAllProjects(!!checked)}
                className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
              />
              <span className="text-xs uppercase tracking-widest text-brand-dark/40">Selecteer alles op deze pagina</span>
            </div>
          )}

          <DragDropProvider 
            items={orderedProjects.map(p => p.id)} 
            onReorder={(newOrderIds) => {
              const newOrderedProjects = newOrderIds.map(id => orderedProjects.find(p => p.id === id)!);
              handleReorder(newOrderedProjects);
            }}
            disabled={!isReordering}
          >
            {orderedProjects.map((project) => (
              <DraggableProjectCard
                key={project.id}
                project={project}
                onEdit={() => {}} // Not used in this context
                onDelete={deleteProject}
                isSelected={selectedProjects.has(project.id)}
                onSelect={handleSelectProject}
                isReordering={isReordering}
              />
            ))}
          </DragDropProvider>
        </div>

        {totalPages > 1 && !isReordering && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-none border-brand-dark/10">Vorige</Button>
            <span className="text-sm text-brand-dark/60">Pagina {currentPage} van {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-none border-brand-dark/10">Volgende</Button>
          </div>
        )}
      </main>
    </div>
  );
}