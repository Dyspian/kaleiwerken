"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  category?: string;
  year?: string;
  image_url?: string;
  created_at: string;
}

interface SortableProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

const SortableProjectItem = ({ project, onEdit, onDelete, isSelected, onSelect }: SortableProjectItemProps) => {
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
        "bg-white p-6 border border-brand-dark/5 shadow-sm transition-all hover:shadow-md flex items-center justify-between group",
        isDragging ? "opacity-50 scale-105 z-50" : "opacity-100"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(project.id, !!checked)}
            className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
          />
          <div 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-brand-stone/30 rounded-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} className="text-brand-dark/40" />
          </div>
        </div>
        
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
        <Button variant="outline" size="icon" onClick={() => onEdit(project)} className="rounded-none border-brand-dark/10 hover:bg-brand-stone">
          <Edit size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(project.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

interface DraggableProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  selectedProjects: Set<string>;
  onSelectProject: (id: string, checked: boolean) => void;
  onReorder: (projects: Project[]) => void;
}

export const DraggableProjectList = ({ 
  projects, 
  onEdit, 
  onDelete, 
  selectedProjects, 
  onSelectProject,
  onReorder 
}: DraggableProjectListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over?.id);
      
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      onReorder(newProjects);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={projects.map(p => p.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6">
          {projects.map((project) => (
            <SortableProjectItem
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
              isSelected={selectedProjects.has(project.id)}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};