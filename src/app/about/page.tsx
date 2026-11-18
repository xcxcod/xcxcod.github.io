"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function AboutPage() {
  const { profile } = usePublicPortfolio();
  const sections = [
    ["Technical interests", profile.technicalInterests.join(", ")],
    ["Career interests", profile.careerInterests.join(", ")],
    ["Current learning areas", profile.currentLearning.join(", ")],
    ["Professional goals", profile.professionalGoals]
  ];

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="About" title="Learning by building">
        {profile.biography}
      </SectionHeading>
      <section aria-labelledby="education-title" className="mt-12 grid gap-4 border-y border-current/15 py-8 md:grid-cols-[12rem_1fr]">
        <h2 id="education-title" className="editorial-label">Education</h2>
        <div>
          <p className="text-3xl font-semibold">{profile.university}</p>
          <p className="mt-2">{profile.study} · {profile.location}</p>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">{profile.currentStudies}</p>
        </div>
      </section>
      <div className="mt-10 grid gap-x-12 lg:grid-cols-2">
        {sections.map(([title, body]) => (
          <article key={title} className="border-t border-ink/15 py-7 dark:border-white/15">
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-accent dark:text-teal-300">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
