"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, GripVertical } from "lucide-react";
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
  isReordering: boolean;
}

export const DraggableProjectCard = ({ 
  project, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelect,
  isReordering
}: DraggableProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: project.id,
    disabled: !isReordering 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-6 border border-brand-dark/5 flex items-center justify-between group transition-all",
        isDragging ? "opacity-50 scale-[1.02] z-50 shadow-xl border-brand-bronze" : "opacity-100",
        isReordering && "hover:border-brand-bronze/30"
      )}
    >
      <div className="flex items-center gap-6">
        <div 
          className={cn(
            "p-2 rounded-none transition-all",
            isReordering 
              ? "cursor-grab active:cursor-grabbing text-brand-bronze bg-brand-bronze/5" 
              : "text-brand-dark/10 cursor-not-allowed"
          )}
          {...(isReordering ? attributes : {})}
          {...(isReordering ? listeners : {})}
        >
          <GripVertical size={20} />
        </div>
        
        {!isReordering && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(project.id, !!checked)}
            className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
          />
        )}
        
        <div className="w-20 h-20 bg-brand-stone flex items-center justify-center overflow-hidden border border-brand-dark/5">
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

      {!isReordering && (
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
      )}
    </div>
  );
};