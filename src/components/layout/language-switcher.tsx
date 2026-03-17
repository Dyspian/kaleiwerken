"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const locales = [
  { code: "nl", label: "NL" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split("/")[1] || "nl";

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-12 px-0 hover:bg-brand-dark/5 rounded-none text-[10px] font-bold tracking-widest">
          <Globe className="mr-1 h-3 w-3" />
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none border-brand-dark/5 bg-brand-stone">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="text-[10px] font-bold tracking-widest cursor-pointer hover:bg-brand-dark/5"
          >
            {locale.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}