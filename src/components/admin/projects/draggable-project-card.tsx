"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
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
  start_date?: string;
  end_date?: string;
  planning_status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface DraggableProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export const DraggableProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelect 
}: DraggableProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-6 border border-brand-dark/5 flex items-center justify-between group hover:shadow-md transition-shadow",
        isDragging ? "opacity-50 scale-105 z-50" : "opacity-100"
      )}
    >
      <div className="flex items-center gap-6">
        <div 
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-brand-stone/30 rounded-none transition-colors"
          {...attributes}
          {...listeners}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-brand-dark/40">
            <circle cx="5" cy="5" r="2" fill="currentColor" />
            <circle cx="15" cy="5" r="2" fill="currentColor" />
            <circle cx="5" cy="15" r="2" fill="currentColor" />
            <circle cx="15" cy="15" r="2" fill="currentColor" />
          </svg>
        </div>
        
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(project.id, !!checked)}
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
        <Button variant="outline" size="icon" onClick={() => onDelete(project.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};