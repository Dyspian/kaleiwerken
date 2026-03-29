"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { ContentHeader } from "@/components/admin/content/content-header";
import { ContentTip } from "@/components/admin/content/content-tip";
import { ContentTabs, ContentTab } from "@/components/admin/content/content-tabs";
import { HeroSection } from "@/components/admin/content/hero-section";
import { AboutSection } from "@/components/admin/content/about-section";
import { LegalSection } from "@/components/admin/content/legal-section";
import { HomeSectionsEditor } from "@/components/admin/content/home-sections-editor";
import { CraftsmanshipSection } from "@/components/admin/content/craftsmanship-section";
import { Shield, FileText } from "lucide-react";

interface ContentState {
  hero: any;
  home_sections?: any;
  socialProof: any;
  features: any;
  process: any;
  beforeAfter: any;
  about: any;
  craftsmanship: any;
  projects: any;
  privacy: any;
  terms: any;
}

const initialState: ContentState = {
  hero: { title1: "", title2: "", subtitle: "", imageUrl: "" },
  socialProof: { items: [] },
  features: { title: "", subtitle: "", items: [] },
  process: { title: "", desc: "", imageUrl: "", steps: [] },
  beforeAfter: { tag: "", title: "", instruction: "", beforeImage: "", afterImage: "" },
  about: { 
    tag: "", title: "", description: "", imageUrl: "",
    personal: "", personalDesc: "", pigments: "", pigmentsDesc: "", protection: "", protectionDesc: ""
  },
  craftsmanship: { title: "", subtitle: "", heroImage: "", mainContent: "" },
  projects: { tag: "", title: "", subtitle: "" },
  privacy: { title: "", content: "" },
  terms: { title: "", content: "" }
};

export default function AdminContentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const currentLocale = (params.locale as string) || 'nl';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  
  const [content, setContent] = useState<ContentState>(initialState);

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
        toast.error("Fout bij ophalen content");
      } else if (data?.content) {
        const merged = { ...initialState };
        Object.keys(initialState).forEach(key => {
          if (data.content[key]) {
            merged[key as keyof ContentState] = { ...initialState[key as keyof ContentState], ...data.content[key] };
          }
        });
        setContent(merged);
      }
    } catch (error: any) {
      console.error("Exception fetching content:", error);
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

      if (error) throw error;
      toast.success("Content succesvol bijgewerkt!");
    } catch (error: any) {
      toast.error("Fout bij opslaan: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, targetSection: keyof ContentState, fieldName?: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${targetSection}-${fieldName || 'image'}-${currentLocale}-${Date.now()}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: signedData, error: signedError } = await supabase.storage
        .from('portfolio-images')
        .createSignedUrl(filePath, 315360000);

      if (signedError) throw signedError;

      const finalFieldName = fieldName || (targetSection === "about" ? "imageUrl" : targetSection === "process" ? "imageUrl" : targetSection === "hero" ? "imageUrl" : "heroImage");

      setContent(prev => ({
        ...prev,
        [targetSection]: { 
          ...prev[targetSection as keyof ContentState], 
          [finalFieldName]: signedData.signedUrl 
        }
      }));
      toast.success("Afbeelding geüpload");
    } catch (error: any) {
      toast.error("Fout bij uploaden: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setContent(prev => {
      const s = section as keyof ContentState;
      return {
        ...prev,
        [s]: typeof prev[s] === 'object' && prev[s] !== null && !Array.isArray(prev[s]) 
          ? { ...prev[s], [field]: value }
          : value
      };
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeTab) {
      case "hero":
        return (
          <HeroSection 
            content={content.hero} 
            onUpdate={(field, value) => updateField("hero", field, value)} 
            onImageUpload={(file) => handleImageUpload(file, "hero")}
            uploading={uploading}
          />
        );
      case "home_sections":
        return (
          <HomeSectionsEditor 
            content={content} 
            onUpdate={updateField} 
            onImageUpload={(file, section, fieldName) => handleImageUpload(file, section as keyof ContentState, fieldName)}
            uploading={uploading}
          />
        );
      case "about":
        return (
          <AboutSection 
            content={content.about} 
            onUpdate={(field, value) => updateField("about", field, value)}
            onImageUpload={(file) => handleImageUpload(file, "about")}
            uploading={uploading}
          />
        );
      case "craftsmanship":
        return (
          <CraftsmanshipSection
            content={content.craftsmanship}
            onUpdate={(field, value) => updateField("craftsmanship", field, value)}
            onImageUpload={(file) => handleImageUpload(file, "craftsmanship")}
            uploading={uploading}
          />
        );
      case "privacy":
        return (
          <LegalSection
            title={content.privacy?.title || ""}
            content={content.privacy?.content || ""}
            onUpdate={(field, value) => updateField("privacy", field, value)}
            icon={<Shield size={20} className="text-brand-bronze" />}
            sectionTitle="Privacy Beleid"
          />
        );
      case "terms":
        return (
          <LegalSection
            title={content.terms?.title || ""}
            content={content.terms?.content || ""}
            onUpdate={(field, value) => updateField("terms", field, value)}
            icon={<FileText size={20} className="text-brand-bronze" />}
            sectionTitle="Algemene Voorwaarden"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <AdminSidebar />
      <main className="flex-1 p-12">
        <ContentHeader locale={currentLocale} onSave={handleSave} saving={saving} />
        <ContentTip />
        <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="max-w-4xl pb-24">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
}