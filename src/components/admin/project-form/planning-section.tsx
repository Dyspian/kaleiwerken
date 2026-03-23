"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProjectFormValues } from "./project-form";
import { Label } from "@/components/ui/label";

interface PlanningSectionProps {
  watch: UseFormWatch<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
}

export const PlanningSection = ({ watch, setValue }: PlanningSectionProps) => {
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const planningStatus = watch("planning_status");

  return (
    <div className="space-y-8 pt-8 border-t border-brand-dark/5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-brand-bronze" />
        <h3 className="font-serif text-xl">Planning & Status</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Startdatum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal rounded-none border-brand-dark/10",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Kies een datum</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-brand-dark/10 rounded-none" align="start">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => setValue("start_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Einddatum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal rounded-none border-brand-dark/10",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Kies een datum</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-brand-dark/10 rounded-none" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => setValue("end_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Status</Label>
          <Select value={planningStatus} onValueChange={(value: "pending" | "in_progress" | "completed" | "cancelled") => setValue("planning_status", value)}>
            <SelectTrigger className="rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <SelectValue placeholder="Selecteer status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">In Afwachting</SelectItem>
              <SelectItem value="in_progress">Bezig</SelectItem>
              <SelectItem value="completed">Voltooid</SelectItem>
              <SelectItem value="cancelled">Geannuleerd</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};