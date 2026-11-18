import type { Metadata } from "next";
import "@/app/globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { profile } from "@/lib/sample-data";
import { StudioIntro } from "@/components/layout/studio-intro";
import { FluidCursor } from "@/components/layout/fluid-cursor";

export const metadata: Metadata = {
  title: "Dani Adonai | IT Portfolio",
  description: "Selected projects and technical learning from Dani Adonai, an Information Technology student at RMIT University."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a className="skip-to-content" href="#portfolio-main">Skip to content</a>
        <div id="portfolio-page">
          <Navbar profile={profile} />
          <main id="portfolio-main" tabIndex={-1}>{children}</main>
          <Footer profile={profile} />
        </div>
        <StudioIntro />
        <FluidCursor />
      </body>
    </html>
  );
}
