import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="studio-footer">
      <p className="eyebrow">The next connection starts here</p>
      <Link href="/contact" className="studio-contact-title">Good things<br />start with hello.<ArrowUpRight aria-hidden /></Link>
      <p className="footer-invitation">Internships, graduate opportunities, or an interesting conversation.<br />I’d love to hear from you.</p>
      <div className="studio-footer-bottom">
        <span>{profile.name} / {profile.location}</span>
        <div>
          {/^https?:/.test(profile.githubUrl) && <a href={profile.githubUrl}>GitHub</a>}
          {/^https?:/.test(profile.linkedinUrl) && <a href={profile.linkedinUrl}>LinkedIn</a>}
          <Link href="/resume">Request resume</Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
