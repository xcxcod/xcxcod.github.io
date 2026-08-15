"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Linkedin, Menu, Moon, Sun, X } from "lucide-react";
import type { Profile } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/resume", label: "Resume" },
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
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="font-semibold tracking-tight text-ink dark:text-white">
          {profile.name}
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-accent dark:text-slate-300">
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
          <button type="button" onClick={toggleTheme} className="rounded-md border border-line p-2 text-slate-600 transition hover:text-accent dark:border-slate-700 dark:text-slate-300" aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <button type="button" className="rounded-md border border-line p-2 md:hidden dark:border-slate-700" onClick={() => setOpen((value) => !value)} aria-label="Open navigation menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <div className={cn("border-t border-line bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950", open ? "block" : "hidden")}>
        <div className="mx-auto grid max-w-6xl gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => setOpen(false)}>
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
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="rounded-md border border-line p-2 text-slate-600 transition hover:text-accent dark:border-slate-700 dark:text-slate-300">
      {children}
    </a>
  );
}
