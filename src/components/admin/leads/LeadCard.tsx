"use client";

import React from "react";
import { Mail, Phone, MapPin, Calendar, CheckCircle2, Circle, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Lead } from "@/hooks/use-leads";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export const LeadCard = ({ lead, onEdit, onDelete, isSelected, onSelect }: LeadCardProps) => {
  return (
    <div key={lead.id} className={cn(
      "bg-white p-8 border border-brand-dark/5 shadow-sm transition-all hover:shadow-md flex items-start gap-4",
      lead.status === 'gecontacteerd' || lead.status === 'offerte_verzonden' || lead.status === 'gearchiveerd' || lead.status === 'afgewezen' ? 'opacity-70' : 'opacity-100'
    )}>
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(lead.id, !!checked)}
        className="mt-1 border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-serif text-2xl">{lead.name}</h3>
              <span
                className={cn(
                  "flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 border",
                  lead.status === 'nieuw'
                    ? "border-brand-bronze text-brand-bronze"
                    : lead.status === 'gecontacteerd'
                      ? "border-blue-600 text-blue-600"
                      : lead.status === 'offerte_verzonden'
                        ? "border-purple-600 text-purple-600"
                        : lead.status === 'gearchiveerd'
                          ? "border-gray-600 text-gray-600"
                          : "border-red-600 text-red-600"
                )}
              >
                {lead.status === 'nieuw' ? <Circle size={10} /> : <CheckCircle2 size={10} />}
                {lead.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-brand-dark/40">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Mail size={14} /> {lead.email}</a>
              {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Phone size={14} /> {lead.phone}</a>}
              {lead.postal_code && <span className="flex items-center gap-1"><MapPin size={14} /> {lead.postal_code}</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(lead)} className="rounded-none border-brand-dark/10 hover:bg-brand-stone">
              <Edit size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDelete(lead.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-brand-dark/5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Project</span>
            <span className="capitalize font-medium">{lead.project_type}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Oppervlakte</span>
            <span className="font-medium">{lead.surface_area} m²</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ondergrond</span>
            <span className="capitalize font-medium">{lead.surface_type}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ontvangen</span>
            <span className="font-medium">{format(new Date(lead.created_at), "d MMM yyyy", { locale: nl })}</span>
          </div>
        </div>

        {lead.notes && (
          <div className="mt-6 p-4 bg-brand-stone/30 border-l-2 border-brand-bronze">
            <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-1">Interne Notities</span>
            <p className="text-sm text-brand-dark/70 italic">{lead.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};