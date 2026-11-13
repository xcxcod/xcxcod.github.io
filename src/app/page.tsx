"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { TraceBuild } from "@/components/projects/trace-build";
import { TechnologyLogo } from "@/components/skills/toolkit-section";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const published = projects.filter((project) => project.published);
  const featured = published.filter((project) => project.featured);
  const selected = featured.length ? featured : published;
  const [paused, setPaused] = useState(false);
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = page.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("signal-arrived");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    root.querySelectorAll("[data-signal-reveal]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="editorial signal-experience" ref={page} data-motion-paused={paused}>
      <section className="signal-hero" aria-labelledby="portfolio-name">
        <div className="signal-hero-copy">
          <p className="editorial-label flex items-center gap-3"><span className="connection-marker" />{profile.location}</p>
          <p className="mt-4 max-w-[17rem] text-base leading-relaxed text-slate-200">{profile.study} student at {profile.university}.</p>
        </div>
        <div className="trace-hero-art" aria-hidden>
          <div className="trace-stack"><span /><span /><span /></div>
          <div className="trace-connections"><i /><i /><i /></div>
        </div>
        <ul className="signal-interests editorial-label" aria-label="Technical interests">
          {profile.technicalInterests.map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
        <h1 id="portfolio-name" className="signal-name">{profile.name}</h1>
        <div className="signal-actions">
          <a href="#selected-work" className="editorial-action">View work <ArrowDown size={16} aria-hidden /></a>
          <Link href="/resume" className="editorial-link">Request resume <ArrowUpRight size={16} aria-hidden /></Link>
          <button type="button" className="signal-motion" aria-label={paused ? "Resume animations" : "Pause animations"} onClick={() => setPaused(!paused)}>
            {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
          </button>
        </div>
      </section>

      <section id="selected-work" className="scroll-mt-24">
        <div className="signal-trace" aria-hidden />
        <div className="signal-shell py-12 sm:py-20" data-signal-reveal>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <h2 className="signal-heading">Selected work</h2>
            <Link href="/projects" className="editorial-link">All projects <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
          {selected.length ? selected.map((project) => (
            <article key={project.id} className="signal-project">
              <TraceBuild project={project} />
              <div>
                <p className="editorial-label flex flex-wrap items-center gap-3"><span className="connection-marker" />{project.type}{project.status !== project.type && <span className="text-current opacity-80">/ {project.status}</span>}</p>
                <h3 className="mt-3 text-3xl font-bold">{project.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed">{project.shortDescription}</p>
                <ul className="mt-5 flex flex-wrap gap-2">{project.technologies.map((tech) => <li key={tech} className="signal-tag">{tech}</li>)}</ul>
                <Link href={`/projects/${project.slug}`} className="editorial-link mt-4" aria-label={`Read case study: ${project.title}`}>Read case study <ArrowRight size={16} aria-hidden /></Link>
              </div>
            </article>
          )) : <p>No published projects yet.</p>}
        </div>
      </section>

      <section className="signal-shell grid gap-8 border-t border-white/15 py-12 sm:py-20 md:grid-cols-2 md:gap-12" data-signal-reveal>
        <div>
          <p className="editorial-label">About</p>
          <h2 className="signal-heading mt-3">Learning by building</h2>
          <p className="mt-4 max-w-lg leading-relaxed">{profile.biography}</p>
          <Link href="/about" className="editorial-link mt-4">More about me <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div>
          <h2 className="editorial-label mb-3">Currently learning</h2>
          <ul>{profile.currentLearning.map((item) => <li key={item} className="border-t border-current/15 py-3">{item}</li>)}</ul>
        </div>
      </section>

      <section className="signal-band">
        <div className="signal-trace" aria-hidden />
        <div className="signal-shell py-12 sm:py-20" data-signal-reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="signal-heading">Toolkit</h2>
            <Link href="/skills" className="editorial-link">Explore skills <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
          <dl className="mt-8">
            {skills.map((group) => (
              <div key={group.id} className="grid gap-3 border-t border-white/20 py-4 sm:grid-cols-[12rem_1fr]">
                <dt className="editorial-label self-center">{group.category}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => <li key={skill} className="signal-tag inline-flex items-center gap-2"><TechnologyLogo skill={skill} />{skill}</li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="signal-shell py-12 sm:py-20" data-signal-reveal>
        <h2 className="signal-heading">Get in touch</h2>
        <p className="mt-4 max-w-md leading-relaxed">I’m interested in internships, graduate roles and conversations about technology.</p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <Link href="/contact" className="editorial-action">Contact me <ArrowUpRight size={16} aria-hidden /></Link>
          <Link href="/resume" className="editorial-link">Request resume <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
      </section>
    </div>
  );
}
