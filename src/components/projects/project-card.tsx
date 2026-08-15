import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="group grid gap-6 border-t border-ink/15 py-8 transition dark:border-white/15 md:grid-cols-[96px_1fr_1.35fr] md:items-start">
      <p className="font-mono text-sm text-accent dark:text-teal-300">{String(index + 1).padStart(2, "0")}</p>
      <div>
        <p className="mb-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span>{project.type}</span>
          <span aria-hidden="true">/</span>
          <span>{project.status}</span>
        </p>
        <h2 className="text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
          <Link href={`/projects/${project.slug}`} className="transition hover:text-accent">
            {project.title}
          </Link>
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-5">
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            View Project <ArrowUpRight size={15} />
          </Link>
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 hover:text-accent dark:text-slate-300">
              <Github size={15} /> Code
            </a>
          ) : null}
        </div>
      </div>
      <div className="aspect-[16/10] overflow-hidden border border-ink/15 bg-slate-100 shadow-[10px_10px_0_rgba(23,32,51,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[14px_14px_0_rgba(29,111,143,0.18)] dark:border-white/15 dark:bg-slate-900">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="image-noise flex h-full items-center justify-center px-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">YOUR_PROJECT_IMAGE</div>
        )}
      </div>
    </article>
  );
}
