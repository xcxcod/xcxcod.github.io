"use client";

import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { Boxes, Code2, Database, Network, Search } from "lucide-react";
import { DiMsqlServer } from "react-icons/di";
import { FaAws, FaJava, FaLinux } from "react-icons/fa";
import {
  SiBootstrap,
  SiDocker,
  SiFirebase,
  SiGit,
  SiGithub,
  SiIntellijidea,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import type { SkillGroup } from "@/types/portfolio";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

const logoMap: Record<string, IconComponent> = {
  python: SiPython,
  java: FaJava,
  javascript: SiJavascript,
  typescript: SiTypescript,
  php: SiPhp,
  sql: Database,
  react: SiReact,
  "next.js": SiNextdotjs,
  firebase: SiFirebase,
  bootstrap: SiBootstrap,
  "tailwind css": SiTailwindcss,
  "microsoft sql server": DiMsqlServer,
  mysql: SiMysql,
  firestore: SiFirebase,
  aws: FaAws,
  docker: SiDocker,
  linux: FaLinux,
  networking: Network,
  virtualisation: Boxes,
  git: SiGit,
  github: SiGithub,
  "visual studio code": TbBrandVscode,
  "intellij idea": SiIntellijidea
};

export function TechnologyLogo({ skill, size = 15 }: { skill: string; size?: number }) {
  const Icon = logoMap[skill.trim().toLowerCase()] ?? Code2;
  return <Icon size={size} aria-hidden="true" />;
}

export function ToolkitSection({ skills }: { skills: SkillGroup[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const term = query.trim().toLowerCase();
  const groups = skills
    .filter((group) => !category || group.id === category)
    .map((group) => ({
      ...group,
      skills: group.skills.filter((skill) => skill.toLowerCase().includes(term))
    }))
    .filter((group) => group.skills.length);
  const count = groups.reduce((total, group) => total + group.skills.length, 0);

  return (
    <div className="min-w-0">
      <div className="grid gap-4 border-y border-current/15 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <label className="grid gap-2">
          <span className="editorial-label">Search technologies</span>
          <span className="flex items-center gap-3 border border-current/25 bg-[var(--editorial-paper)] px-3">
            <Search size={18} className="shrink-0" aria-hidden />
            <input type="search" className="min-h-11 w-full min-w-0 bg-transparent" value={query} onChange={(event) => setQuery(event.target.value)} />
          </span>
        </label>
        <label className="grid gap-2">
          <span className="editorial-label">Category</span>
          <select className="min-h-11 min-w-0 border border-current/25 bg-[var(--editorial-paper)] px-3" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {skills.map((group) => <option key={group.id} value={group.id}>{group.category}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="mt-4 text-sm text-slate-600 dark:text-slate-300">{count} {count === 1 ? "technology" : "technologies"}</p>
      {groups.length ? groups.map((group) => (
        <section key={group.id} className="grid gap-4 border-b border-current/15 py-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <h2 className="editorial-label pt-2">{group.category}</h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10rem),1fr))] gap-2">
            {group.skills.map((skill) => (
              <li key={skill} className="flex min-h-14 items-center gap-3 border border-current/15 bg-[var(--editorial-paper)] px-3 py-2 text-sm font-semibold">
                <span className="grid size-8 shrink-0 place-items-center text-[var(--editorial-accent)]"><TechnologyLogo skill={skill} size={21} /></span>
                <span className="min-w-0 break-words">{skill}</span>
              </li>
            ))}
          </ul>
        </section>
      )) : (
        <div className="py-10">
          <p>{skills.length ? "No technologies match your filters." : "No technologies listed yet."}</p>
          {(query || category) && <button type="button" className="editorial-link" onClick={() => { setQuery(""); setCategory(""); }}>Clear filters</button>}
        </div>
      )}
    </div>
  );
}
