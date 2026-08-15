import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProjects } from "@/services/portfolio-service";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="section-shell py-16 sm:py-24">
      <SectionHeading eyebrow="// selected_work" title="Project case studies and technical builds">
        A curated view of academic and personal projects, with repository and live links where they are available.
      </SectionHeading>
      <div className="mt-14">
        {projects.length ? (
          <div>
            {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          </div>
        ) : (
          <EmptyState title="No projects published" message="Published projects will appear here after they are added in the admin dashboard." />
        )}
      </div>
    </section>
  );
}
