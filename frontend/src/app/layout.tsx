import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Airbnb Full Clone - Microservicios & IA",
  description: "Clon de Airbnb con arquitectura de microservicios | Next.js 16 + FastAPI + SQLite | JWT Auth, Booking System, Reviews & Favorites | shadcn/ui + TailwindCSS | TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#121212] text-[#222222] dark:text-[#f3f4f6] antialiased transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}