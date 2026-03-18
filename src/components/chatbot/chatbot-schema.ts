import * as z from "zod";

export const chatbotFormSchema = z.object({
  type: z.enum(["offer", "question"]), // Initial choice
  projectType: z.enum(["gevel", "binnen", "totaal", "renovatie", "vraag"]).optional(), // 'vraag' for general questions
  surfaceArea: z.string().optional(),
  surfaceType: z.enum(["baksteen", "crepi", "onbekend"]).optional(),
  timing: z.enum(["asap", "1-3_maanden", "later"]).optional(),
  name: z.string().min(2, "Naam is te kort"),
  email: z.string().email("Ongeldig emailadres"),
  phone: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  questionText: z.string().optional(), // For general questions
});

export type ChatbotFormValues = z.infer<typeof chatbotFormSchema>;