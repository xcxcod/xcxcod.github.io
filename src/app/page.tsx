"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { ToolkitSection } from "@/components/skills/toolkit-section";
import { ProfilePuzzle } from "@/features/profile-puzzle/profile-puzzle";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const homepageProjects = projects.filter((project) => project.featured);

  return (
    <>
      <section className="cinematic-section section-shell min-h-[calc(100vh-73px)] py-12 sm:py-16 lg:py-20">
        <div className="grid min-h-[72vh] gap-10 lg:grid-cols-[minmax(0,1.16fr)_430px] lg:items-end xl:grid-cols-[minmax(0,1.28fr)_430px]">
          <div className="reveal-in">
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-accent dark:text-teal-300">DANI ADONAI</p>
            <h1 className="mt-8 max-w-[58rem] text-balance text-5xl font-semibold leading-[0.94] tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Hello World.
              <span className="block text-slate-500 dark:text-slate-400">I&apos;m Dani, an IT student building across software, cloud and cybersecurity.</span>
            </h1>
            <div className="mt-8 max-w-2xl border-y border-ink/10 py-4 dark:border-white/10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{profile.university}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-ink dark:text-white">
                  {profile.study} / {profile.location}
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
              <LinkButton href="#selected-work">View My Work <ArrowRight size={16} className="ml-2" /></LinkButton>
              <LinkButton href="/about" variant="secondary">About Me</LinkButton>
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

      <section id="selected-work" className="cinematic-section overflow-hidden bg-ink text-white">
        <div className="section-shell py-16 sm:py-20 lg:py-28">
          <div className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr]">
            <p className="font-mono text-sm text-accent dark:text-teal-300">{"// selected_work"}</p>
            <div>
              <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">Project scenes from practical learning.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Featured builds presented as larger technical scenes, with the full project archive one step away.
              </p>
            </div>
          </div>
          <ProjectShowcase projects={homepageProjects.length ? homepageProjects : projects} />
          <LinkButton href="/projects" variant="secondary" className="mt-10 border-white/25 text-white hover:border-teal-200 hover:text-teal-200">All Projects</LinkButton>
        </div>
      </section>

      <section className="cinematic-section section-shell py-14 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.82fr)] lg:items-start">
          <div>
            <p className="font-mono text-sm text-accent dark:text-teal-300">{"// about_me"}</p>
            <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{"// student_path / built_with_curiosity"}</p>
            <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl">
              Learning how software, systems and security fit together.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              I&apos;m developing practical skills across software engineering, databases, networking, cybersecurity and cloud technologies through coursework, self-directed learning and personal projects. This portfolio documents what I build, what I learn and how my technical interests develop over time.
            </p>
            <p className="mt-7 max-w-2xl border-l border-accent/40 pl-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              {profile.professionalGoals}
            </p>
          </div>
          <aside className="grid gap-6">
            <div className="border-y border-ink/10 py-5 dark:border-white/10">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent dark:text-teal-300">Currently Learning</p>
              <div className="mt-5 grid gap-3">
                {profile.currentLearning.map((item, index) => (
                  <p key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <span className="font-mono text-[0.68rem] font-normal text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent dark:text-teal-300">Building Experience With</p>
                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {["Full-stack development", "Databases", "Networking", "Cloud infrastructure", "Application security"].map((item) => (
                    <p key={item} className="border-t border-ink/10 pt-3 dark:border-white/10">{item}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent dark:text-teal-300">How I Learn</p>
                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {["University coursework", "Personal projects", "Self-directed learning", "Project documentation"].map((item) => (
                    <p key={item} className="border-t border-ink/10 pt-3 dark:border-white/10">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ToolkitSection skills={skills} />

      <section className="cinematic-section overflow-hidden bg-ink text-white">
        <div className="section-shell py-14 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <p className="font-mono text-sm text-accent dark:text-teal-300">{"// contact"}</p>
            <div className="min-w-0">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">STATUS / OPEN_TO_CONVERSATION</p>
              <h2 className="mt-5 text-[clamp(3.5rem,8vw,7rem)] font-semibold uppercase leading-[0.84] tracking-tight">
                Let&apos;s Build<br />Something.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Let&apos;s talk about opportunities, projects or technology.
              </p>
              <div className="mt-9 border-y border-white/10 py-5">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent dark:text-teal-300">Open To</p>
                  <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-200 sm:grid-cols-2">
                    <p>Internship opportunities</p>
                    <p>Graduate roles</p>
                    <p>Technical conversations</p>
                    <p>Collaborative projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 lg:ml-[320px]">
            <LinkButton href="/contact">Contact</LinkButton>
            <LinkButton href="/resume" variant="secondary" className="border-white/25 text-white hover:border-teal-200 hover:text-teal-200">
              Request Resume
            </LinkButton>
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
