"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GitBranch, Layers, PanelsTopLeft, Route } from "lucide-react";
import { ProjectVisual } from "./project-visual";
import { ResumeWalkthrough } from "./resume-walkthrough";
import type { Project } from "@/types/portfolio";
import portfolioInterface from "../../../public/images/portfolio-interface.png";

const views = [
  { name: "Interface", icon: PanelsTopLeft },
  { name: "Architecture", icon: GitBranch },
  { name: "Decisions", icon: Layers },
  { name: "Walkthrough", icon: Route }
] as const;

export function TraceBuild({ project }: { project: Project }) {
  const [view, setView] = useState<(typeof views)[number]["name"]>("Interface");
  const panel = useId();

  if (project.slug !== "portfolio-website") return <ProjectVisual project={project} />;

  return (
    <section className="trace-build" aria-label="Trace the Build">
      <div className="trace-toolbar">
        <span className="editorial-label">Trace the Build</span>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Project view">
          {views.map(({ name, icon: Icon }) => (
            <button key={name} type="button" aria-pressed={view === name} aria-controls={panel} onClick={() => setView(name)}>
              <Icon size={15} aria-hidden />{name}
            </button>
          ))}
        </div>
      </div>
      <div id={panel} className="trace-panel" aria-label={view}>
        <div key={view} className="trace-view">
        {view === "Walkthrough" ? <ResumeWalkthrough /> :
          view === "Architecture" ? <ProjectVisual project={{ ...project, imageUrl: "" }} /> :
          view === "Decisions" ? (
            <div className="trace-content">
              <h3>Why static hosting?</h3>
              <p>GitHub Pages serves the exported pages without a Next.js server. Firebase handles sign-in and Firestore separately.</p>
              <p>The trade-off is that new project detail routes need to be included in the static build.</p>
              <a className="editorial-link" href="https://github.com/xcxcod/xcxcod.github.io/commit/3ba0d1a50af00a8c03cfbb3e70a6d1650eb074da">See the optional URL fix <ArrowUpRight size={16} aria-hidden /></a>
            </div>
          ) : (
            <div className="trace-content">
              {project.imageUrl ? <ProjectVisual project={project} /> : (
                <figure>
                  <Image src={portfolioInterface} alt="Earlier portfolio homepage with the Melbourne skyline and an overview of the technology stack" className="h-auto w-full border border-current/20" />
                  <figcaption className="mt-2 text-xs">Homepage from an earlier release</figcaption>
                </figure>
              )}
              <h3>Explore the live interface</h3>
              <div className="trace-routes">
                <Link href="/projects">Project archive <ArrowUpRight size={16} aria-hidden /></Link>
                <Link href="/skills">Toolkit <ArrowUpRight size={16} aria-hidden /></Link>
                <Link href="/resume">Resume requests <ArrowUpRight size={16} aria-hidden /></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
