import { socialLinks } from "@/config/social-links";
import type { Profile } from "@/types/portfolio";

export function publicWebUrl(value?: string): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if ((url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password) return url.href;
  } catch { /* Unconfigured profile values are not public links. */ }
}

export function footerSocialLinks(profile: Profile, configuration = socialLinks) {
  const github = publicWebUrl(profile.githubUrl) || publicWebUrl(configuration.github);
  const email = (profile.email || configuration.email)?.trim();
  const linkedin = publicWebUrl(profile.linkedinUrl) || publicWebUrl(configuration.linkedin);
  const instagram = publicWebUrl(profile.instagramUrl) || publicWebUrl(configuration.instagram);
  const x = publicWebUrl(profile.twitterUrl) || publicWebUrl(configuration.x);
  return [
    ...(github ? [{ platform: "github" as const, label: publicWebUrl(profile.githubUrl) ? "GitHub" : "GitHub repository", href: github }] : []),
    ...(linkedin ? [{ platform: "linkedin" as const, label: "LinkedIn", href: linkedin }] : []),
    ...(instagram ? [{ platform: "instagram" as const, label: "Instagram", href: instagram }] : []),
    ...(x ? [{ platform: "x" as const, label: "X (Twitter)", href: x }] : []),
    ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? [{ platform: "email" as const, label: "Email Dani", href: `mailto:${email}` }] : []),
  ];
}
