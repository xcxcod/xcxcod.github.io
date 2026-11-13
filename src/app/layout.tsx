import type { Metadata } from "next";
import "@/app/globals.css";
import { IntroOverlay } from "@/components/intro/intro-overlay";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { profile } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Dani Adonai | IT Portfolio",
  description: "Selected projects and technical learning from Dani Adonai, an Information Technology student at RMIT University."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-mist font-sans text-ink antialiased dark:bg-slate-950 dark:text-slate-100">
        <Navbar profile={profile} />
        <main>{children}</main>
        <Footer profile={profile} />
        <IntroOverlay autoplay={false} />
      </body>
    </html>
  );
}
