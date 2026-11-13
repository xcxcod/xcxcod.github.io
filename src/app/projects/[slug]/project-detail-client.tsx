"use client";

import { Calendar, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { usePublicProject } from "@/hooks/use-public-portfolio";

export function ProjectDetailClient({ slug }: { slug: string }) {
  const { project, loading } = usePublicProject(slug);

  if (!project && !loading) {
    return (
      <section className="section-shell py-16 sm:py-24">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// not_found"}</p>
        <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight">Project not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          This static GitHub Pages build only includes project detail pages generated at build time.
        </p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="section-shell py-16 sm:py-24">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// loading"}</p>
        <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight">Loading project</h1>
      </section>
    );
  }

  return (
    <div className="editorial">
    <article className="section-shell py-12 sm:py-20">
      <Link href="/projects" className="editorial-link">All projects</Link>
      <p className="editorial-label mt-6 flex items-center gap-3"><span className="connection-marker" />Case study</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <h1 className="text-balance text-4xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
        </div>
        <aside className="border-l border-ink/15 pl-6 dark:border-white/15">
          <dl className="grid gap-5">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Project Type</dt>
              <dd className="mt-1 text-lg font-semibold">{project.type}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="mt-1 text-lg font-semibold">{project.status}</dd>
            </div>
            {project.completionDate && <div>
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Year</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-semibold"><Calendar size={16} /> {formatDate(project.completionDate)}</dd>
            </div>}
          </dl>
        </aside>
      </div>

      <div className="mt-10"><ProjectVisual project={project} /></div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// overview"}</p>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{project.fullDescription}</p>
          {project.id === "student-portfolio" && (
            <>
              <h2 className="mt-8 text-2xl font-semibold">Deployment trade-off</h2>
              <p className="mt-3 leading-7">GitHub Pages serves the exported Next.js pages as static files. Firebase handles sign-in and Firestore access separately, so the public site can run without a Next.js server.</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// technology"}</p>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Technology Stack</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="border-b border-ink/10 pb-3 text-lg font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {project.galleryImages.length ? (
        <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
          <p className="font-mono text-sm text-accent dark:text-teal-300">{"// screenshots"}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {project.galleryImages.map((image) => (
              <div key={image} className="aspect-[16/10] overflow-hidden border border-ink/15 bg-slate-100 dark:border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-16 flex flex-wrap gap-4 border-t border-ink/15 pt-8 dark:border-white/15">
        {/^https?:\/\//i.test(project.githubUrl || "") ? <LinkButton href={project.githubUrl} variant="secondary"><Github size={16} className="mr-2" /> Repository</LinkButton> : null}
        {project.liveUrl ? <LinkButton href={project.liveUrl} variant="primary"><ExternalLink size={16} className="mr-2" /> Live Demo</LinkButton> : null}
        <LinkButton href="/projects" variant="ghost">Back to Work</LinkButton>
      </div>
    </article>
    </div>
  );
}
