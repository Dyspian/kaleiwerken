import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Storage key for anonymous conversations
export const CONVERSATION_ID_KEY = 'chatbot_conversation_id';

// Create a new conversation
export const createConversation = async (
  userId: string | null,
  name: string,
  email: string,
  phone: string | null,
  initialQuestion: string
) => {
  const { data, error } = await supabase
    .from("chatbot_conversations")
    .insert({
      user_id: userId,
      name,
      email,
      phone,
      initial_question: initialQuestion,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    toast.error("Fout bij aanmaken conversatie");
    throw error;
  }

  return data;
};

// Add a message to a conversation
export const addMessageToConversation = async (
  conversationId: string,
  sender: 'user' | 'admin',
  messageText: string
) => {
  const { error } = await supabase
    .from("chatbot_messages")
    .insert({
      conversation_id: conversationId,
      sender,
      message_text: messageText,
    });

  if (error) {
    toast.error("Fout bij verzenden bericht");
    throw error;
  }
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('chatbot_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    toast.error("Fout bij ophalen berichten");
    throw error;
  }

  return data;
};

// Get user's conversations
export const getUserConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('chatbot_conversations')
    .select('id, initial_question, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    toast.error("Fout bij ophalen conversaties");
    throw error;
  }

  return data;
};

// Convert form data to lead data
export const convertToLeadData = (formData: any) => ({
  project_type: formData.projectType,
  surface_area: formData.surfaceArea || null,
  surface_type: formData.surfaceType || null,
  timing: formData.timing || null,
  name: formData.name,
  email: formData.email,
  phone: formData.phone || null,
  postal_code: formData.postalCode || null,
  city: formData.city || null,
  notes: null,
  status: 'nieuw',
});

// Validate surface area input
export const validateSurfaceArea = (area: string): boolean => {
  const num = parseFloat(area);
  return !isNaN(num) && num > 0 && num < 10000; // Reasonable limits
};

// Format conversation timestamp
export const formatConversationTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins} minuten geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  
  return date.toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'short',
    year: diffDays > 365 ? 'numeric' : undefined
  });
};