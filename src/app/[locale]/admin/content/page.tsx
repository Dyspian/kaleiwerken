"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Globe, Info, User, Layout, Image as ImageIcon, Upload, Shield, FileText } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/content/rich-text-editor";

type ContentTab = "hero" | "about" | "privacy" | "terms";

interface ContentState {
  hero: { title1: string; title2: string; subtitle: string };
  about: { 
    tag: string; 
    title: string; 
    description: string;
    imageUrl: string;
    personal: string;
    personalDesc: string;
    pigments: string;
    pigmentsDesc: string;
    protection: string;
    protectionDesc: string;
  };
  privacy: { title: string; content: string };
  terms: { title: string; content: string };
}

export default function AdminContentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const currentLocale = (params.locale as string) || 'nl';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState<ContentState>({
    hero: { title1: "", title2: "", subtitle: "" },
    about: { 
      tag: "", 
      title: "", 
      description: "",
      imageUrl: "",
      personal: "",
      personalDesc: "",
      pigments: "",
      pigmentsDesc: "",
      protection: "",
      protectionDesc: ""
    },
    privacy: { title: "", content: "" },
    terms: { title: "", content: "" }
  });

  useEffect(() => {
    if (user) fetchContent();
  }, [user, currentLocale]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('locale', currentLocale)
        .maybeSingle();

      if (error) {
        console.error("Error fetching content:", error);
        toast.error("Fout bij ophalen content: " + error.message);
      } else if (data?.content) {
        setContent(data.content);
      }
    } catch (error: any) {
      console.error("Exception fetching content:", error);
      toast.error("Fout bij ophalen content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          locale: currentLocale, 
          content: content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'locale' });

      if (error) {
        console.error("Error saving content:", error);
        throw error;
      }

      toast.success("Content succesvol bijgewerkt! Vernieuw de website om de wijzigingen te zien.");
    } catch (error: any) {
      console.error("Exception saving content:", error);
      toast.error("Fout bij opslaan: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `about-${currentLocale}-${Date.now()}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: signedData, error: signedError } = await supabase.storage
        .from('portfolio-images')
        .createSignedUrl(filePath, 315360000);

      if (signedError) throw signedError;

      setContent(prev => ({
        ...prev,
        about: { ...prev.about, imageUrl: signedData.signedUrl }
      }));
      toast.success("Afbeelding geüpload");
    } catch (error: any) {
      toast.error("Fout bij uploaden: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateField = (section: keyof ContentState, key: string, value: string) => {
    setContent(prev => ({
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

  const defaultAboutImage = "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/about%20us/Kaleiwerk-buitengevel-Pulle-Vincent-Van-Roey-Schilderwerken-3.jpg";

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

        {/* Tip Section */}
        <div className="mb-8 p-6 bg-brand-bronze/10 border border-brand-bronze/20 flex items-start gap-4">
          <Info className="text-brand-bronze shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-brand-dark text-sm mb-1">Belangrijke Tip</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Velden die u leeg laat zullen automatisch de standaardtekst uit de taalbestanden gebruiken. 
              U hoeft dus alleen de velden in te vullen die u daadwerkelijk wilt aanpassen.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-brand-dark/5 pb-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("hero")}
            className={cn(
              "rounded-none uppercase text-[10px] tracking-widest px-6 py-4 h-auto border-b-2 transition-all",
              activeTab === "hero" ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5" : "border-transparent text-brand-dark/40 hover:text-brand-dark"
            )}
          >
            <Layout size={14} className="mr-2" /> Home (Hero)
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("about")}
            className={cn(
              "rounded-none uppercase text-[10px] tracking-widest px-6 py-4 h-auto border-b-2 transition-all",
              activeTab === "about" ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5" : "border-transparent text-brand-dark/40 hover:text-brand-dark"
            )}
          >
            <User size={14} className="mr-2" /> Over Ons
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "rounded-none uppercase text-[10px] tracking-widest px-6 py-4 h-auto border-b-2 transition-all",
              activeTab === "privacy" ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5" : "border-transparent text-brand-dark/40 hover:text-brand-dark"
            )}
          >
            <Shield size={14} className="mr-2" /> Privacy Beleid
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("terms")}
            className={cn(
              "rounded-none uppercase text-[10px] tracking-widest px-6 py-4 h-auto border-b-2 transition-all",
              activeTab === "terms" ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5" : "border-transparent text-brand-dark/40 hover:text-brand-dark"
            )}
          >
            <FileText size={14} className="mr-2" /> Algemene Voorwaarden
          </Button>
        </div>

        <div className="max-w-4xl pb-24">
          {/* Privacy Policy Section */}
          {activeTab === "privacy" && (
            <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
                <Shield size={20} className="text-brand-bronze" />
                <h2 className="font-serif text-2xl">Privacy Beleid</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Pagina Titel</Label>
                  <Input 
                    value={content.privacy.title} 
                    onChange={(e) => updateField("privacy", "title", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                    placeholder="Privacybeleid"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Privacy Beleid Inhoud</Label>
                  <RichTextEditor
                    value={content.privacy.content}
                    onChange={(value) => updateField("privacy", "content", value)}
                    placeholder="Typ hier uw privacy beleid..."
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Terms & Conditions Section */}
          {activeTab === "terms" && (
            <section className="bg-white p-8 border border-brand-dark/5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-brand-dark/5 pb-4">
                <FileText size={20} className="text-brand-bronze" />
                <h2 className="font-serif text-2xl">Algemene Voorwaarden</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Pagina Titel</Label>
                  <Input 
                    value={content.terms.title} 
                    onChange={(e) => updateField("terms", "title", e.target.value)}
                    className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
                    placeholder="Algemene Voorwaarden"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Algemene Voorwaarden Inhoud</Label>
                  <RichTextEditor
                    value={content.terms.content}
                    onChange={(value) => updateField("terms", "content", value)}
                    placeholder="Typ hier uw algemene voorwaarden..."
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}