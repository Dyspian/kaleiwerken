"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronUp, ChevronDown, MessageSquare, Mail, Phone, Clock } from "lucide-react";
import { ChatbotConversation } from "@/hooks/use-admin-chatbot-conversations";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";

interface ChatbotConversationListProps {
  conversations: ChatbotConversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: ChatbotConversation['status'] | 'all';
  setFilterStatus: (status: ChatbotConversation['status'] | 'all') => void;
  sortBy: keyof ChatbotConversation;
  setSortBy: (key: keyof ChatbotConversation) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Aangepast type
  totalPages: number;
  totalConversationsCount: number;
}

export const ChatbotConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  currentPage,
  setCurrentPage,
  totalPages,
  totalConversationsCount,
}: ChatbotConversationListProps) => {
  return (
    <>
      <div className="p-6 border-b border-brand-dark/5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
          <Input
            placeholder="Zoek op naam, e-mail of vraag..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(val: ChatbotConversation['status'] | 'all') => {
            setFilterStatus(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="flex-1 rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <Filter size={16} className="mr-2 text-brand-dark/40" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="beantwoord">Beantwoord</SelectItem>
              <SelectItem value="gesloten">Gesloten</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
          >
            {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-brand-dark/40 italic">Geen conversaties gevonden.</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "p-4 border-b border-brand-dark/5 cursor-pointer hover:bg-brand-stone/30 transition-colors",
                selectedConversationId === conv.id ? "bg-brand-stone/50 border-l-4 border-brand-bronze" : ""
              )}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-brand-dark">{conv.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-brand-dark/40">
                  {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: nl })}
                </span>
              </div>
              <p className="text-sm text-brand-dark/70 line-clamp-2 mb-2">{conv.initial_question}</p>
              <div className="flex items-center gap-2 text-xs text-brand-dark/50">
                <Mail size={12} /> {conv.email}
                {conv.phone && <><Phone size={12} className="ml-2" /> {conv.phone}</>}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-brand-dark/5 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
          >
            Vorige
          </Button>
          <span className="text-sm text-brand-dark/60">Pagina {currentPage} van {totalPages}</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
          >
            Volgende
          </Button>
        </div>
      )}
    </>
  );
};