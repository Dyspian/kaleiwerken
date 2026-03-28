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
import { ContentTabs } from "@/components/admin/content/content-tabs";
import { HeroSection } from "@/components/admin/content/hero-section";
import { AboutSection } from "@/components/admin/content/about-section";
import { LegalSection } from "@/components/admin/content/legal-section";
import { Shield, FileText } from "lucide-react";

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

const initialState: ContentState = {
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
};

export default function AdminContentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const currentLocale = (params.locale as string) || 'nl';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof ContentState>("hero");
  
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
        toast.error("Fout bij ophalen content: " + error.message);
      } else if (data?.content) {
        // Merge fetched content with initial state to ensure all keys exist
        setContent({
          hero: { ...initialState.hero, ...(data.content.hero || {}) },
          about: { ...initialState.about, ...(data.content.about || {}) },
          privacy: { ...initialState.privacy, ...(data.content.privacy || {}) },
          terms: { ...initialState.terms, ...(data.content.terms || {}) }
        });
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

  const handleImageUpload = async (file: File) => {
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

  const updateField = (section: keyof ContentState, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateLegalField = (section: "privacy" | "terms", field: "title" | "content", value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
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
        return <HeroSection content={content.hero} onUpdate={(field, value) => updateField("hero", field, value)} />;
      case "about":
        return (
          <AboutSection 
            content={content.about} 
            onUpdate={(field, value) => updateField("about", field, value)}
            onImageUpload={handleImageUpload}
            uploading={uploading}
          />
        );
      case "privacy":
        return (
          <LegalSection
            title={content.privacy?.title || ""}
            content={content.privacy?.content || ""}
            onUpdate={(field, value) => updateLegalField("privacy", field, value)}
            icon={<Shield size={20} className="text-brand-bronze" />}
            sectionTitle="Privacy Beleid"
          />
        );
      case "terms":
        return (
          <LegalSection
            title={content.terms?.title || ""}
            content={content.terms?.content || ""}
            onUpdate={(field, value) => updateLegalField("terms", field, value)}
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