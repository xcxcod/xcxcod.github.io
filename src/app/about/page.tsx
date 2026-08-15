"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function AboutPage() {
  const { profile } = usePublicPortfolio();
  const sections = [
    ["Current university studies", `${profile.currentStudies} Based in ${profile.location}, my current focus is building practical, security-aware technology skills while studying at ${profile.university}.`],
    ["Technical interests", profile.technicalInterests.join(", ")],
    ["Career interests", profile.careerInterests.join(", ")],
    ["Current learning areas", profile.currentLearning.join(", ")],
    ["Professional goals", profile.professionalGoals]
  ];

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="// about" title="A developing IT professional with practical engineering habits">
        {profile.biography}
      </SectionHeading>
      <div className="mt-14 grid gap-x-12 lg:grid-cols-2">
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
