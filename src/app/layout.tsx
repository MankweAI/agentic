import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/them-provider";
import { ChatProvider } from "@/context/user-chat-context";
import GoogleAnalytics from "../components/GoogleAnalytics";


const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agentic Software",
  description: "Created by Agentic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ChatProvider>
        <html lang="en">
          <body className={jakarta.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <GoogleAnalytics />
            </ThemeProvider>
          </body>
        </html>
      </ChatProvider>
    </ClerkProvider>
  );
}
