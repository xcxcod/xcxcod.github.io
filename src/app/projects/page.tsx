"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePublicPortfolio } from "@/hooks/use-public-portfolio";
import { TraceBuild } from "@/components/projects/trace-build";
import Link from "next/link";

export default function ProjectsPage() {
  const { projects } = usePublicPortfolio();

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="Work" title="Project archive">
        Personal builds and coursework, with notes on the decisions behind them.
      </SectionHeading>
      <div className="mt-14">
        {projects.length ? (
          <div>
            {projects.map((project, index) => project.slug === "portfolio-website" ? (
              <article key={project.id} className="signal-project">
                <TraceBuild project={project} />
                <div>
                  <p className="editorial-label">{project.type}</p>
                  <h2 className="mt-3 text-3xl font-bold"><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                  <p className="mt-3">{project.shortDescription}</p>
                  <Link className="editorial-link mt-4" href={`/projects/${project.slug}`}>View case study</Link>
                </div>
              </article>
            ) : <ProjectCard key={project.id} project={project} index={index} />)}
          </div>
        ) : (
          <EmptyState title="No projects published" message="Published projects will appear here after they are added in the admin dashboard." />
        )}
      </div>
    </section>
  );
}
