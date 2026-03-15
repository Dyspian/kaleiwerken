"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Lead } from "@/hooks/use-leads";

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-brand-white border-brand-dark/5 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Aanvraag Bewerken</DialogTitle>
          <DialogDescription>Bewerk de details en status van deze aanvraag.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam</Label>
              <Input
                id="name"
                value={editingLead.name}
                onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                className="rounded-none border-brand-dark/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                  className="rounded-none border-brand-dark/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  value={editingLead.phone || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                  className="rounded-none border-brand-dark/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postcode</Label>
              <Input
                id="postalCode"
                value={editingLead.postal_code || ''}
                onChange={(e) => setEditingLead({ ...editingLead, postal_code: e.target.value })}
                className="rounded-none border-brand-dark/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
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
              <Label htmlFor="surfaceArea">Oppervlakte (m²)</Label>
              <Input
                id="surfaceArea"
                value={editingLead.surface_area}
                onChange={(e) => setEditingLead({ ...editingLead, surface_area: e.target.value })}
                className="rounded-none border-brand-dark/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surfaceType">Ondergrond Type</Label>
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
              <Label htmlFor="timing">Timing</Label>
              <Select
                value={editingLead.timing}
                onValueChange={(val) => setEditingLead({ ...editingLead, timing: val as Lead['timing'] })}
              >
                <SelectTrigger className="rounded-none border-brand-dark/10">
                  <SelectValue placeholder="Selecteer timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">Zo snel mogelijk</SelectItem>
                  <SelectItem value="1-3_maanden">Binnen 1-3 maanden</SelectItem>
                  <SelectItem value="later">Later dit jaar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
            <div className="space-y-2">
              <Label htmlFor="notes">Interne Notities</Label>
              <Textarea
                id="notes"
                value={editingLead.notes || ''}
                onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                placeholder="Bijv. Afspraak gemaakt voor dinsdag..."
                className="rounded-none border-brand-dark/10 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none border-brand-dark/10">
            Annuleren
          </Button>
          <Button onClick={onSave} className="bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-colors">
            <Save size={16} className="mr-2" /> Wijzigingen Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};