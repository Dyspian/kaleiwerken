"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Globe } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/i18n-config";

export default function AdminContentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || 'nl';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    hero: { title1: "", title2: "", subtitle: "" }
  });

  useEffect(() => {
    if (user) fetchContent();
  }, [user, currentLocale]);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('locale', currentLocale)
      .maybeSingle();

    if (data?.content) {
      setContent(data.content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        locale: currentLocale, 
        content: content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'locale' });

    if (error) {
      toast.error("Fout bij opslaan: " + error.message);
    } else {
      toast.success("Content bijgewerkt! Vernieuw de homepage om de wijzigingen te zien.");
    }
    setSaving(false);
  };

  const updateHero = (key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value }
    }));
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
      <AdminSidebar />

      <main className="flex-1 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-4xl mb-2">Website Content</h1>
            <p className="text-brand-dark/60">Pas de teksten van de landing page aan voor de taal: <span className="font-bold uppercase">{currentLocale}</span></p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-brand-dark text-white rounded-none px-8">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            Wijzigingen Opslaan
          </Button>
        </header>

        <div className="max-w-3xl space-y-12">
          <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
              <Globe size={20} className="text-brand-bronze" />
              <h2 className="font-serif text-2xl">Hero Sectie</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 1</Label>
                <Input 
                  value={content.hero?.title1 || ""} 
                  onChange={(e) => updateHero("title1", e.target.value)}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                  placeholder="Bijv. Authentieke"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 2 (Italic)</Label>
                <Input 
                  value={content.hero?.title2 || ""} 
                  onChange={(e) => updateHero("title2", e.target.value)}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze italic"
                  placeholder="Bijv. Kaleiwerken."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Subtitel</Label>
                <Textarea 
                  value={content.hero?.subtitle || ""} 
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[100px]"
                  placeholder="Beschrijf uw diensten..."
                />
              </div>
            </div>
          </section>
          
          <div className="p-6 bg-brand-bronze/5 border border-brand-bronze/10">
            <p className="text-xs text-brand-dark/60 italic">
              Tip: Velden die u leeg laat zullen de standaardtekst uit de taalbestanden gebruiken.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}