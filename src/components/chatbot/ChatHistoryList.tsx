"use client";

import React from 'react';
import { UserConversation } from '@/hooks/use-chatbot-conversation';
import { Button } from '@/components/ui/button';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ChatHistoryListProps {
  conversations: UserConversation[];
  onSelectConversation: (id: string) => void;
  onStartNewConversation: () => void;
  currentConversationId: string | null;
  dict: any;
}

export const ChatHistoryList = ({
  conversations,
  onSelectConversation,
  onStartNewConversation,
  currentConversationId,
  dict,
}: ChatHistoryListProps) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onStartNewConversation}
        className="w-full bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-colors flex items-center justify-center py-3"
      >
        <PlusCircle size={16} className="mr-2" /> {dict.chatbot.startNew}
      </Button>

      {conversations.length > 0 && (
        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 px-2">Uw eerdere chats</p>
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant="ghost"
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full justify-start text-left rounded-none px-2 py-2 h-auto",
                currentConversationId === conv.id
                  ? "bg-brand-stone text-brand-dark hover:bg-brand-stone"
                  : "text-brand-dark/70 hover:bg-brand-stone/50"
              )}
            >
              <MessageSquare size={14} className="mr-2 flex-shrink-0" />
              <div className="flex-1 truncate text-sm">
                {conv.initial_question || dict.chatbot.defaultQuestion}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 ml-2 flex-shrink-0">
                {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: nl })}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};