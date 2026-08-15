"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ComponentType, PointerEvent, SVGProps } from "react";
import { Boxes, Cloud, Code2, Database, Network, Server } from "lucide-react";
import {
  SiBootstrap,
  SiDocker,
  SiFirebase,
  SiGit,
  SiGithub,
  SiIntellijidea,
  SiJavascript,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVscodium
} from "react-icons/si";
import type { SkillGroup as SkillGroupType } from "@/types/portfolio";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

const iconMap: Record<string, IconComponent> = {
  python: SiPython,
  java: SiOpenjdk,
  javascript: SiJavascript,
  typescript: SiTypescript,
  php: SiPhp,
  sql: Database,
  react: SiReact,
  "next.js": SiNextdotjs,
  firebase: SiFirebase,
  bootstrap: SiBootstrap,
  "tailwind css": SiTailwindcss,
  "microsoft sql server": Server,
  mysql: SiMysql,
  firestore: SiFirebase,
  aws: Cloud,
  docker: SiDocker,
  linux: SiLinux,
  networking: Network,
  virtualisation: Boxes,
  git: SiGit,
  github: SiGithub,
  "visual studio code": SiVscodium,
  "intellij idea": SiIntellijidea
};

function getIcon(skill: string) {
  return iconMap[skill.trim().toLowerCase()] ?? Code2;
}

function resetTile(tile: HTMLElement) {
  tile.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
}

export function SkillGroup({ group, motionEnabled = false }: { group: SkillGroupType; motionEnabled?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!motionEnabled && sectionRef.current) {
      sectionRef.current.querySelectorAll<HTMLElement>("[data-toolkit-tile]").forEach(resetTile);
    }
  }, [motionEnabled]);

  function applyForces() {
    frameRef.current = null;
    const section = sectionRef.current;
    if (!section) return;

    const { x, y } = pointerRef.current;
    const tiles = section.querySelectorAll<HTMLElement>("[data-toolkit-tile]");

    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - x;
      const dy = centerY - y;
      const distance = Math.hypot(dx, dy);
      const radius = 190;

      if (distance > radius) {
        resetTile(tile);
        return;
      }

      const force = (1 - distance / radius) ** 1.65;
      const angle = Math.atan2(dy, dx);
      const move = force * 24;
      const rotate = Math.max(-7, Math.min(7, (dx / radius) * 8));

      tile.style.transform = `translate3d(${Math.cos(angle) * move}px, ${Math.sin(angle) * move}px, 0) rotate(${rotate}deg)`;
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;

    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(applyForces);
    }
  }

  function handlePointerLeave() {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    sectionRef.current?.querySelectorAll<HTMLElement>("[data-toolkit-tile]").forEach(resetTile);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="border-t border-ink/15 py-7 dark:border-white/15"
    >
      <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-accent dark:text-teal-300">{group.category}</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {group.skills.map((skill) => {
          const Icon = getIcon(skill);
          const tileStyle = {
            transition: motionEnabled ? "transform 520ms cubic-bezier(0.16, 1, 0.3, 1), border-color 160ms ease, background-color 160ms ease" : "none"
          } satisfies CSSProperties;

          return (
            <span
              key={skill}
              data-toolkit-tile
              style={tileStyle}
              className="inline-flex min-h-14 items-center gap-3 border border-ink/15 bg-[#fbfaf5]/80 px-4 py-3 text-base font-semibold text-slate-700 shadow-[5px_5px_0_rgba(23,32,51,0.05)] will-change-transform hover:border-accent/60 active:scale-[0.98] dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-100 dark:shadow-[5px_5px_0_rgba(255,255,255,0.04)]"
            >
              <Icon aria-hidden className="shrink-0 text-accent dark:text-teal-300" size={22} />
              <span>{skill}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
