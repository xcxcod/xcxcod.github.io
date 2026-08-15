"use client";

import { ArrowRight, Github, Linkedin } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { SkillGroup } from "@/components/skills/skill-group";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <section className="section-shell min-h-[calc(100vh-73px)] py-16 sm:py-20 lg:py-24">
        <div className="grid min-h-[70vh] gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="reveal-in">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-accent dark:text-teal-300">DANI ADONAI</p>
            <h1 className="mt-8 max-w-5xl text-balance text-6xl font-semibold leading-[0.88] tracking-tight text-ink dark:text-white sm:text-7xl lg:text-8xl">
              Hello World.
              <span className="block text-slate-500 dark:text-slate-400">I&apos;m Dani, an IT student building across software, cloud and cybersecurity.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {profile.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <LinkButton href="#selected-work">View My Work <ArrowRight size={16} className="ml-2" /></LinkButton>
              <LinkButton href="/about" variant="secondary">About Me</LinkButton>
              <LinkButton href="/resume" variant="ghost">Request Resume</LinkButton>
            </div>
            <div className="mt-8 flex gap-5">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 hover:text-accent dark:text-slate-300">
                <Github size={16} /> GitHub
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 hover:text-accent dark:text-slate-300">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
          <aside className="reveal-in border-l border-ink/15 pl-6 dark:border-white/15">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{"// focus_areas"}</p>
            <div className="mt-6 grid gap-4">
              {profile.technicalInterests.map((interest) => (
                <p key={interest} className="text-2xl font-semibold leading-none">{interest}</p>
              ))}
            </div>
            <div className="mt-10 aspect-[4/5] overflow-hidden border border-ink/15 bg-slate-100 shadow-[12px_12px_0_rgba(23,32,51,0.08)] dark:border-white/15 dark:bg-slate-900">
              {profile.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.profileImageUrl} alt={`${profile.name} profile`} className="h-full w-full object-cover" />
              ) : (
                <div className="image-noise flex h-full items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">YOUR_PROFILE_IMAGE</div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="selected-work" className="section-shell py-20 sm:py-28">
        <div className="mb-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// selected_work"}</p>
          <div>
            <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">Projects as practical proof of learning.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Academic and personal technology projects, presented as case studies rather than a wall of identical cards.
            </p>
          </div>
        </div>
        <div>
          {featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
        <LinkButton href="/projects" variant="secondary" className="mt-8">All Projects</LinkButton>
      </section>

      <section className="section-shell py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// about"}</p>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">Building technical range with a careful, security-aware mindset.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{profile.biography}</p>
            </div>
            <div className="border-l border-ink/15 pl-6 dark:border-white/15">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{"// currently"}</p>
              <div className="mt-6 grid gap-4 text-xl font-semibold">
                {[profile.currentStudies, ...profile.currentLearning].slice(0, 5).map((item) => <p key={item}>{item}</p>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-20 sm:py-28">
        <div className="mb-10 grid gap-6 lg:grid-cols-[320px_1fr]">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// toolkit"}</p>
          <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">Technologies I&apos;m learning and applying.</h2>
        </div>
        <div className="grid gap-x-12 lg:grid-cols-2">
          {skills.map((group) => <SkillGroup key={group.id} group={group} />)}
        </div>
      </section>

      <section className="section-shell pb-24 pt-16">
        <div className="border-y border-ink/15 py-16 dark:border-white/15">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// contact"}</p>
          <h2 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            Interested in internships, graduate roles, or a technical conversation?
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/contact">Contact</LinkButton>
            <LinkButton href="/resume" variant="secondary">Request Resume</LinkButton>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/20 px-5 font-mono text-sm font-semibold uppercase tracking-[0.16em] transition hover:border-accent hover:text-accent dark:border-white/25">
              LinkedIn
            </a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/20 px-5 font-mono text-sm font-semibold uppercase tracking-[0.16em] transition hover:border-accent hover:text-accent dark:border-white/25">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
