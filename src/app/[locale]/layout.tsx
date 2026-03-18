import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ChatbotButton } from "@/components/chatbot/chatbot-button"; // Import the ChatbotButton

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="noise-overlay" />
      <ScrollProgress />
      <SmoothScroll>
          {children}
      </SmoothScroll>
      <ChatbotButton /> {/* Add the ChatbotButton here */}
    </AuthProvider>
  );
}