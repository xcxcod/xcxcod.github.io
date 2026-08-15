import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Early-career Information Technology professional building practical, secure, and maintainable software.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-accent dark:text-slate-300">
            <Github size={16} /> GitHub
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-accent dark:text-slate-300">
            <Linkedin size={16} /> LinkedIn
          </a>
          <Link href="/contact" className="text-sm text-slate-600 hover:text-accent dark:text-slate-300">
            Contact
          </Link>
        </div>
        <p className="text-xs text-slate-500 md:col-span-2">Copyright {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
