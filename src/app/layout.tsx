import type { Metadata } from "next";
import "@/app/globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getProfile } from "@/services/portfolio-service";

export const metadata: Metadata = {
  title: "IT Student Portfolio",
  description: "Professional portfolio for an Information Technology student."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-mist font-sans text-ink antialiased dark:bg-slate-950 dark:text-slate-100">
        <Navbar profile={profile} />
        <main>{children}</main>
        <Footer profile={profile} />
      </body>
    </html>
  );
}
