import type { Metadata } from "next";
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
      <head>
        <link
          rel="preload"
          href="/fonts/AirbnbCereal-Bk.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/AirbnbCereal-Md.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
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