"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Globe, Info, User } from "lucide-react";
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
    hero: { title1: "", title2: "", subtitle: "" },
    about: { 
      tag: "", 
      title: "", 
      description: "",
      personal: "",
      personalDesc: "",
      pigments: "",
      pigmentsDesc: "",
      protection: "",
      protectionDesc: ""
    }
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
      toast.success("Content bijgewerkt! Vernieuw de website om de wijzigingen te zien.");
    }
    setSaving(false);
  };

  const updateField = (section: string, key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
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
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-4xl mb-2">Website Content</h1>
            <p className="text-brand-dark/60">Beheer de teksten voor: <span className="font-bold uppercase">{currentLocale}</span></p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze transition-all duration-500">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            Wijzigingen Opslaan
          </Button>
        </header>

        {/* Tip Section - Now at the top and more visible */}
        <div className="mb-12 p-6 bg-brand-bronze/10 border border-brand-bronze/20 flex items-start gap-4">
          <Info className="text-brand-bronze shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-brand-dark text-sm mb-1">Belangrijke Tip</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Velden die u leeg laat zullen automatisch de standaardtekst uit de taalbestanden gebruiken. 
              U hoeft dus alleen de velden in te vullen die u daadwerkelijk wilt aanpassen.
            </p>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 pb-24">
          {/* Hero Section */}
          <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
              <Globe size={20} className="text-brand-bronze" />
              <h2 className="font-serif text-2xl">Home: Hero Sectie</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 1</Label>
                  <Input 
                    value={content.hero?.title1 || ""} 
                    onChange={(e) => updateField("hero", "title1", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel Regel 2 (Italic)</Label>
                  <Input 
                    value={content.hero?.title2 || ""} 
                    onChange={(e) => updateField("hero", "title2", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze italic"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Subtitel</Label>
                <Textarea 
                  value={content.hero?.subtitle || ""} 
                  onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[100px]"
                />
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
              <User size={20} className="text-brand-bronze" />
              <h2 className="font-serif text-2xl">Pagina: Over Ons</h2>
            </div>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Kleine Tag (boven titel)</Label>
                  <Input 
                    value={content.about?.tag || ""} 
                    onChange={(e) => updateField("about", "tag", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdtitel</Label>
                  <Input 
                    value={content.about?.title || ""} 
                    onChange={(e) => updateField("about", "title", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Hoofdbeschrijving</Label>
                <Textarea 
                  value={content.about?.description || ""} 
                  onChange={(e) => updateField("about", "description", e.target.value)}
                  className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[120px]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-4">
                  <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Persoonlijk</h4>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
                    <Input 
                      value={content.about?.personal || ""} 
                      onChange={(e) => updateField("about", "personal", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
                    <Textarea 
                      value={content.about?.personalDesc || ""} 
                      onChange={(e) => updateField("about", "personalDesc", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Pigmenten</h4>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
                    <Input 
                      value={content.about?.pigments || ""} 
                      onChange={(e) => updateField("about", "pigments", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
                    <Textarea 
                      value={content.about?.pigmentsDesc || ""} 
                      onChange={(e) => updateField("about", "pigmentsDesc", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif text-lg border-b border-brand-dark/5 pb-2">Bescherming</h4>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Titel</Label>
                    <Input 
                      value={content.about?.protection || ""} 
                      onChange={(e) => updateField("about", "protection", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Tekst</Label>
                    <Textarea 
                      value={content.about?.protectionDesc || ""} 
                      onChange={(e) => updateField("about", "protectionDesc", e.target.value)}
                      className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}