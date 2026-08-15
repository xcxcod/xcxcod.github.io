"use client";

import { ToolkitSection } from "@/components/skills/toolkit-section";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function SkillsPage() {
  const { skills } = usePublicPortfolio();

  return (
    <section className="section-shell py-16 sm:py-24">
      <ToolkitSection skills={skills} compact />
    </section>
  );
}
