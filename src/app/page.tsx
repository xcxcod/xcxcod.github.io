"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PremiumHero } from "@/components/home/premium-hero";
import { Reveal } from "@/components/home/reveal";
import { ScrollPresentation } from "@/components/home/scroll-presentation";
import { SkillConstellation } from "@/components/skills/skill-constellation";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import portfolioImage from "../../public/images/portfolio-current.jpg";
import aboutPortrait from "../../public/images/dani-about.webp";

export default function HomePage() {
  const { profile, projects, skills } = usePublicPortfolio();
  const featured = projects.filter((project) => project.published && project.featured);
  return (
    <ScrollPresentation>
      <PremiumHero profile={profile}/>
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
      <section id="about" className="studio-story" data-motion-scene="about"><div className="story-pin">
        <Reveal className="studio-introduction section-shell">
          <p className="eyebrow">02 / The person behind the work</p>
          <figure className="about-portrait"><Image src={aboutPortrait} alt="Dani Adonai wearing glasses and a navy shirt" sizes="(max-width: 640px) 80vw, (max-width: 900px) 40vw, 380px" /></figure>
          <h2>Small experiments.<br /><span>A bigger picture.</span></h2>
          <div className="introduction-copy"><p>{profile.biography}</p><Link className="pill-link" href="/about">Get to know me <ArrowUpRight size={18} aria-hidden /></Link></div>
        </Reveal>
        <div className="story-wordmark" aria-hidden="true">Always becoming.</div>
      </div></section>
      <section className="studio-learning section-shell" data-motion-scene="learning">
        <Reveal><p className="eyebrow">03 / A work in progress</p><h2>A foundation<br />for what’s next.</h2><p className="learning-goal">{profile.professionalGoals}</p></Reveal>
        <div className="learning-detail"><div><h3>{profile.university}</h3><p>{profile.study}</p><p className="mt-4">{profile.currentStudies}</p></div><div><h3>Currently exploring</h3><ul>{profile.currentLearning.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
      </section>
      <section id="toolkit" className="studio-toolkit constellation-section section-shell">
        <Reveal className="section-topline"><div><p className="eyebrow">04 / Tools for the next idea</p><h2>Skill constellation<span>.</span></h2></div><Link className="pill-link" href="/skills">Technology index <ArrowUpRight size={18} aria-hidden /></Link></Reveal>
        <SkillConstellation groups={skills} projects={projects}/>
      </section>
    </ScrollPresentation>
  );
}
