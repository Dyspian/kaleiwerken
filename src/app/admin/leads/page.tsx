"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default function AdminLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeads();
    }
  }, [user, authLoading]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fout bij ophalen aanvragen");
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <aside className="w-64 bg-brand-dark text-brand-stone p-8 flex flex-col">
        <div className="mb-12">
          <h2 className="font-serif text-xl italic">Van Roey Admin</h2>
        </div>
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center gap-3 hover:text-brand-bronze transition-colors">
            Overzicht
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 hover:text-brand-bronze transition-colors">
            Projecten
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 text-brand-bronze">
            Aanvragen
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="font-serif text-4xl mb-2">Offerte Aanvragen</h1>
          <p className="text-brand-dark/60">Bekijk en beheer binnengekomen leads.</p>
        </header>

        <div className="grid gap-6">
          {leads.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Nog geen aanvragen ontvangen.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="bg-white p-8 border border-brand-dark/5 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-serif text-2xl mb-1">{lead.name}</h3>
                    <div className="flex gap-4 text-sm text-brand-dark/40">
                        <span className="flex items-center gap-1"><Mail size={14} /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={14} /> {lead.phone}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {lead.postal_code}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ontvangen op</span>
                    <span className="text-sm font-mono">{format(new Date(lead.created_at), "d MMMM yyyy", { locale: nl })}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-8 pt-6 border-t border-brand-dark/5">
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
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Timing</span>
                        <span className="font-medium">{lead.timing.replace('_', ' ')}</span>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}