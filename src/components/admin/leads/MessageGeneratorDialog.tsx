"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, MessageSquare, Mail, ExternalLink, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Lead } from "@/hooks/use-leads";

interface MessageGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

type TemplateType = 'email_initial' | 'whatsapp_visit' | 'email_followup';

const postcodeMapping: Record<string, string> = {
  "2000": "Antwerpen",
  "2018": "Antwerpen",
  "2020": "Antwerpen",
  "2060": "Antwerpen",
  "2100": "Deurne",
  "2140": "Borgerhout",
  "2170": "Merksem",
  "2180": "Ekeren",
  "2600": "Berchem",
  "2610": "Wilrijk",
  "2660": "Hoboken",
  "2900": "Schoten",
  "2930": "Brasschaat",
  "2970": "Schilde",
  "2500": "Lier",
  "2520": "Ranst",
  "2540": "Hove",
  "2550": "Kontich",
  "2240": "Zandhoven",
  "2242": "Pulderbos",
  "2243": "Pulle",
};

export const MessageGeneratorDialog = ({ isOpen, onOpenChange, lead }: MessageGeneratorDialogProps) => {
  const [template, setTemplate] = useState<TemplateType>('email_initial');
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const getCity = (leadData: Lead) => {
    if (leadData.city) return leadData.city;
    if (leadData.postal_code && postcodeMapping[leadData.postal_code]) {
      return postcodeMapping[leadData.postal_code];
    }
    return leadData.postal_code || "uw regio";
  };

  const generateMessage = (type: TemplateType, leadData: Lead) => {
    const firstName = leadData.name.split(' ')[0];
    const projectType = leadData.project_type.toLowerCase();
    const city = getCity(leadData);
    const postalCode = leadData.postal_code || "";
    const location = postalCode ? `${postalCode} ${city}` : city;
    const area = leadData.surface_area;

    switch (type) {
      case 'email_initial':
        return `Beste ${firstName},

Bedankt voor uw aanvraag bij Van Roey Kaleiwerken voor uw project in ${location}.

We hebben uw gegevens goed ontvangen met betrekking tot het ${projectType} project (ca. ${area} m²). Graag zouden we een moment inplannen om ter plaatse te komen kijken, zodat we een nauwkeurige offerte kunnen opstellen die perfect aansluit bij uw wensen.

Wanneer zou het voor u passen om even af te spreken?

Met vriendelijke groeten,

Van Roey Kaleiwerken
www.vanroey-kalei.be`;

      case 'whatsapp_visit':
        return `Dag ${firstName}, ik ben het van Van Roey Kaleiwerken. Ik zag uw aanvraag voor het kaleien van uw ${projectType} in ${location}. Wanneer past het voor u dat ik even langskom voor een korte opmeting en kleuradvies? Mvg, Van Roey`;

      case 'email_followup':
        return `Beste ${firstName},

Onlangs hebben we contact gehad over uw ${projectType} project in ${location}. 

Ik wilde even horen of u nog vragen heeft over onze werkwijze of de mogelijkheden van kalei voor uw woning. We helpen u graag verder om tot het gewenste resultaat te komen.

Laat gerust iets weten als we nog iets voor u kunnen betekenen.

Met vriendelijke groeten,

Van Roey Kaleiwerken`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (lead) {
      setMessage(generateMessage(template, lead));
    }
  }, [template, lead]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast.success("Bericht gekopieerd naar klembord");
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    if (!lead?.phone) {
      toast.error("Geen telefoonnummer beschikbaar");
      return;
    }
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openGmail = () => {
    if (!lead?.email) return;
    const subject = `Aanvraag Kaleiwerken - ${lead.name}`;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openOutlook = () => {
    if (!lead?.email) return;
    const subject = `Aanvraag Kaleiwerken - ${lead.name}`;
    const url = `https://outlook.office.com/mail/deeplink/compose?to=${lead.email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-brand-white border-brand-dark/5 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Bericht Generator</DialogTitle>
          <DialogDescription>Genereer een gepersonaliseerd bericht voor {lead.name}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Kies een template</label>
            <Select value={template} onValueChange={(val) => setTemplate(val as TemplateType)}>
              <SelectTrigger className="rounded-none border-brand-dark/10 bg-white">
                <SelectValue placeholder="Selecteer template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email_initial">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-brand-bronze" /> Eerste Contact (E-mail)
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp_visit">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-green-600" /> Afspraak Inplannen (WhatsApp/SMS)
                  </div>
                </SelectItem>
                <SelectItem value="email_followup">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-brand-bronze" /> Opvolging (E-mail)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Gegenereerd Bericht</label>
            <Textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[250px] rounded-none border-brand-dark/10 bg-white font-sans text-sm leading-relaxed p-4"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-4 sm:flex-col">
          <Button 
            onClick={handleCopy} 
            className="w-full bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-all py-6 uppercase text-[10px] tracking-widest"
          >
            {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
            {copied ? "Gekopieerd" : "Kopieer naar klembord"}
          </Button>

          <div className="grid grid-cols-3 gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={openWhatsApp}
              className="rounded-none border-brand-dark/10 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all py-6 text-[10px] uppercase tracking-widest flex flex-col h-auto gap-2"
            >
              <MessageCircle size={18} />
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              onClick={openGmail}
              className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all py-6 text-[10px] uppercase tracking-widest flex flex-col h-auto gap-2"
            >
              <Mail size={18} />
              Gmail
            </Button>
            <Button 
              variant="outline" 
              onClick={openOutlook}
              className="rounded-none border-brand-dark/10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all py-6 text-[10px] uppercase tracking-widest flex flex-col h-auto gap-2"
            >
              <ExternalLink size={18} />
              Outlook
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};