"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Save, RotateCcw } from "lucide-react";

interface ReorderControlsProps {
  isReordering: boolean;
  onToggleReorder: () => void;
  onSaveOrder: () => void;
  onResetOrder: () => void;
  hasChanges: boolean;
}

export const ReorderControls = ({ 
  isReordering, 
  onToggleReorder, 
  onSaveOrder, 
  onResetOrder, 
  hasChanges 
}: ReorderControlsProps) => {
  return (
    <div className="bg-white p-4 border border-brand-dark/5 shadow-sm mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant={isReordering ? "default" : "outline"}
          onClick={onToggleReorder}
          className="rounded-none"
        >
          <ArrowUpDown size={16} className="mr-2" />
          {isReordering ? "Stop met herschikken" : "Herschik projecten"}
        </Button>
        
        {isReordering && (
          <p className="text-sm text-brand-dark/60">
            Sleep projecten om de volgorde te wijzigen
          </p>
        )}
      </div>

      {isReordering && hasChanges && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onResetOrder}
            className="rounded-none border-brand-dark/10"
          >
            <RotateCcw size={16} className="mr-2" />
            Herstel
          </Button>
          <Button
            onClick={onSaveOrder}
            className="rounded-none bg-brand-bronze hover:bg-brand-bronze/90"
          >
            <Save size={16} className="mr-2" />
            Volgorde Opslaan
          </Button>
        </div>
      )}
    </div>
  );
};