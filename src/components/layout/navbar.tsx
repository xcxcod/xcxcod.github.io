"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Profile } from "@/types/portfolio";

const links = [["Work", "/projects"], ["About", "/about"], ["Toolkit", "/skills"], ["Contact", "/contact"]];

export function Navbar({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="studio-header">
      <nav aria-label="Main navigation">
        <Link href="/" className="studio-logo">{profile.name.split(" ")[0]}<span>↗</span></Link>
        <div className="studio-desktop-links">
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </div>
        <Link href="/resume" className="studio-resume">Request resume <ArrowUpRight size={16} aria-hidden /></Link>
        <button className="studio-menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="studio-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </nav>
      {open && <div id="studio-mobile-menu" className="studio-mobile-links">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={20} aria-hidden /></Link>)}</div>}
    </header>
  );
}
