"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { InteractiveField } from "@/components/home/interactive-field";
import { Reveal } from "@/components/home/reveal";
import { ScrollPresentation } from "@/components/home/scroll-presentation";
import { TechnologyLink } from "@/components/skills/toolkit-section";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import portfolioImage from "../../public/images/portfolio-current.jpg";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const featured = projects.filter((project) => project.published && project.featured);
  return (
    <ScrollPresentation>
      <section className="studio-hero">
        <div className="hero-heading">
          <div><p className="eyebrow"><span className="connection-marker" /> {profile.name} · {profile.location}</p><h1><span className="hero-line"><span>Turning curiosity</span></span><span className="hero-line"><span>into <em>working ideas.</em></span></span></h1></div>
          <div className="hero-intro"><p>{profile.study} student at {profile.university}. Learning by connecting software, systems and security.</p><a className="pill-link" href="#selected-work">Discover my work <ArrowDownRight size={19} aria-hidden /></a></div>
        </div>
        <InteractiveField />
      </section>
      <section id="selected-work" className="studio-work section-shell">
        <Reveal className="section-topline"><div><p className="eyebrow">01 / From idea to implementation</p><h2>Selected work<span>.</span></h2></div><Link className="pill-link" href="/projects">All projects <ArrowUpRight size={18} aria-hidden /></Link></Reveal>
        {featured.length ? featured.map((project, index) => (
          <div key={project.id} className="project-sequence" data-scroll-stage><article className="studio-project">
            <Link href={`/projects/${project.slug}`} className="project-cover">
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.imageUrl} alt={`${project.title} interface`} />
              ) : project.slug === "portfolio-website" ? <Image src={portfolioImage} alt="Current portfolio homepage with editorial typography and an interactive blue sculpture" /> : <span className="project-title-art">{project.title}</span>}
              <span className="project-cover-label">{String(index+1).padStart(2,"0")} / Explore the build</span><span className="project-open"><ArrowUpRight aria-hidden /><span className="sr-only">Open {project.title}</span></span>
            </Link>
            <div className="project-caption"><div><p className="eyebrow">{project.type} / {project.status}</p><h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3></div><div><p>{project.shortDescription}</p><p className="project-tech">{project.technologies.join(" · ")}</p></div></div>
          </article></div>
        )) : <p className="py-10">Projects will appear here as they are published.</p>}
      </section>
      <section className="studio-story">
        <Reveal className="studio-introduction section-shell">
          <p className="eyebrow">02 / The person behind the work</p>
          <h2>Small experiments.<br /><span>A bigger picture.</span></h2>
          <div className="introduction-copy"><p>{profile.biography}</p><Link className="pill-link" href="/about">Get to know me <ArrowUpRight size={18} aria-hidden /></Link></div>
        </Reveal>
        <div className="story-wordmark" aria-hidden="true">Always becoming.</div>
      </section>
      <section className="studio-learning section-shell">
        <Reveal><p className="eyebrow">03 / A work in progress</p><h2>A foundation<br />for what’s next.</h2><p className="learning-goal">{profile.professionalGoals}</p></Reveal>
        <div className="learning-detail"><div><h3>{profile.university}</h3><p>{profile.study}</p><p className="mt-4">{profile.currentStudies}</p></div><div><h3>Currently exploring</h3><ul>{profile.currentLearning.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
      </section>
      <section className="studio-toolkit section-shell">
        <Reveal className="section-topline"><div><p className="eyebrow">04 / Tools for the next idea</p><h2>Built with curiosity<span>.</span></h2></div><Link className="pill-link" href="/skills">Explore technologies <ArrowUpRight size={18} aria-hidden /></Link></Reveal>
        <dl>{skills.map((group) => <div key={group.id}><dt>{group.category}</dt><dd><ul>{group.skills.map((skill) => <li key={skill}><TechnologyLink skill={skill} /></li>)}</ul></dd></div>)}</dl>
      </section>
    </ScrollPresentation>
  );
}
