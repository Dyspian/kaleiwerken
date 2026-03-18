"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatbotFormValues, chatbotFormSchema } from '@/components/chatbot/chatbot-schema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import {
  createWelcomeStep,
  createProjectTypeStep,
  createSurfaceAreaStep,
  createSurfaceTypeStep,
  createTimingStep,
  createContactStep,
  createQuestionStep
} from './chatbot-steps';
import { ConversationStep } from './chatbot-steps';

// Types
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export interface UserConversation {
  id: string;
  initial_question: string;
  created_at: string;
  updated_at: string;
}

// Constants
const CONVERSATION_ID_KEY = 'chatbot_conversation_id';

export const useChatbotConversation = (dict: any) => {
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userConversations, setUserConversations] = useState<UserConversation[]>([]);

  // Form management
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, reset } = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues: {
      type: undefined,
      projectType: undefined,
      surfaceType: "baksteen",
      timing: "1-3_maanden",
      name: "",
      email: "",
      phone: "",
      postalCode: "",
      city: "",
      questionText: "",
    }
  });

  const formValues = watch();

  // Core message management
  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, sender }]);
  }, []);

  // Conversation lifecycle management
  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentStep(0);
    setIsComplete(false);
    setCurrentConversationId(null);
    if (!user) {
      localStorage.removeItem(CONVERSATION_ID_KEY);
    }
    reset();
    if (dict?.chatbot?.welcome) {
      addMessage(dict.chatbot.welcome, 'bot');
    }
  }, [addMessage, dict, reset, user]);

  // User conversations management
  const fetchUserConversations = useCallback(async () => {
    if (!user?.id) {
      setUserConversations([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('id, initial_question, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Error fetching user conversations:", error);
        toast.error("Fout bij ophalen van uw conversaties.");
        setUserConversations([]);
      } else {
        setUserConversations(data || []);
      }
    } catch (error) {
      console.error("Error in fetchUserConversations:", error);
      setUserConversations([]);
    }
  }, [user?.id]);

  // Load specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsComplete(false);
    setCurrentStep(0);

    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages for conversation:", error);
        toast.error("Fout bij ophalen chatgeschiedenis.");
        resetChat();
        return;
      }

      const loadedMessages = data.map(msg => ({
        id: msg.id,
        text: msg.message_text,
        sender: (msg.sender === 'admin' ? 'bot' : 'user') as Message['sender'],
      }));
      
      setMessages([
        { id: 0, text: dict.chatbot.welcome, sender: 'bot' },
        ...loadedMessages
      ]);

      // If the last message is from admin, it's "complete" from user's perspective
      if (loadedMessages.length > 0 && loadedMessages[loadedMessages.length - 1].sender === 'bot') {
        setIsComplete(true);
      } else {
        setIsComplete(false);
      }
    } catch (error) {
      console.error("Error in loadConversation:", error);
      resetChat();
    }
  }, [dict, resetChat]);

  // Initialize chat or load existing conversation
  useEffect(() => {
    if (authLoading) return;

    if (user) { // Logged-in user
      fetchUserConversations();
      // If no current conversation is selected, or if the selected one doesn't belong to this user,
      // start a new one or load the most recent one.
      if (!currentConversationId || !userConversations.some(conv => conv.id === currentConversationId)) {
        if (userConversations.length > 0) {
          loadConversation(userConversations[0].id); // Load most recent conversation
        } else {
          resetChat(); // Start fresh if no conversations
        }
      }
    } else { // Anonymous user
      const storedConversationId = localStorage.getItem(CONVERSATION_ID_KEY);
      if (storedConversationId) {
        loadConversation(storedConversationId);
      } else {
        resetChat();
      }
    }
  }, [authLoading, user, currentConversationId, userConversations, fetchUserConversations, loadConversation, resetChat]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!currentConversationId) return;

    const channel = supabase
      .channel(`chatbot_messages_${currentConversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chatbot_messages',
        filter: `conversation_id=eq.${currentConversationId}`
      }, (payload) => {
        const newMessage = payload.new as any;
        if (!messages.some(msg => msg.id === newMessage.id)) {
          addMessage(newMessage.message_text, (newMessage.sender === 'admin' ? 'bot' : 'user') as Message['sender']);
          setIsComplete(true); // Mark as complete after receiving a new message
          fetchUserConversations(); // Refresh user conversations list
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversationId, addMessage, messages, fetchUserConversations]);

  // Form submission handlers
  const handleOfferSubmission = async (data: ChatbotFormValues) => {
    const leadData = {
      project_type: data.projectType,
      surface_area: data.surfaceArea || null,
      surface_type: data.surfaceType || null,
      timing: data.timing || null,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      postal_code: data.postalCode || null,
      city: data.city || null,
      notes: null,
      status: 'nieuw',
    };

    const { error } = await supabase.from("leads").insert(leadData);

    if (error) throw error;

    addMessage(dict.chatbot.thankYou, 'bot');
    setIsComplete(true);
    toast.success(dict.chatbot.successSubmit);
  };

  const handleQuestionSubmission = async (data: ChatbotFormValues) => {
    let conversationIdToUse = currentConversationId;

    if (!conversationIdToUse) {
      const userId = user?.id || null;

      const { data: conversationData, error: conversationError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: userId,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          initial_question: data.questionText || '',
          status: 'open',
        })
        .select()
        .single();

      if (conversationError) throw conversationError;
      conversationIdToUse = conversationData.id;
      setCurrentConversationId(conversationIdToUse);
      if (!user && conversationIdToUse) {
        localStorage.setItem(CONVERSATION_ID_KEY, conversationIdToUse);
      }
      fetchUserConversations();
    }

    const { error: messageError } = await supabase
      .from("chatbot_messages")
      .insert({
        conversation_id: conversationIdToUse,
        sender: 'user',
        message_text: data.questionText || '',
      });

    if (messageError) throw messageError;

    addMessage(dict.chatbot.thankYouMessage, 'bot');
    setIsComplete(true);
    toast.success(dict.chatbot.successSubmit);
  };

  // Main form submission
  const onSubmit = async (data: ChatbotFormValues) => {
    setIsSubmitting(true);
    const userMessageText = data.questionText || data.name;
    addMessage(userMessageText, 'user');

    try {
      if (data.type === 'offer') {
        await handleOfferSubmission(data);
      } else if (data.type === 'question') {
        await handleQuestionSubmission(data);
      }
    } catch (error: any) {
      toast.error(dict.chatbot.errorSubmit);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate conversation steps using modular creators
  const generateConversationSteps = useCallback((values: ChatbotFormValues): ConversationStep[] => {
    if (!dict || !dict.chatbot || !dict.quote) {
      return [];
    }

    // Create a wrapper for setValue to handle the type mismatch
    const setValueWrapper = (name: string, value: any) => {
      setValue(name as any, value);
    };

    const steps = [
      createWelcomeStep(dict, setValueWrapper, setCurrentStep, addMessage),
      ...(values.type === 'offer' ? [
        createProjectTypeStep(dict, setValueWrapper, setCurrentStep, addMessage),
        createSurfaceAreaStep(dict, register, errors, getValues, addMessage, toast, setCurrentStep),
        createSurfaceTypeStep(dict, setValueWrapper, setCurrentStep, addMessage),
        createTimingStep(dict, setValueWrapper, setCurrentStep, addMessage),
        createContactStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
      ] : []),
      ...(values.type === 'question' ? [
        createQuestionStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
      ] : []),
    ].filter(Boolean) as ConversationStep[];
    
    return steps;
  }, [dict, errors, getValues, handleSubmit, isSubmitting, register, setValue, addMessage, onSubmit, toast]);

  const currentConversationStep = generateConversationSteps(formValues)[currentStep];

  // Update messages when step changes
  useEffect(() => {
    if (currentConversationStep?.botMessage && messages.length === 0) {
      addMessage(currentConversationStep.botMessage, 'bot');
    } else if (currentConversationStep?.botMessage && messages[messages.length - 1]?.sender === 'user') {
      addMessage(currentConversationStep.botMessage, 'bot');
    }
  }, [currentConversationStep, messages, addMessage]);

  return {
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
    userConversations,
    loadConversation,
    currentConversationId,
  };
};