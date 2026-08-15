import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProjects } from "@/services/portfolio-service";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Projects" title="Technical project gallery">
        A curated view of academic and personal projects, with repository and live links where available.
      </SectionHeading>
      <div className="mt-10">
        {projects.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <EmptyState title="No projects published" message="Published projects will appear here after they are added in the admin dashboard." />
        )}
      </div>
    </section>
  );
}
