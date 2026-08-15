import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white dark:border-white/10">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-teal-200">{profile.name}</p>
        </div>
        <div className="flex flex-wrap items-start gap-4 md:justify-end">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            <Github size={16} /> GitHub
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            <Linkedin size={16} /> LinkedIn
          </a>
          <Link href="/contact" className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            Contact
          </Link>
          <Link href="/resume" className="font-mono text-xs uppercase tracking-[0.18em] text-teal-200 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-4 focus:ring-offset-ink">
            Request Resume
          </Link>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400 md:col-span-2">Copyright {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
