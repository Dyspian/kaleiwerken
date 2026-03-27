"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout, User, Shield, FileText } from "lucide-react";

type ContentTab = "hero" | "about" | "privacy" | "terms";

interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export const ContentTabs = ({ activeTab, onTabChange }: ContentTabsProps) => {
  const tabs = [
    { id: "hero" as ContentTab, label: "Home (Hero)", icon: Layout },
    { id: "about" as ContentTab, label: "Over Ons", icon: User },
    { id: "privacy" as ContentTab, label: "Privacy Beleid", icon: Shield },
    { id: "terms" as ContentTab, label: "Algemene Voorwaarden", icon: FileText },
  ];

  return (
    <div className="flex gap-4 mb-8 border-b border-brand-dark/5 pb-4">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-none uppercase text-[10px] tracking-widest px-6 py-4 h-auto border-b-2 transition-all",
            activeTab === tab.id
              ? "border-brand-bronze text-brand-bronze bg-brand-bronze/5"
              : "border-transparent text-brand-dark/40 hover:text-brand-dark"
          )}
        >
          <tab.icon size={14} className="mr-2" />
          {tab.label}
        </Button>
      ))}
    </div>
  );
};