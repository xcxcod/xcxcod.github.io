import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile } from "@/services/portfolio-service";

export default async function AboutPage() {
  const profile = await getProfile();
  const sections = [
    ["Current university studies", profile.currentStudies],
    ["Technical interests", profile.technicalInterests.join(", ")],
    ["Career interests", profile.careerInterests.join(", ")],
    ["Current learning areas", profile.currentLearning.join(", ")],
    ["Professional goals", profile.professionalGoals]
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="About" title="A developing IT professional with practical engineering habits">
        {profile.biography}
      </SectionHeading>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <article key={title} className="rounded-md border border-line bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
