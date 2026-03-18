"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2, MessageSquare, Mail, Phone, ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar"; // Importeer AdminSidebar
import { useAdminChatbotConversations, ChatbotConversation, ChatbotMessage } from "@/hooks/use-admin-chatbot-conversations";
import { ChatbotConversationList } from "@/components/admin/chatbot/ChatbotConversationList";
import { ChatbotConversationDetail } from "@/components/admin/chatbot/ChatbotConversationDetail";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminChatbotPage() {
  const { user, loading: authLoading } = useAuth();
  const {
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
  } = useAdminChatbotConversations(user, authLoading);

  const selectedConversation = selectedConversationId
    ? conversations.find(conv => conv.id === selectedConversationId)
    : null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <AdminSidebar />

      <main className="flex-1 flex">
        {/* Conversation List Pane */}
        <div className={cn(
          "w-full lg:w-1/3 xl:w-1/4 border-r border-brand-dark/5 bg-white flex flex-col",
          selectedConversationId ? "hidden lg:flex" : "flex"
        )}>
          <header className="p-6 border-b border-brand-dark/5">
            <h1 className="font-serif text-3xl mb-2">Chatbot Inbox</h1>
            <p className="text-brand-dark/60 text-sm">Beheer algemene vragen en conversaties.</p>
          </header>
          <ChatbotConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalConversationsCount={totalConversationsCount}
          />
        </div>

        {/* Conversation Detail Pane */}
        <div className={cn(
          "flex-1 flex flex-col bg-brand-stone",
          selectedConversationId ? "flex" : "hidden lg:flex"
        )}>
          {selectedConversation ? (
            <ChatbotConversationDetail
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={addAdminMessage}
              onUpdateStatus={updateConversationStatus}
              onDeleteConversation={deleteConversation}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-dark/40 p-8 text-center">
              <MessageSquare size={64} className="mb-6" />
              <h2 className="font-serif text-2xl mb-2">Selecteer een conversatie</h2>
              <p className="max-w-sm">Kies een conversatie uit de lijst om de details te bekijken en te reageren.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}