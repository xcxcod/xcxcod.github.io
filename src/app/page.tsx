import { ArrowRight, Github, Linkedin, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getProjects } from "@/services/portfolio-service";

export default async function HomePage() {
  const [profile, featuredProjects] = await Promise.all([getProfile(), getProjects({ featuredOnly: true })]);

  return (
    <>
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-line px-3 py-1 text-sm font-medium text-evergreen dark:border-slate-700 dark:text-teal-300">
              Information Technology student
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink dark:text-white sm:text-5xl">
              {profile.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/projects">View Projects <ArrowRight size={16} className="ml-2" /></LinkButton>
              <LinkButton href="/about" variant="secondary">About Me</LinkButton>
              <LinkButton href="/resume" variant="secondary">Request Resume</LinkButton>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-white px-5 text-sm font-semibold hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900">
                <Github size={16} /> GitHub
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-white px-5 text-sm font-semibold hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-teal-100/60 blur-3xl dark:bg-teal-900/20" />
            <div className="relative overflow-hidden rounded-md border border-line bg-slate-100 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="aspect-[4/5]">
                {profile.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.profileImageUrl} alt={`${profile.name} profile`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center text-sm text-slate-500">YOUR_PROFILE_IMAGE</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.technicalInterests.map((interest) => (
            <div key={interest} className="rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ShieldCheck className="mb-4 text-evergreen dark:text-teal-300" size={22} />
              <h2 className="font-semibold">{interest}</h2>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Selected work" title="Featured projects">
          Practical projects and placeholders for genuine academic or personal work as it becomes available.
        </SectionHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>
    </>
  );
}
