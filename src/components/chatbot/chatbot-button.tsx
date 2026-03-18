"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatbotDialog } from './chatbot-dialog';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] || "nl") as Locale;
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  if (!dict) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-brand-dark text-white shadow-lg hover:bg-brand-bronze transition-colors flex items-center justify-center"
        aria-label={dict.chatbot.openChat}
      >
        <MessageSquare size={24} />
      </Button>
      <ChatbotDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};