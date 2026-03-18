import { Message } from './use-chatbot-conversation';

export interface ConversationStep {
  botMessage: string;
  options?: Array<{
    label: string;
    value: string;
    action: () => void;
  }>;
  renderInput?: React.ReactNode;
}

// Base step creator with common functionality
const createStep = (
  botMessage: string,
  options?: Array<{ label: string; value: string; action: () => void }>,
  renderInput?: React.ReactNode
): ConversationStep => ({
  botMessage,
  options,
  renderInput,
});

// Welcome step
export const createWelcomeStep = (
  dict: any,
  setValue: (name: string, value: any) => void,
  setCurrentStep: (step: number) => void,
  addMessage: (text: string, sender: 'user' | 'bot') => void
): ConversationStep => createStep(
  dict.chatbot.welcome,
  [
    {
      label: dict.chatbot.optionOffer,
      value: "offer",
      action: () => {
        addMessage(dict.chatbot.optionOffer, 'user');
        setValue('type', 'offer');
        setCurrentStep(1);
      }
    },
    {
      label: dict.chatbot.optionQuestion,
      value: "question",
      action: () => {
        addMessage(dict.chatbot.optionQuestion, 'user');
        setValue('type', 'question');
        setCurrentStep(1);
      }
    },
  ]
);

// Project type step
export const createProjectTypeStep = (
  dict: any,
  setValue: (name: string, value: any) => void,
  setCurrentStep: (step: number) => void,
  addMessage: (text: string, sender: 'user' | 'bot') => void
): ConversationStep => createStep(
  dict.chatbot.questionProjectType,
  [
    {
      label: dict.quote.types.gevel,
      value: "gevel",
      action: () => {
        addMessage(dict.quote.types.gevel, 'user');
        setValue('projectType', 'gevel');
        setCurrentStep(2);
      }
    },
    {
      label: dict.quote.types.binnen,
      value: "binnen",
      action: () => {
        addMessage(dict.quote.types.binnen, 'user');
        setValue('projectType', 'binnen');
        setCurrentStep(2);
      }
    },
    {
      label: dict.quote.types.totaal,
      value: "totaal",
      action: () => {
        addMessage(dict.quote.types.totaal, 'user');
        setValue('projectType', 'totaal');
        setCurrentStep(2);
      }
    },
    {
      label: dict.quote.types.renovatie,
      value: "renovatie",
      action: () => {
        addMessage(dict.quote.types.renovatie, 'user');
        setValue('projectType', 'renovatie');
        setCurrentStep(2);
      }
    },
  ]
);

// Surface area step with input
export const createSurfaceAreaStep = (
  dict: any,
  register: any,
  errors: any,
  getValues: (name: string) => any,
  addMessage: (text: string, sender: 'user' | 'bot') => void,
  toast: any,
  setCurrentStep: (step: number) => void
): ConversationStep => createStep(
  dict.chatbot.questionSurfaceArea,
  undefined,
  (
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
  )
);

// Surface type step
export const createSurfaceTypeStep = (
  dict: any,
  setValue: (name: string, value: any) => void,
  setCurrentStep: (step: number) => void,
  addMessage: (text: string, sender: 'user' | 'bot') => void
): ConversationStep => createStep(
  dict.chatbot.questionSurfaceType,
  [
    {
      label: dict.quote.surfaces.baksteen,
      value: "baksteen",
      action: () => {
        addMessage(dict.quote.surfaces.baksteen, 'user');
        setValue('surfaceType', 'baksteen');
        setCurrentStep(4);
      }
    },
    {
      label: dict.quote.surfaces.crepi,
      value: "crepi",
      action: () => {
        addMessage(dict.quote.surfaces.crepi, 'user');
        setValue('surfaceType', 'crepi');
        setCurrentStep(4);
      }
    },
    {
      label: dict.quote.surfaces.onbekend,
      value: "onbekend",
      action: () => {
        addMessage(dict.quote.surfaces.onbekend, 'user');
        setValue('surfaceType', 'onbekend');
        setCurrentStep(4);
      }
    },
  ]
);

// Timing step
export const createTimingStep = (
  dict: any,
  setValue: (name: string, value: any) => void,
  setCurrentStep: (step: number) => void,
  addMessage: (text: string, sender: 'user' | 'bot') => void
): ConversationStep => createStep(
  dict.chatbot.questionTiming,
  [
    {
      label: dict.quote.timings.asap,
      value: "asap",
      action: () => {
        addMessage(dict.quote.timings.asap, 'user');
        setValue('timing', 'asap');
        setCurrentStep(5);
      }
    },
    {
      label: dict.quote.timings['1-3_maanden'],
      value: "1-3_maanden",
      action: () => {
        addMessage(dict.quote.timings['1-3_maanden'], 'user');
        setValue('timing', '1-3_maanden');
        setCurrentStep(5);
      }
    },
    {
      label: dict.quote.timings.later,
      value: "later",
      action: () => {
        addMessage(dict.quote.timings.later, 'user');
        setValue('timing', 'later');
        setCurrentStep(5);
      }
    },
  ]
);

// Contact step for offers
export const createContactStep = (
  dict: any,
  register: any,
  errors: any,
  handleSubmit: any,
  onSubmit: any,
  isSubmitting: any
): ConversationStep => createStep(
  dict.chatbot.questionContact,
  undefined,
  (
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
  )
);

// Question step for general questions
export const createQuestionStep = (
  dict: any,
  register: any,
  errors: any,
  handleSubmit: any,
  onSubmit: any,
  isSubmitting: any
): ConversationStep => createStep(
  dict.chatbot.questionContact,
  undefined,
  (
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
  )
);