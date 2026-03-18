"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export interface ChatbotConversation {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  initial_question: string;
  status: 'open' | 'beantwoord' | 'gesloten';
  created_at: string;
  updated_at: string;
}

export interface ChatbotMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'admin';
  message_text: string;
  created_at: string;
}

const CONVERSATIONS_PER_PAGE = 10;

export const useAdminChatbotConversations = (user: User | null, authLoading: boolean) => {
  const [conversations, setConversations] = useState<ChatbotConversation[]>([]);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ChatbotConversation['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof ChatbotConversation>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalConversationsCount, setTotalConversationsCount] = useState(0);

  const totalPages = useMemo(() => Math.ceil(totalConversationsCount / CONVERSATIONS_PER_PAGE), [totalConversationsCount]);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("chatbot_conversations")
      .select("*", { count: 'exact' });

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,initial_question.ilike.%${searchQuery}%`);
    }

    if (filterStatus !== 'all') {
      query = query.eq("status", filterStatus);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = (currentPage - 1) * CONVERSATIONS_PER_PAGE;
    const to = from + CONVERSATIONS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      toast.error("Fout bij ophalen conversaties");
      console.error(error);
    } else {
      setConversations(data || []);
      setTotalConversationsCount(count || 0);
    }
    setLoading(false);
  }, [searchQuery, filterStatus, sortBy, sortOrder, currentPage]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chatbot_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Fout bij ophalen berichten");
      console.error(error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchConversations();
    }
  }, [user, authLoading, fetchConversations]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, fetchMessages]);

  // Realtime updates for new conversations and messages
  useEffect(() => {
    const conversationChannel = supabase
      .channel('chatbot_conversations_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chatbot_conversations' }, (payload) => {
        const newConversation = payload.new as ChatbotConversation;
        toast.info(`Nieuwe chatbot conversatie van ${newConversation.name}!`, {
          description: newConversation.initial_question,
          action: {
            label: 'Bekijk',
            onClick: () => {
              setSelectedConversationId(newConversation.id);
              fetchConversations();
            },
          },
        });
        fetchConversations();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chatbot_conversations' }, (payload) => {
        fetchConversations(); // Refresh list on status update
        if (payload.new.id === selectedConversationId) {
          // If the currently viewed conversation is updated, refresh its messages
          fetchMessages(selectedConversationId as string); // Type assertion added here
        }
      })
      .subscribe();

    const messageChannel = supabase
      .channel('chatbot_messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chatbot_messages' }, (payload) => {
        const newMessage = payload.new as ChatbotMessage;
        if (newMessage.conversation_id === selectedConversationId) {
          setMessages(prev => [...prev, newMessage]);
        }
        // Also update the conversation list to reflect new message (via updated_at trigger)
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [fetchConversations, fetchMessages, selectedConversationId]);

  const addAdminMessage = async (conversationId: string, messageText: string) => {
    if (!user) {
      toast.error("Niet geautoriseerd om te reageren.");
      return false;
    }
    setLoading(true);
    const { error } = await supabase
      .from("chatbot_messages")
      .insert({
        conversation_id: conversationId,
        sender: 'admin',
        message_text: messageText,
      });

    if (error) {
      toast.error("Fout bij verzenden bericht");
      console.error(error);
      setLoading(false);
      return false;
    } else {
      // The real-time listener will update the messages state
      toast.success("Bericht verzonden");
      setLoading(false);
      return true;
    }
  };

  const updateConversationStatus = async (conversationId: string, newStatus: ChatbotConversation['status']) => {
    setLoading(true);
    const { error } = await supabase
      .from("chatbot_conversations")
      .update({ status: newStatus })
      .eq("id", conversationId);

    if (error) {
      toast.error("Fout bij bijwerken status");
      console.error(error);
      setLoading(false);
      return false;
    } else {
      setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, status: newStatus } : conv));
      toast.success("Status bijgewerkt");
      setLoading(false);
      return true;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm("Weet je zeker dat je deze conversatie wilt verwijderen? Dit verwijdert ook alle berichten.")) return;
    setLoading(true);
    const { error } = await supabase
      .from("chatbot_conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      toast.error("Fout bij verwijderen conversatie");
      console.error(error);
    } else {
      toast.success("Conversatie verwijderd");
      setSelectedConversationId(null);
      fetchConversations();
    }
    setLoading(false);
  };

  return {
    conversations,
    messages,
    loading,
    selectedConversationId,
    setSelectedConversationId,
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
    totalConversationsCount,
    totalPages,
    addAdminMessage,
    updateConversationStatus,
    deleteConversation,
  };
};