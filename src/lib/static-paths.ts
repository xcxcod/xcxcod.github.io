import { projects } from "@/lib/sample-data";

export function getStaticProjectParams() {
  return projects.filter((project) => project.published).map((project) => ({ slug: project.slug }));
}
