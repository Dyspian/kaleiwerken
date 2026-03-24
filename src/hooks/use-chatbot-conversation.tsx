"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isInitialized = useRef(false);

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
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, sender }]);
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
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('id, initial_question, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn("Error fetching user conversations:", error);
        setUserConversations([]);
        return [];
      } else {
        const convs = data || [];
        setUserConversations(convs);
        return convs;
      }
    } catch (error: any) {
      console.warn("Network error fetching conversations:", error);
      setUserConversations([]);
      return [];
    }
  }, [user?.id]);

  // Load specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    setCurrentConversationId(conversationId);
    setIsComplete(false);
    setCurrentStep(0);

    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.warn("Error fetching messages for conversation:", error);
        setMessages([{ id: 0, text: dict?.chatbot?.welcome || "Hallo!", sender: 'bot' }]);
        return;
      }

      const loadedMessages = data.map(msg => ({
        id: msg.id,
        text: msg.message_text,
        sender: (msg.sender === 'admin' ? 'bot' : 'user') as Message['sender'],
      }));
      
      setMessages([
        { id: 0, text: dict?.chatbot?.welcome || "Hallo!", sender: 'bot' },
        ...loadedMessages
      ]);

      if (loadedMessages.length > 0 && loadedMessages[loadedMessages.length - 1].sender === 'bot') {
        setIsComplete(true);
      } else {
        setIsComplete(false);
      }
    } catch (error: any) {
      console.warn("Network error loading conversation:", error);
      setMessages([{ id: 0, text: dict?.chatbot?.welcome || "Hallo!", sender: 'bot' }]);
    }
  }, [dict]);

  // Initialization Effect - Runs only when auth state is ready or user changes
  useEffect(() => {
    if (authLoading || !dict?.chatbot) return;

    const init = async () => {
      if (user) {
        const convs = await fetchUserConversations();
        if (convs.length > 0 && !currentConversationId) {
          await loadConversation(convs[0].id);
        } else if (convs.length === 0) {
          resetChat();
        }
      } else {
        const storedId = localStorage.getItem(CONVERSATION_ID_KEY);
        if (storedId && !currentConversationId) {
          await loadConversation(storedId);
        } else if (!currentConversationId) {
          resetChat();
        }
      }
      isInitialized.current = true;
    };

    init();
  }, [authLoading, user?.id, dict?.chatbot]); // Only depend on core auth state and dict availability

  // Real-time subscription
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
        setMessages(prev => {
          if (prev.some(msg => msg.id === newMessage.id)) return prev;
          return [...prev, {
            id: newMessage.id,
            text: newMessage.message_text,
            sender: (newMessage.sender === 'admin' ? 'bot' : 'user') as Message['sender']
          }];
        });
        setIsComplete(true);
        fetchUserConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversationId, fetchUserConversations]);

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
      const { data: conversationData, error: conversationError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: user?.id || null,
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
      if (!user) {
        localStorage.setItem(CONVERSATION_ID_KEY, conversationIdToUse!);
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

  const generateConversationSteps = useCallback((values: ChatbotFormValues): ConversationStep[] => {
    if (!dict?.chatbot || !dict?.quote) return [];

    const setValueWrapper = (name: string, value: any) => setValue(name as any, value);

    return [
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
  }, [dict, errors, getValues, handleSubmit, isSubmitting, register, setValue, addMessage, onSubmit]);

  const steps = generateConversationSteps(formValues);
  const currentConversationStep = steps[currentStep];

  // Step progression message effect
  useEffect(() => {
    if (!currentConversationStep?.botMessage || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') {
      addMessage(currentConversationStep.botMessage, 'bot');
    }
  }, [currentStep, currentConversationStep?.botMessage, addMessage]);

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