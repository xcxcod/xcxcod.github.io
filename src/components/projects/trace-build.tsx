"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Layers, PanelsTopLeft } from "lucide-react";
import { ProjectVisual } from "./project-visual";
import type { Project } from "@/types/portfolio";

const views = [
  { name: "Interface", icon: PanelsTopLeft },
  { name: "Architecture", icon: GitBranch },
  { name: "Decisions", icon: Layers }
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
        {view === "Architecture" ? <ProjectVisual project={{ ...project, imageUrl: "" }} /> :
          view === "Decisions" ? (
            <div className="trace-content">
              <h3>Why static hosting?</h3>
              <p>GitHub Pages serves the exported pages without a Next.js server. Firebase handles sign-in and Firestore separately.</p>
              <p>The trade-off is that new project detail routes need to be included in the static build.</p>
            </div>
          ) : (
            <div className="trace-content">
              {project.imageUrl && <ProjectVisual project={project} />}
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
