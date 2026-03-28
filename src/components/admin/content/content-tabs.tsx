"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout, User, Shield, FileText, Home, Award } from "lucide-react";

export type ContentTab = "hero" | "home_sections" | "about" | "craftsmanship" | "privacy" | "terms";

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export const ContentTabs = ({ activeTab, onTabChange }: ContentTabsProps) => {
  const tabs = [
    { id: "hero" as ContentTab, label: "Hero", icon: Layout },
    { id: "home_sections" as ContentTab, label: "Home Secties", icon: Home },
    { id: "about" as ContentTab, label: "Over Ons", icon: User },
    { id: "craftsmanship" as ContentTab, label: "Vakmanschap", icon: Award },
    { id: "privacy" as ContentTab, label: "Privacy", icon: Shield },
    { id: "terms" as ContentTab, label: "Voorwaarden", icon: FileText },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-dark/5 pb-4">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-none uppercase text-[9px] tracking-widest px-4 py-3 h-auto border-b-2 transition-all",
            activeTab === tab.id
              ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5"
              : "border-transparent text-brand-dark/40 hover:text-brand-dark"
          )}
        >
          <tab.icon size={12} className="mr-2" />
          {tab.label}
        </Button>
      ))}
    </div>
  );
};