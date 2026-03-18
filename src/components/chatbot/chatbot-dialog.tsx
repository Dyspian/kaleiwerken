"use client";

import React, { useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, RefreshCcw, Paintbrush } from 'lucide-react'; // Import Paintbrush
import { ChatMessage } from './chat-message';
import { useChatbotConversation } from '@/hooks/use-chatbot-conversation';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationStep, Option } from '@/hooks/use-chatbot-conversation';

interface ChatbotDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotDialog = ({ isOpen, onOpenChange }: ChatbotDialogProps) => {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] || "nl") as Locale;
  const [dict, setDict] = React.useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setDict);
  }, [locale]);

  const {
    messages,
    currentConversationStep,
    isSubmitting,
    isComplete,
    resetChat,
    formValues,
    errors,
    register,
    handleSubmit,
    onSubmit,
  } = useChatbotConversation(dict || {});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!dict) return null; // Wait for dictionary to load

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-brand-white border-l border-brand-dark/5 rounded-none">
        <SheetHeader className="pb-4 border-b border-brand-dark/5 flex-row items-center gap-3"> {/* Flex-row voor icoon en tekst */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-bronze text-white flex items-center justify-center">
            <Paintbrush size={20} /> {/* Mascotte in de header */}
          </div>
          <div>
            <SheetTitle className="font-serif text-2xl">{dict.chatbot.title}</SheetTitle>
            <SheetDescription>{dict.chatbot.subtitle}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-brand-dark/5">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <p className="text-brand-dark/60">{dict.chatbot.thankYouMessage}</p>
                <Button
                  onClick={resetChat}
                  className="w-full bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-colors"
                >
                  <RefreshCcw size={16} className="mr-2" /> {dict.chatbot.startNew}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentConversationStep?.renderInput ? (
                  currentConversationStep.renderInput
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {currentConversationStep?.options?.map((option: Option, index: number) => (
                      <Button
                        key={index}
                        onClick={option.action}
                        disabled={isSubmitting}
                        className="bg-brand-stone text-brand-dark rounded-none border border-brand-dark/10 hover:bg-brand-bronze hover:text-white transition-colors"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};