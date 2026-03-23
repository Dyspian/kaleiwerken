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
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Image as ImageIcon, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortableImageItemProps {
  url: string;
  index: number;
  isHero: boolean;
  onRemove: (index: number) => void;
  onSetAsHero: (url: string) => void;
}

const SortableImageItem = ({ url, index, isHero, onRemove, onSetAsHero }: SortableImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-brand-dark/5 border group cursor-move",
        isDragging ? "opacity-50 scale-105 z-50" : "opacity-100",
        isHero ? "border-brand-bronze ring-2 ring-brand-bronze" : "border-brand-dark/5"
      )}
    >
      <img src={url} alt={`Project image ${index + 1}`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Drag handle */}
      <div 
        className="absolute top-2 left-2 bg-brand-dark/80 text-white p-1.5 rounded-none opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Move size={14} />
      </div>

      {/* Hero badge */}
      {isHero && (
        <div className="absolute top-2 right-2 bg-brand-bronze text-white text-[8px] uppercase tracking-widest px-2 py-1 flex items-center gap-1">
          <ImageIcon size={10} /> Banner Foto
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSetAsHero(url)}
          className="flex-1 bg-white/90 text-brand-dark rounded-none text-[10px] py-1 px-2 hover:bg-white"
        >
          {isHero ? "Banner" : "Als banner"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onRemove(index)}
          className="rounded-none p-1 h-6 w-6"
        >
          <X size={12} />
        </Button>
      </div>
    </div>
  );
};

interface DraggableImageGalleryProps {
  images: string[];
  heroImage: string | null;
  onImagesChange: (images: string[]) => void;
  onSetAsHero: (url: string) => void;
  onRemoveImage: (index: number) => void;
}

export const DraggableImageGallery = ({ 
  images, 
  heroImage, 
  onImagesChange, 
  onSetAsHero, 
  onRemoveImage 
}: DraggableImageGalleryProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over?.id as string);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      onImagesChange(newImages);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={images} 
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <SortableImageItem
              key={url}
              url={url}
              index={index}
              isHero={heroImage === url}
              onRemove={onRemoveImage}
              onSetAsHero={onSetAsHero}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};