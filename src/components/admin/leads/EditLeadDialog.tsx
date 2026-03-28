"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Lead } from "@/hooks/use-leads";
import { cn } from "@/lib/utils";

interface EditLeadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingLead: Lead | null;
  setEditingLead: (lead: Lead) => void;
  onSave: () => void;
}

export const EditLeadDialog = ({
  isOpen,
  onOpenChange,
  editingLead,
  setEditingLead,
  onSave,
}: EditLeadDialogProps) => {
  if (!editingLead) return null;

  const handleSave = () => {
    // Validate required fields
    if (!editingLead.name.trim() || !editingLead.email.trim()) {
      alert('Naam en email zijn verplichte velden');
      return;
    }
    
    // Call the parent save function
    onSave();
    
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] max-h-[90vh] p-0 bg-brand-white border-brand-dark/5 rounded-none overflow-hidden">
        <DialogHeader className="p-6 border-b border-brand-dark/5">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="font-serif text-2xl">Aanvraag Bewerken</DialogTitle>
              <DialogDescription>Bewerk de details en status van deze aanvraag.</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-none hover:bg-brand-stone"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-8">
            {/* Contact Informatie - Top Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Naam</Label>
                <Input
                  id="name"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Email</Label>
                <Input
                  id="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Telefoon</Label>
                <Input
                  id="phone"
                  value={editingLead.phone || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                />
              </div>
            </div>

            {/* Locatie Informatie */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Postcode</Label>
                <Input
                  id="postalCode"
                  value={editingLead.postal_code || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, postal_code: e.target.value })}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Gemeente</Label>
                <Input
                  id="city"
                  value={editingLead.city || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, city: e.target.value })}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                />
              </div>
            </div>

            {/* Project Details - Landscape Layout on Desktop */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Project Type</Label>
                <Select
                  value={editingLead.project_type}
                  onValueChange={(val) => setEditingLead({ ...editingLead, project_type: val as Lead['project_type'] })}
                >
                  <SelectTrigger className="rounded-none border-brand-dark/10">
                    <SelectValue placeholder="Selecteer project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gevel">Gevel</SelectItem>
                    <SelectItem value="binnen">Binnen</SelectItem>
                    <SelectItem value="totaal">Totaal</SelectItem>
                    <SelectItem value="renovatie">Renovatie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Ondergrond Type</Label>
                <Select
                  value={editingLead.surface_type}
                  onValueChange={(val) => setEditingLead({ ...editingLead, surface_type: val as Lead['surface_type'] })}
                >
                  <SelectTrigger className="rounded-none border-brand-dark/10">
                    <SelectValue placeholder="Selecteer ondergrond type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baksteen">Baksteen</SelectItem>
                    <SelectItem value="crepi">Crepi</SelectItem>
                    <SelectItem value="onbekend">Onbekend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Status</Label>
                <Select
                  value={editingLead.status}
                  onValueChange={(val) => setEditingLead({ ...editingLead, status: val as Lead['status'] })}
                >
                  <SelectTrigger className="rounded-none border-brand-dark/10">
                    <SelectValue placeholder="Selecteer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nieuw">Nieuw</SelectItem>
                    <SelectItem value="gecontacteerd">Gecontacteerd</SelectItem>
                    <SelectItem value="offerte_verzonden">Offerte Verzonden</SelectItem>
                    <SelectItem value="gearchiveerd">Gearchiveerd</SelectItem>
                    <SelectItem value="afgewezen">Afgewezen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Opmerkingen Sectie */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Opmerkingen van klant</Label>
                <Textarea
                  id="comment"
                  value={editingLead.comment || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, comment: e.target.value })}
                  placeholder="Opmerkingen van de klant..."
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[10px] uppercase tracking-widest text-brand-dark/40">Interne Notities</Label>
                <Textarea
                  id="notes"
                  value={editingLead.notes || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  placeholder="Bijv. Afspraak gemaakt voor dinsdag..."
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 p-6 border-t border-brand-dark/5">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-colors"
          >
            <Save size={16} className="mr-2" /> Wijzigingen Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};