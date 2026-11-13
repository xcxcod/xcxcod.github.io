import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { profile } from "@/lib/sample-data";

const displayFont = localFont({
  src: "../../public/fonts/ChakraPetch-SemiBold.ttf",
  weight: "600",
  display: "swap",
  variable: "--portfolio-display-font"
});

export const metadata: Metadata = {
  title: "Dani Adonai | IT Portfolio",
  description: "Selected projects and technical learning from Dani Adonai, an Information Technology student at RMIT University."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${displayFont.variable}`} suppressHydrationWarning>
      <body className="bg-mist font-sans text-ink antialiased dark:bg-slate-950 dark:text-slate-100">
        <Navbar profile={profile} />
        <main>{children}</main>
        <Footer profile={profile} />
      </body>
    </html>
  );
}
