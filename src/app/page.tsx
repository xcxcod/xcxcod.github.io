"use client";

import { ArrowRight, Github, Linkedin } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ProjectIndex } from "@/components/projects/project-index";
import { ToolkitSection } from "@/components/skills/toolkit-section";
import { ProfilePuzzle } from "@/features/profile-puzzle/profile-puzzle";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <section className="section-shell min-h-[calc(100vh-73px)] py-12 sm:py-16 lg:py-20">
        <div className="grid min-h-[72vh] gap-10 lg:grid-cols-[minmax(0,1.16fr)_430px] lg:items-end xl:grid-cols-[minmax(0,1.28fr)_430px]">
          <div className="reveal-in">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-accent dark:text-teal-300">DANI ADONAI</p>
            <h1 className="mt-8 max-w-[58rem] text-balance text-5xl font-semibold leading-[0.94] tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Hello World.
              <span className="block text-slate-500 dark:text-slate-400">I&apos;m Dani, an IT student building across software, cloud and cybersecurity.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {profile.intro}
            </p>
            <div className="mt-7 max-w-2xl border-y border-ink/10 py-4 dark:border-white/10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{profile.university}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-ink dark:text-white">
                  {profile.study} student
                  <span className="mx-2 text-slate-300 dark:text-slate-600" aria-hidden="true">/</span>
                  {profile.location}
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
              <LinkButton href="#selected-work">View My Work <ArrowRight size={16} className="ml-2" /></LinkButton>
              <LinkButton href="/about" variant="secondary">About Me</LinkButton>
              <a href="/resume" className="inline-flex min-h-11 items-center gap-2 px-2 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:translate-x-1 hover:text-accent dark:text-slate-300">
                Request Resume <ArrowRight size={15} />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-ink/15 px-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200">
                <Github size={17} /> GitHub
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-ink/15 px-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200">
                <Linkedin size={17} /> LinkedIn
              </a>
            </div>
          </div>
          <aside className="reveal-in">
            <div className="relative">
              <div className="absolute -left-5 top-8 hidden h-[82%] w-px bg-ink/15 dark:bg-white/15 lg:block" />
              <div className="pointer-events-none absolute -left-4 top-8 hidden h-28 w-28 border-l border-t border-accent/35 lg:block" />
              <ProfilePuzzle imageUrl={profile.profileImageUrl} alt={`${profile.name} profile`} />
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-0 border-y border-ink/10 py-2 dark:border-white/10">
                {profile.technicalInterests.map((interest, index) => (
                  <p key={interest} className="flex items-center gap-3 border-b border-ink/10 py-2 text-sm font-semibold leading-tight last:border-b-0 dark:border-white/10 sm:text-[0.95rem] [&:nth-last-child(2)]:border-b-0">
                    <span className="font-mono text-[0.68rem] font-normal text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    {interest}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="selected-work" className="bg-ink text-white">
        <div className="section-shell py-16 sm:py-20 lg:py-28">
          <div className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr]">
            <p className="font-mono text-sm text-accent dark:text-teal-300">{"// selected_work"}</p>
            <div>
              <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">Project index for practical learning.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Academic and personal builds, browsed like an editorial index instead of a conventional card wall.
              </p>
            </div>
          </div>
          <ProjectIndex projects={featuredProjects.length ? featuredProjects : projects} />
          <LinkButton href="/projects" variant="secondary" className="mt-6 border-white/25 text-white hover:border-teal-200 hover:text-teal-200">All Projects</LinkButton>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// about"}</p>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">Learning widely, building carefully, and keeping security in view.</h2>
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

      <section className="section-shell overflow-hidden border-y border-ink/10 py-10 dark:border-white/10 sm:py-14" aria-label="Technical focus words">
        <div className="grid gap-2 text-[clamp(3.5rem,12vw,9rem)] font-semibold uppercase leading-[0.78] tracking-tight text-ink/10 dark:text-white/10 sm:grid-cols-2">
          <p>Software</p>
          <p className="sm:text-right">Security</p>
          <p>Cloud</p>
          <p className="sm:text-right">Systems</p>
        </div>
        <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">01010011 / build carefully / learn continuously</p>
      </section>

      <ToolkitSection skills={skills} />

      <section className="overflow-hidden bg-ink text-white">
        <div className="section-shell py-16 sm:py-20 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <p className="font-mono text-sm text-accent dark:text-teal-300">{"// contact"}</p>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">STATUS / OPEN_TO_CONVERSATION</p>
              <h2 className="mt-5 text-[clamp(4rem,13vw,10rem)] font-semibold uppercase leading-[0.78] tracking-tight">
                Let&apos;s<br />Build<br />Something.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Open to internship opportunities, graduate roles, and technical conversations.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 lg:ml-[320px]">
            <LinkButton href="/contact">Contact</LinkButton>
            <LinkButton href="/resume" variant="secondary">Request Resume</LinkButton>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center px-3 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:text-white">
              LinkedIn
            </a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center px-3 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
