import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-md border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">YOUR_PROJECT_IMAGE</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{project.status}</span>
          {project.featured ? <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-evergreen dark:bg-teal-950 dark:text-teal-200">Featured</span> : null}
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-md border border-line px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4">
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
            Details <ArrowUpRight size={15} />
          </Link>
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-accent dark:text-slate-300">
              <Github size={15} /> Code
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
