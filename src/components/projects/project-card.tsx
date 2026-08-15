import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index = 0, tone = "light" }: { project: Project; index?: number; tone?: "light" | "dark" }) {
  const reversed = index % 2 === 1;
  const isDark = tone === "dark";

  return (
    <article className={cn("group grid gap-8 border-t py-10 transition first:border-t-0 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-14", isDark ? "border-white/15" : "border-ink/15 dark:border-white/15")}>
      <div className={reversed ? "lg:order-2" : ""}>
        <p className="font-mono text-sm text-accent dark:text-teal-300">{String(index + 1).padStart(2, "0")}</p>
        <p className={cn("mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em]", isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400")}>
          <span>{project.type}</span>
          <span aria-hidden="true">/</span>
          <span>{project.status}</span>
        </p>
        <h2 className={cn("mt-4 text-balance text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl", isDark ? "text-white" : "text-ink dark:text-white")}>
          <Link href={`/projects/${project.slug}`} className={cn("transition", isDark ? "hover:text-teal-200" : "hover:text-accent")}>
            {project.title}
          </Link>
        </h2>
        <p className={cn("mt-6 max-w-2xl text-lg leading-8", isDark ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>{project.shortDescription}</p>
        <div className={cn("mt-7 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]", isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400")}>
          {project.technologies.slice(0, 7).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Link href={`/projects/${project.slug}`} className={cn("inline-flex min-h-11 items-center gap-2 px-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition hover:-translate-y-0.5", isDark ? "bg-white text-ink" : "bg-ink text-white dark:bg-white dark:text-slate-950")}>
            View Case Study <ArrowUpRight size={15} />
          </Link>
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]", isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-accent dark:text-slate-300")}>
              <Github size={15} /> Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]", isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-accent dark:text-slate-300")}>
              <ExternalLink size={15} /> Live Demo
            </a>
          ) : null}
        </div>
      </div>
      <div className={cn(reversed ? "lg:order-1" : "", "aspect-[16/10] overflow-hidden border transition duration-300 group-hover:-translate-y-1", isDark ? "border-white/15 bg-slate-900 shadow-[16px_16px_0_rgba(29,111,143,0.20)] group-hover:shadow-[20px_20px_0_rgba(29,111,143,0.28)]" : "border-ink/15 bg-slate-100 shadow-[12px_12px_0_rgba(23,32,51,0.08)] group-hover:shadow-[16px_16px_0_rgba(29,111,143,0.16)] dark:border-white/15 dark:bg-slate-900")}>
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className={cn("image-noise flex h-full items-center justify-center px-6 text-center font-mono text-xs uppercase tracking-[0.18em]", isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400")}>YOUR_PROJECT_IMAGE</div>
        )}
      </div>
    </article>
  );
}
