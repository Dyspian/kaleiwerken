"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useProjectOrdering = (projects: Project[]) => {
  const [isReordering, setIsReordering] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<Project[]>(projects);
  const [originalOrder, setOriginalOrder] = useState<Project[]>(projects);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setOrderedProjects(projects);
    if (!isReordering) {
      setOriginalOrder(projects);
    }
  }, [projects, isReordering]);

  const toggleReordering = () => {
    if (isReordering) {
      // Cancel reordering - restore original order
      setOrderedProjects(originalOrder);
      setHasChanges(false);
    } else {
      // Start reordering - save current order as original
      setOriginalOrder(orderedProjects);
    }
    setIsReordering(!isReordering);
  };

  const handleReorder = (newOrder: Project[]) => {
    setOrderedProjects(newOrder);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    try {
      // Update sort_order for each project
      const updates = orderedProjects.map((project, index) => ({
        id: project.id,
        sort_order: index
      }));

      const { error } = await supabase
        .from('projects')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      toast.success("Volgorde succesvol opgeslagen!");
      setHasChanges(false);
      setIsReordering(false);
    } catch (error: any) {
      toast.error("Fout bij opslaan volgorde: " + error.message);
    }
  };

  const resetOrder = () => {
    setOrderedProjects(originalOrder);
    setHasChanges(false);
  };

  return {
    isReordering,
    orderedProjects,
    hasChanges,
    toggleReordering,
    handleReorder,
    saveOrder,
    resetOrder
  };
};