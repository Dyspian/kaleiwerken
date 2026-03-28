"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface DragDropProviderProps {
  children: React.ReactNode;
  items: string[]; // Array of IDs
  onReorder: (newOrderIds: string[]) => void;
  disabled?: boolean;
}

export const DragDropProvider = ({ children, items, onReorder, disabled }: DragDropProviderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Voorkomt per ongeluk slepen bij klikken
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;
    
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};