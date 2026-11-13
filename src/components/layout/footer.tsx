import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="signal-band">
      <div className="signal-trace" aria-hidden />
      <div className="signal-shell grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-xs uppercase text-white">{profile.location}</p>
        </div>
        <div className="flex flex-wrap items-start gap-4 md:justify-end">
          {/^https?:\/\//i.test(profile.githubUrl) && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            <Github size={16} /> GitHub
          </a>}
          {/^https?:\/\//i.test(profile.linkedinUrl) && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            <Linkedin size={16} /> LinkedIn
          </a>}
          <Link href="/contact" className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
            Contact
          </Link>
          <Link href="/resume" className="font-mono text-xs uppercase tracking-[0.18em] text-teal-200 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-4 focus:ring-offset-ink">
            Request Resume
          </Link>
        </div>
        <div className="footer-wordmark md:col-span-2" aria-hidden="true">
          <p className="signal-signoff">{profile.name}</p>
          <div className="footer-wordmark-route">
            <span className="footer-wordmark-terminal" />
            <span className="footer-wordmark-trace" />
            <span className="footer-wordmark-terminal" />
          </div>
        </div>
        <p className="font-mono text-xs uppercase text-slate-200 md:col-span-2">Copyright {new Date().getFullYear()} {profile.name}.</p>
      </div>
    </footer>
  );
}
