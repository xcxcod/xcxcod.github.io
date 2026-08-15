import type { SkillGroup as SkillGroupType } from "@/types/portfolio";

export function SkillGroup({ group }: { group: SkillGroupType }) {
  return (
    <section className="border-t border-ink/15 py-6 dark:border-white/15">
      <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-accent dark:text-teal-300">{group.category}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {group.skills.map((skill) => (
          <span key={skill} className="border-b border-ink/10 pb-3 text-lg font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
