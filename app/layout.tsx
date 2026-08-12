import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppToaster } from "@/components/app-toaster";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberSaaS — Gestão de Barbearia",
  description: "Agenda, clientes, financeiro e relacionamento via WhatsApp em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
