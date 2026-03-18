"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatbotConversation, ChatbotMessage } from "@/hooks/use-admin-chatbot-conversations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, Phone, Send, Trash2, MessageSquare } from "lucide-react";
import { ChatMessage } from "@/components/chatbot/chat-message";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface ChatbotConversationDetailProps {
  conversation: ChatbotConversation;
  messages: ChatbotMessage[];
  onSendMessage: (conversationId: string, messageText: string) => Promise<boolean>;
  onUpdateStatus: (conversationId: string, newStatus: ChatbotConversation['status']) => Promise<boolean>;
  onDeleteConversation: (conversationId: string) => void;
  onBack: () => void;
}

export const ChatbotConversationDetail = ({
  conversation,
  messages,
  onSendMessage,
  onUpdateStatus,
  onDeleteConversation,
  onBack,
}: ChatbotConversationDetailProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    const success = await onSendMessage(conversation.id, newMessage);
    if (success) {
      setNewMessage("");
    }
    setIsSending(false);
  };

  const handleStatusChange = async (newStatus: ChatbotConversation['status']) => {
    await onUpdateStatus(conversation.id, newStatus);
  };

  const openMailClient = () => {
    const subject = `Re: Uw vraag aan Van Roey Kaleiwerken (${conversation.name})`;
    const body = `Beste ${conversation.name},\n\n`; // You can pre-fill more here
    window.open(`mailto:${conversation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const openPhoneDialer = () => {
    if (conversation.phone) {
      window.open(`tel:${conversation.phone}`);
    } else {
      toast.error("Geen telefoonnummer beschikbaar voor deze conversatie.");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="p-6 border-b border-brand-dark/5 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden rounded-none">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="font-serif text-2xl">{conversation.name}</h2>
            <p className="text-sm text-brand-dark/60">{conversation.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={openMailClient} className="rounded-none border-brand-dark/10 hover:bg-brand-stone" title="E-mail sturen">
            <Mail size={18} />
          </Button>
          {conversation.phone && (
            <Button variant="outline" size="icon" onClick={openPhoneDialer} className="rounded-none border-brand-dark/10 hover:bg-brand-stone" title="Bellen">
              <Phone size={18} />
            </Button>
          )}
          <Select value={conversation.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="beantwoord">Beantwoord</SelectItem>
              <SelectItem value="gesloten">Gesloten</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => onDeleteConversation(conversation.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600" title="Conversatie verwijderen">
            <Trash2 size={18} />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-brand-stone">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.message_text} sender={msg.sender === 'admin' ? 'bot' : 'user'} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-brand-dark/5 bg-white">
        <div className="flex items-center gap-4">
          <Textarea
            placeholder="Typ hier uw antwoord..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-none border-brand-dark/10 min-h-[60px]"
          />
          <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()} className="bg-brand-dark text-white rounded-none px-6 py-6 hover:bg-brand-bronze transition-colors">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};