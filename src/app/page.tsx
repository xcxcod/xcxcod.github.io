"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/projects/project-visual";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const published = projects.filter((project) => project.published);
  const featured = published.filter((project) => project.featured);
  const selected = featured.length ? featured : published;

  return (
    <div className="editorial">
      <section className="section-shell grid gap-8 pb-12 pt-10 sm:pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,0.58fr)] md:items-end md:gap-12 lg:pb-16">
        <div className="min-w-0">
          <p className="editorial-label flex items-center gap-3"><span className="connection-marker" />{profile.location}</p>
          <h1 className="mt-6 break-words text-[3.65rem] font-black leading-[0.88] sm:text-[6rem] lg:text-[8.5rem]">
            {profile.name.split(" ").map((part, index) => <span key={index} className="block">{part}</span>)}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed sm:text-xl">{profile.study} student at {profile.university}. Exploring software development, cloud computing and cybersecurity.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#selected-work" className="editorial-action">View projects <ArrowDown size={16} aria-hidden /></a>
            <Link href="/resume" className="editorial-link">Request resume <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
        </div>
        {profile.profileImageUrl && (
          <figure className="border-b border-current/15 pb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.profileImageUrl} alt={profile.name} className="aspect-[5/4] w-full object-cover object-[center_78%]" fetchPriority="high" />
            <figcaption className="editorial-label mt-3">{profile.university} / {profile.study}</figcaption>
          </figure>
        )}
      </section>

      <section id="selected-work" className="scroll-mt-24 border-y border-current/15">
        <div className="section-shell py-10 sm:py-14">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-3xl font-bold sm:text-5xl">Selected work</h2>
            <Link href="/projects" className="editorial-link">All projects <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
          {selected.length ? selected.map((project) => (
            <article key={project.id} className="grid gap-6 border-t border-current/15 py-6 md:grid-cols-2 md:items-center md:gap-10">
              <ProjectVisual project={project} />
              <div>
                <p className="editorial-label flex items-center gap-3"><span className="connection-marker" />{project.type}</p>
                <h3 className="mt-3 text-3xl font-bold">{project.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed">{project.shortDescription}</p>
                <Link href={`/projects/${project.slug}`} className="editorial-link mt-4">Read case study <ArrowRight size={16} aria-hidden /></Link>
              </div>
            </article>
          )) : <p>No published projects yet.</p>}
        </div>
      </section>

      <section className="section-shell grid gap-8 py-12 sm:py-16 md:grid-cols-2 md:gap-12">
        <div>
          <p className="editorial-label">About</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Learning by building</h2>
          <p className="mt-4 max-w-lg leading-relaxed">{profile.biography}</p>
          <Link href="/about" className="editorial-link mt-4">More about me <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div>
          <h2 className="editorial-label mb-3">Currently learning</h2>
          <ul>{profile.currentLearning.map((item) => <li key={item} className="border-t border-current/15 py-3">{item}</li>)}</ul>
        </div>
      </section>

      <section className="border-y border-current/15">
        <div className="section-shell py-12 sm:py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Toolkit</h2>
          <dl className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group) => <div key={group.id} className="border-t border-current/15 py-4"><dt className="editorial-label">{group.category}</dt><dd className="mt-2 leading-relaxed">{group.skills.join(", ")}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <h2 className="text-3xl font-bold sm:text-5xl">Get in touch</h2>
        <p className="mt-4 max-w-md leading-relaxed">I’m interested in internships, graduate roles and conversations about technology.</p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <Link href="/contact" className="editorial-action">Contact me <ArrowUpRight size={16} aria-hidden /></Link>
          <Link href="/resume" className="editorial-link">Request resume <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
      </section>
    </div>
  );
}
