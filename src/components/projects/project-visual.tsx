import type { Project } from "@/types/portfolio";
import { ArrowDown, Database, Globe, Layers3 } from "lucide-react";

const architecture = [
  { name: "GitHub Pages", role: "Serves the exported site", icon: Globe },
  { name: "Next.js", role: "Renders the portfolio and admin interface", icon: Layers3 },
  { name: "Firebase", role: "Handles sign-in and Firestore data", icon: Database }
];

export function ProjectVisual({ project }: { project: Project }) {
  if (project.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.imageUrl} alt={`${project.title} project preview`} loading="lazy" className="aspect-[16/10] w-full border border-current/15 object-contain" />
    );
  }

  if (project.slug !== "portfolio-website") return null;

  return (
    <figure className="editorial-diagram grid content-center gap-5 border border-current/15 p-5 sm:p-8">
      <figcaption className="editorial-label">Portfolio architecture</figcaption>
      <ol className="grid">
        {architecture.map(({ name, role, icon: Icon }, index) => (
          <li key={name}>
            {index > 0 && <ArrowDown size={15} className="my-1 ml-5 text-[var(--editorial-accent)]" aria-hidden />}
            <div className="flex items-center gap-4 border border-current/20 bg-[var(--editorial-paper)] px-4 py-3">
              <Icon size={22} className="shrink-0 text-[var(--editorial-accent)]" aria-hidden />
              <div><strong>{name}</strong><p className="text-sm">{role}</p></div>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
