"use client";

import { ToolkitSection } from "@/components/skills/toolkit-section";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import { SectionHeading } from "@/components/ui/section-heading";

export default function SkillsPage() {
  const { skills } = usePublicPortfolio();

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="Skills" title="Technical toolkit" />
      <div className="mt-8"><ToolkitSection skills={skills} /></div>
    </section>
  );
}
