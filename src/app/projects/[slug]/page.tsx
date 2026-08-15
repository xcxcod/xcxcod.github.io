import { notFound } from "next/navigation";
import { Calendar, ExternalLink, Github } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getProjectBySlug } from "@/services/portfolio-service";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="section-shell py-16 sm:py-24">
      <p className="font-mono text-sm text-accent dark:text-teal-300">{"// case_study"}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <h1 className="text-balance text-6xl font-semibold leading-[0.9] tracking-tight sm:text-7xl">{project.title}</h1>
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
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Year</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-semibold"><Calendar size={16} /> {formatDate(project.completionDate)}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="mt-12 aspect-[16/9] overflow-hidden border border-ink/15 bg-slate-100 shadow-[12px_12px_0_rgba(23,32,51,0.08)] dark:border-white/15 dark:bg-slate-900">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="image-noise flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">YOUR_PROJECT_IMAGE</div>
        )}
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// overview"}</p>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{project.fullDescription}</p>
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
        {project.githubUrl ? <LinkButton href={project.githubUrl} variant="secondary"><Github size={16} className="mr-2" /> Repository</LinkButton> : null}
        {project.liveUrl ? <LinkButton href={project.liveUrl} variant="primary"><ExternalLink size={16} className="mr-2" /> Live Demo</LinkButton> : null}
        <LinkButton href="/projects" variant="ghost">Back to Work</LinkButton>
      </div>
    </article>
  );
}
