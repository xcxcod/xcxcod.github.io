import { projects } from "@/lib/sample-data";

/** Public footer destinations. Leave a value empty to hide its icon.
 * Existing profile URLs take precedence over these defaults.
 * Replace the repository destination with your GitHub profile URL if preferred.
 */
export const socialLinks = {
  github: projects.find(project => project.slug === "portfolio-website")?.githubUrl ?? "",
  linkedin: "",
  instagram: "",
  x: "",
  email: "", // Email address only, e.g. name@example.com (not a mailto: URL).
};
