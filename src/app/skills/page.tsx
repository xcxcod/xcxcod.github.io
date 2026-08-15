"use client";

import { SkillGroup } from "@/components/skills/skill-group";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function SkillsPage() {
  const { skills } = usePublicPortfolio();

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="// toolkit" title="Technologies grouped by how I use them">
        Skills are shown by category without inflated proficiency claims. Admin-entered detail can be added later where useful.
      </SectionHeading>
      <div className="mt-14 grid gap-x-12 lg:grid-cols-2">
        {skills.map((group) => <SkillGroup key={group.id} group={group} />)}
      </div>
    </section>
  );
}
