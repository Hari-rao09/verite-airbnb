import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "VÉRITÉ ESCAPES — Discover Places Worth Travelling For",
  description: "Curated collection of extraordinary architectural spaces, heritage sanctuaries, and slow travel retreats across India and worldwide.",
  keywords: ["luxury travel", "heritage havelis", "slow travel", "handpicked stays", "architectural retreats"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-400 selection:text-zinc-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}