"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatbotFormValues, chatbotFormSchema } from '@/components/chatbot/chatbot-schema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';

// Types
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export interface Option {
  label: string;
  value: string;
  action: () => void;
}

export interface ConversationStep {
  botMessage: string;
  options?: Option[];
  renderInput?: React.ReactNode;
}

export interface UserConversation {
  id: string;
  initial_question: string;
  created_at: string;
  updated_at: string;
}

// Constants
const CONVERSATION_ID_KEY = 'chatbot_conversation_id';

// Custom hook for managing chatbot conversations
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

  // Message management
  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, sender }]);
  }, []);

  // Conversation reset
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

  // Fetch user conversations
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

  // Handle form submission
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

  // Handle offer submission
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

  // Handle question submission
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
      if (!user) {
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

  // Generate conversation steps
  const conversationSteps = useCallback((values: ChatbotFormValues): ConversationStep[] => {
    if (!dict || !dict.chatbot || !dict.quote) {
      return [];
    }

    const steps: (ConversationStep | false)[] = [
      createWelcomeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createProjectTypeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createSurfaceAreaStep(dict, register, errors, getValues, addMessage, toast),
      values.type === 'offer' && createSurfaceTypeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createTimingStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createContactStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
      values.type === 'question' && createQuestionStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
    ];
    
    return steps.filter(Boolean) as ConversationStep[];
  }, [dict, errors, getValues, handleSubmit, isSubmitting, register, setValue, addMessage, onSubmit]);

  const currentConversationStep = conversationSteps(formValues)[currentStep];

  useEffect(() => {
    if (currentConversationStep && currentConversationStep.botMessage && messages.length === 0) {
      addMessage(currentConversationStep.botMessage, 'bot');
    } else if (currentConversationStep && currentConversationStep.botMessage && messages[messages.length - 1]?.text !== currentConversationStep.botMessage && messages[messages.length - 1]?.sender === 'user') {
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

// Modular step creators
const createWelcomeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.welcome,
  options: [
    { label: dict.chatbot.optionOffer, value: "offer", action: () => {
        addMessage(dict.chatbot.optionOffer, 'user');
        setValue('type', 'offer');
        setCurrentStep(1);
      }
    },
    { label: dict.chatbot.optionQuestion, value: "question", action: () => {
        addMessage(dict.chatbot.optionQuestion, 'user');
        setValue('type', 'question');
        setCurrentStep(1);
      }
    },
  ],
  renderInput: undefined,
});

const createProjectTypeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionProjectType,
  options: [
    { label: dict.quote.types.gevel, value: "gevel", action: () => {
        addMessage(dict.quote.types.gevel, 'user');
        setValue('projectType', 'gevel');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.binnen, value: "binnen", action: () => {
        addMessage(dict.quote.types.binnen, 'user');
        setValue('projectType', 'binnen');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.totaal, value: "totaal", action: () => {
        addMessage(dict.quote.types.totaal, 'user');
        setValue('projectType', 'totaal');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.renovatie, value: "renovatie", action: () => {
        addMessage(dict.quote.types.renovatie, 'user');
        setValue('projectType', 'renovatie');
        setCurrentStep(2);
      }
    },
  ],
  renderInput: undefined,
});

const createSurfaceAreaStep = (dict: any, register: any, errors: any, getValues: any, addMessage: any, toast: any): ConversationStep => ({
  botMessage: dict.chatbot.questionSurfaceArea,
  renderInput: (
    <div className="space-y-2">
      <input
        type="number"
        placeholder={dict.quote.surface}
        {...register('surfaceArea')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.surfaceArea && <p className="text-red-500 text-xs">{errors.surfaceArea.message}</p>}
      <button
        type="button"
        onClick={() => {
          const area = getValues('surfaceArea');
          if (area) {
            addMessage(`${area} m²`, 'user');
            setCurrentStep(3);
          } else {
            toast.error(dict.chatbot.errorSurfaceArea);
          }
        }}
        className="w-full bg-brand-dark text-white py-2 mt-2 rounded-none hover:bg-brand-bronze transition-colors"
      >
        {dict.chatbot.send}
      </button>
    </div>
  ),
  options: undefined,
});

const createSurfaceTypeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionSurfaceType,
  options: [
    { label: dict.quote.surfaces.baksteen, value: "baksteen", action: () => {
        addMessage(dict.quote.surfaces.baksteen, 'user');
        setValue('surfaceType', 'baksteen');
        setCurrentStep(4);
      }
    },
    { label: dict.quote.surfaces.crepi, value: "crepi", action: () => {
        addMessage(dict.quote.surfaces.crepi, 'user');
        setValue('surfaceType', 'crepi');
        setCurrentStep(4);
      }
    },
    { label: dict.quote.surfaces.onbekend, value: "onbekend", action: () => {
        addMessage(dict.quote.surfaces.onbekend, 'user');
        setValue('surfaceType', 'onbekend');
        setCurrentStep(4);
      }
    },
  ],
  renderInput: undefined,
});

const createTimingStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionTiming,
  options: [
    { label: dict.quote.timings.asap, value: "asap", action: () => {
        addMessage(dict.quote.timings.asap, 'user');
        setValue('timing', 'asap');
        setCurrentStep(5);
      }
    },
    { label: dict.quote.timings['1-3_maanden'], value: "1-3_maanden", action: () => {
        addMessage(dict.quote.timings['1-3_maanden'], 'user');
        setValue('timing', '1-3_maanden');
        setCurrentStep(5);
      }
    },
    { label: dict.quote.timings.later, value: "later", action: () => {
        addMessage(dict.quote.timings.later, 'user');
        setValue('timing', 'later');
        setCurrentStep(5);
      }
    },
  ],
  renderInput: undefined,
});

const createContactStep = (dict: any, register: any, errors: any, handleSubmit: any, onSubmit: any, isSubmitting: any): ConversationStep => ({
  botMessage: dict.chatbot.questionContact,
  renderInput: (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        type="text"
        placeholder={dict.quote.name}
        {...register('name')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      <input
        type="email"
        placeholder={dict.quote.email}
        {...register('email')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
     I'll continue with the refactoring by completing the modular step creators and adding the missing functions:

<dyad-write path="src/hooks/use-chatbot-conversation.tsx" description="Complete the modular refactoring with remaining step creators">
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatbotFormValues, chatbotFormSchema } from '@/components/chatbot/chatbot-schema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';

// Types
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export interface Option {
  label: string;
  value: string;
  action: () => void;
}

export interface ConversationStep {
  botMessage: string;
  options?: Option[];
  renderInput?: React.ReactNode;
}

export interface UserConversation {
  id: string;
  initial_question: string;
  created_at: string;
  updated_at: string;
}

// Constants
const CONVERSATION_ID_KEY = 'chatbot_conversation_id';

// Custom hook for managing chatbot conversations
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

  // Message management
  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, sender }]);
  }, []);

  // Conversation reset
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

  // Fetch user conversations
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

  // Handle form submission
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

  // Handle offer submission
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

  // Handle question submission
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
      if (!user) {
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

  // Generate conversation steps
  const conversationSteps = useCallback((values: ChatbotFormValues): ConversationStep[] => {
    if (!dict || !dict.chatbot || !dict.quote) {
      return [];
    }

    const steps: (ConversationStep | false)[] = [
      createWelcomeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createProjectTypeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createSurfaceAreaStep(dict, register, errors, getValues, addMessage, toast),
      values.type === 'offer' && createSurfaceTypeStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createTimingStep(dict, setValue, setCurrentStep, addMessage),
      values.type === 'offer' && createContactStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
      values.type === 'question' && createQuestionStep(dict, register, errors, handleSubmit, onSubmit, isSubmitting),
    ];
    
    return steps.filter(Boolean) as ConversationStep[];
  }, [dict, errors, getValues, handleSubmit, isSubmitting, register, setValue, addMessage, onSubmit]);

  const currentConversationStep = conversationSteps(formValues)[currentStep];

  useEffect(() => {
    if (currentConversationStep && currentConversationStep.botMessage && messages.length === 0) {
      addMessage(currentConversationStep.botMessage, 'bot');
    } else if (currentConversationStep && currentConversationStep.botMessage && messages[messages.length - 1]?.text !== currentConversationStep.botMessage && messages[messages.length - 1]?.sender === 'user') {
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

// Modular step creators
const createWelcomeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.welcome,
  options: [
    { label: dict.chatbot.optionOffer, value: "offer", action: () => {
        addMessage(dict.chatbot.optionOffer, 'user');
        setValue('type', 'offer');
        setCurrentStep(1);
      }
    },
    { label: dict.chatbot.optionQuestion, value: "question", action: () => {
        addMessage(dict.chatbot.optionQuestion, 'user');
        setValue('type', 'question');
        setCurrentStep(1);
      }
    },
  ],
  renderInput: undefined,
});

const createProjectTypeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionProjectType,
  options: [
    { label: dict.quote.types.gevel, value: "gevel", action: () => {
        addMessage(dict.quote.types.gevel, 'user');
        setValue('projectType', 'gevel');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.binnen, value: "binnen", action: () => {
        addMessage(dict.quote.types.binnen, 'user');
        setValue('projectType', 'binnen');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.totaal, value: "totaal", action: () => {
        addMessage(dict.quote.types.totaal, 'user');
        setValue('projectType', 'totaal');
        setCurrentStep(2);
      }
    },
    { label: dict.quote.types.renovatie, value: "renovatie", action: () => {
        addMessage(dict.quote.types.renovatie, 'user');
        setValue('projectType', 'renovatie');
        setCurrentStep(2);
      }
    },
  ],
  renderInput: undefined,
});

const createSurfaceAreaStep = (dict: any, register: any, errors: any, getValues: any, addMessage: any, toast: any): ConversationStep => ({
  botMessage: dict.chatbot.questionSurfaceArea,
  renderInput: (
    <div className="space-y-2">
      <input
        type="number"
        placeholder={dict.quote.surface}
        {...register('surfaceArea')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.surfaceArea && <p className="text-red-500 text-xs">{errors.surfaceArea.message}</p>}
      <button
        type="button"
        onClick={() => {
          const area = getValues('surfaceArea');
          if (area) {
            addMessage(`${area} m²`, 'user');
            setCurrentStep(3);
          } else {
            toast.error(dict.chatbot.errorSurfaceArea);
          }
        }}
        className="w-full bg-brand-dark text-white py-2 mt-2 rounded-none hover:bg-brand-bronze transition-colors"
      >
        {dict.chatbot.send}
      </button>
    </div>
  ),
  options: undefined,
});

const createSurfaceTypeStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionSurfaceType,
  options: [
    { label: dict.quote.surfaces.baksteen, value: "baksteen", action: () => {
        addMessage(dict.quote.surfaces.baksteen, 'user');
        setValue('surfaceType', 'baksteen');
        setCurrentStep(4);
      }
    },
    { label: dict.quote.surfaces.crepi, value: "crepi", action: () => {
        addMessage(dict.quote.surfaces.crepi, 'user');
        setValue('surfaceType', 'crepi');
        setCurrentStep(4);
      }
    },
    { label: dict.quote.surfaces.onbekend, value: "onbekend", action: () => {
        addMessage(dict.quote.surfaces.onbekend, 'user');
        setValue('surfaceType', 'onbekend');
        setCurrentStep(4);
      }
    },
  ],
  renderInput: undefined,
});

const createTimingStep = (dict: any, setValue: any, setCurrentStep: any, addMessage: any): ConversationStep => ({
  botMessage: dict.chatbot.questionTiming,
  options: [
    { label: dict.quote.timings.asap, value: "asap", action: () => {
        addMessage(dict.quote.timings.asap, 'user');
        setValue('timing', 'asap');
        setCurrentStep(5);
      }
    },
    { label: dict.quote.timings['1-3_maanden'], value: "1-3_maanden", action: () => {
        addMessage(dict.quote.timings['1-3_maanden'], 'user');
        setValue('timing', '1-3_maanden');
        setCurrentStep(5);
      }
    },
    { label: dict.quote.timings.later, value: "later", action: () => {
        addMessage(dict.quote.timings.later, 'user');
        setValue('timing', 'later');
        setCurrentStep(5);
      }
    },
  ],
  renderInput: undefined,
});

const createContactStep = (dict: any, register: any, errors: any, handleSubmit: any, onSubmit: any, isSubmitting: any): ConversationStep => ({
  botMessage: dict.chatbot.questionContact,
  renderInput: (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        type="text"
        placeholder={dict.quote.name}
        {...register('name')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      <input
        type="email"
        placeholder={dict.quote.email}
        {...register('email')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      <input
        type="tel"
        placeholder={dict.quote.phone}
        {...register('phone')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      <input
        type="text"
        placeholder={dict.quote.postalCode}
        {...register('postalCode')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode.message}</p>}
      <input
        type="text"
        placeholder={dict.quote.city}
        {...register('city')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-dark text-white py-2 mt-2 rounded-none hover:bg-brand-bronze transition-colors"
      >
        {isSubmitting ? dict.chatbot.sending : dict.chatbot.send}
      </button>
    </form>
  ),
  options: undefined,
});

const createQuestionStep = (dict: any, register: any, errors: any, handleSubmit: any, onSubmit: any, isSubmitting: any): ConversationStep => ({
  botMessage: dict.chatbot.questionContact,
  renderInput: (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <textarea
        placeholder={dict.chatbot.yourQuestion}
        {...register('questionText')}
        rows={4}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.questionText && <p className="text-red-500 text-xs">{errors.questionText.message}</p>}
      <input
        type="text"
        placeholder={dict.quote.name}
        {...register('name')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      <input
        type="email"
        placeholder={dict.quote.email}
        {...register('email')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      <input
        type="tel"
        placeholder={dict.quote.phone}
        {...register('phone')}
        className="w-full p-2 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
      />
      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-dark text-white py-2 mt-2 rounded-none hover:bg-brand-bronze transition-colors"
      >
        {isSubmitting ? dict.chatbot.sending : dict.chatbot.send}
      </button>
    </form>
  ),
  options: undefined,
});