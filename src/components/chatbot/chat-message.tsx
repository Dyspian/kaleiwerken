import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'bot';
}

export const ChatMessage = ({ message, sender }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex items-start gap-3",
      sender === 'user' ? "justify-end" : "justify-start"
    )}>
      {sender === 'bot' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-bronze text-white flex items-center justify-center">
          <Bot size={16} />
        </div>
      )}
      <div className={cn(
        "max-w-[70%] p-3 rounded-lg shadow-sm text-sm leading-relaxed",
        sender === 'user'
          ? "bg-brand-dark text-white rounded-br-none"
          : "bg-brand-stone text-brand-dark rounded-bl-none"
      )}>
        {message}
      </div>
      {sender === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center">
          <User size={16} />
        </div>
      )}
    </div>
  );
};