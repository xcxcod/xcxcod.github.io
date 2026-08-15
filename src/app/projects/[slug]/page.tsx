import { notFound } from "next/navigation";
import { Calendar, ExternalLink, Github } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getProjectBySlug } from "@/services/portfolio-service";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{project.status}</span>
        <span className="rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-evergreen dark:bg-teal-950 dark:text-teal-200">{project.type}</span>
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
      <div className="mt-8 aspect-[16/8] overflow-hidden rounded-md border border-line bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">YOUR_PROJECT_IMAGE</div>
        )}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>{project.fullDescription}</p>
        </div>
        <aside className="h-fit rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Calendar size={16} /> {formatDate(project.completionDate)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-md border border-line px-2 py-1 text-xs dark:border-slate-700">{tech}</span>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            {project.githubUrl ? <LinkButton href={project.githubUrl} variant="secondary"><Github size={16} className="mr-2" /> Repository</LinkButton> : null}
            {project.liveUrl ? <LinkButton href={project.liveUrl} variant="primary"><ExternalLink size={16} className="mr-2" /> Live site</LinkButton> : null}
          </div>
        </aside>
      </div>
    </article>
  );
}
