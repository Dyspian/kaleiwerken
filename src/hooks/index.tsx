export { useChatbotConversation } from './use-chatbot-conversation';
export type { Message, UserConversation } from './use-chatbot-conversation';
export type { ConversationStep } from './chatbot-steps';
export {
  createWelcomeStep,
  createProjectTypeStep,
  createSurfaceAreaStep,
  createSurfaceTypeStep,
  createTimingStep,
  createContactStep,
  createQuestionStep
} from './chatbot-steps';
export {
  createConversation,
  addMessageToConversation,
  getConversationMessages,
  getUserConversations,
  convertToLeadData,
  validateSurfaceArea,
  formatConversationTime,
  CONVERSATION_ID_KEY
} from './chatbot-utils';