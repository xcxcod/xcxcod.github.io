import { SkillGroup } from "@/components/skills/skill-group";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSkills } from "@/services/portfolio-service";

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Skills" title="Technical areas">
        Skills are shown by category without inflated proficiency claims. Admin-entered detail can be added later where useful.
      </SectionHeading>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {skills.map((group) => <SkillGroup key={group.id} group={group} />)}
      </div>
    </section>
  );
}
