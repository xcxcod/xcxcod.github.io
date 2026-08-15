import type { SkillGroup as SkillGroupType } from "@/types/portfolio";

export function SkillGroup({ group }: { group: SkillGroupType }) {
  return (
    <section className="rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">{group.category}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span key={skill} className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
