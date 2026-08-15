"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Linkedin, Menu, Moon, Sun, X } from "lucide-react";
import type { Profile } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#f7f5ef]/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
      <nav className="section-shell flex items-center justify-between py-4" aria-label="Main navigation">
        <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-ink dark:text-white">
          {profile.name}
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-mono text-xs uppercase tracking-[0.18em] text-slate-600 transition hover:text-accent dark:text-slate-300">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <IconLink href={profile.githubUrl} label="GitHub">
            <Github size={18} />
          </IconLink>
          <IconLink href={profile.linkedinUrl} label="LinkedIn">
            <Linkedin size={18} />
          </IconLink>
          <Link href="/resume" className="ml-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 transition hover:text-accent dark:text-slate-300">
            Resume
          </Link>
          <button type="button" onClick={toggleTheme} className="p-2 text-slate-600 transition hover:text-accent dark:text-slate-300" aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <button type="button" className="border border-ink/20 p-2 md:hidden dark:border-white/25" onClick={() => setOpen((value) => !value)} aria-label="Open navigation menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <div className={cn("border-t border-ink/10 bg-[#f7f5ef] px-4 py-3 md:hidden dark:border-white/10 dark:bg-slate-950", open ? "block" : "hidden")}>
        <div className="mx-auto grid max-w-6xl gap-2 py-3">
          {[...links, { href: "/skills", label: "Toolkit" }, { href: "/resume", label: "Request Resume" }].map((link) => (
            <Link key={link.href} href={link.href} className="px-2 py-3 font-mono text-sm uppercase tracking-[0.18em] text-slate-700 hover:text-accent dark:text-slate-200" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="p-2 text-slate-600 transition hover:-translate-y-0.5 hover:text-accent dark:text-slate-300">
      {children}
    </a>
  );
}
