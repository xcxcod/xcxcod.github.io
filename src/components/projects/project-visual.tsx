import type { Project } from "@/types/portfolio";

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
      <ul className="grid gap-3">
        {[
          ["GitHub Pages", "Static hosting"],
          ["Next.js", "Public pages and admin UI"],
          ["Firebase", "Authentication and Firestore"]
        ].map(([name, role]) => (
          <li key={name} className="grid gap-1 border-l-2 border-[var(--editorial-accent)] bg-[var(--editorial-paper)] px-4 py-2 sm:grid-cols-[1fr_1.6fr] sm:items-center">
            <strong>{name}</strong><span className="text-sm">{role}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
