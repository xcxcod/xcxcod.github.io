"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, PointerEvent, SVGProps } from "react";
import { Boxes, Code2, Database, Network } from "lucide-react";
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
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio-toolkit-motion";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

type Technology = {
  name: string;
  category: string;
  logo: LogoSpec;
};

type LogoSpec = {
  icon: IconComponent;
  color: string;
  sizeAdjust?: number;
};

const fallbackLogo: LogoSpec = {
  icon: Code2,
  color: "#1d6f8f"
};

const logoMap: Record<string, LogoSpec> = {
  python: { icon: SiPython, color: "#3776ab", sizeAdjust: 1.04 },
  java: { icon: FaJava, color: "#e76f00", sizeAdjust: 1.12 },
  javascript: { icon: SiJavascript, color: "#f7df1e", sizeAdjust: 1.06 },
  typescript: { icon: SiTypescript, color: "#3178c6", sizeAdjust: 1.06 },
  php: { icon: SiPhp, color: "#777bb4", sizeAdjust: 1.2 },
  sql: { icon: Database, color: "#64748b", sizeAdjust: 0.92 },
  react: { icon: SiReact, color: "#61dafb", sizeAdjust: 1.12 },
  "next.js": { icon: SiNextdotjs, color: "#111827", sizeAdjust: 1.06 },
  firebase: { icon: SiFirebase, color: "#ffca28", sizeAdjust: 1.08 },
  bootstrap: { icon: SiBootstrap, color: "#7952b3", sizeAdjust: 1.12 },
  "tailwind css": { icon: SiTailwindcss, color: "#06b6d4", sizeAdjust: 1.08 },
  "microsoft sql server": { icon: DiMsqlServer, color: "#cc2927", sizeAdjust: 1.18 },
  mysql: { icon: SiMysql, color: "#4479a1", sizeAdjust: 1.16 },
  firestore: { icon: SiFirebase, color: "#f57c00", sizeAdjust: 1.08 },
  aws: { icon: FaAws, color: "#ff9900", sizeAdjust: 1.2 },
  docker: { icon: SiDocker, color: "#2496ed", sizeAdjust: 1.1 },
  linux: { icon: FaLinux, color: "#111827", sizeAdjust: 1.06 },
  networking: { icon: Network, color: "#1d6f8f", sizeAdjust: 0.94 },
  virtualisation: { icon: Boxes, color: "#0f5d57", sizeAdjust: 0.94 },
  git: { icon: SiGit, color: "#f05032", sizeAdjust: 1.08 },
  github: { icon: SiGithub, color: "#181717", sizeAdjust: 1.08 },
  "visual studio code": { icon: TbBrandVscode, color: "#007acc", sizeAdjust: 1.14 },
  "intellij idea": { icon: SiIntellijidea, color: "#000000", sizeAdjust: 1.08 }
};

const objectStyles = [
  "basis-[9.75rem] sm:basis-[11rem] lg:basis-[12rem] translate-y-1",
  "basis-[8.5rem] sm:basis-[9.5rem] lg:basis-[10rem] lg:-translate-y-7",
  "basis-[10.25rem] sm:basis-[12rem] lg:basis-[13rem] lg:translate-y-9",
  "basis-[9rem] sm:basis-[10rem] lg:basis-[10.5rem] lg:-translate-y-2",
  "basis-[11.25rem] sm:basis-[12.5rem] lg:basis-[13.5rem] lg:translate-y-4",
  "basis-[8rem] sm:basis-[9rem] lg:basis-[9.5rem] lg:-translate-y-9"
];

const iconSizes = [62, 70, 76, 66, 82, 58];

function getLogo(skill: string) {
  return logoMap[skill.trim().toLowerCase()] ?? fallbackLogo;
}

function resetObject(object: HTMLElement) {
  object.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
  object.style.filter = "none";
  object.style.zIndex = "1";
}

export function ToolkitSection({ skills, compact = false }: { skills: SkillGroup[]; compact?: boolean }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const technologies = useMemo<Technology[]>(
    () =>
      skills.flatMap((group) =>
        group.skills.map((skill) => ({
          name: skill,
          category: group.category,
          logo: getLogo(skill)
        }))
      ),
    [skills]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = sessionStorage.getItem(STORAGE_KEY);

    setMotionEnabled(stored ? stored === "on" : !media.matches);
    setReady(true);

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches && !sessionStorage.getItem(STORAGE_KEY)) {
        setMotionEnabled(false);
      }
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!motionEnabled) {
      fieldRef.current?.querySelectorAll<HTMLElement>("[data-tech-object]").forEach(resetObject);
    }
  }, [motionEnabled]);

  function updateMotion() {
    const next = !motionEnabled;
    setMotionEnabled(next);
    sessionStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event("portfolio-motion-change"));
  }

  function applyForces() {
    frameRef.current = null;
    const field = fieldRef.current;
    if (!field) return;

    const fieldRect = field.getBoundingClientRect();
    const { x, y } = pointerRef.current;

    field.querySelectorAll<HTMLElement>("[data-tech-object]").forEach((object) => {
      const rect = object.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - x;
      const dy = centerY - y;
      const distance = Math.hypot(dx, dy);
      const radius = 315;

      if (distance > radius) {
        resetObject(object);
        return;
      }

      const depth = Number(object.dataset.depth ?? "1");
      const force = (1 - distance / radius) ** 1.35;
      const angle = Math.atan2(dy, dx);
      const move = force * 78 * depth;
      const nextX = Math.cos(angle) * move;
      const nextY = Math.sin(angle) * move;
      const maxLeft = fieldRect.left - rect.left + 12;
      const maxRight = fieldRect.right - rect.right - 12;
      const maxTop = fieldRect.top - rect.top + 12;
      const maxBottom = fieldRect.bottom - rect.bottom - 12;
      const clampedX = Math.max(maxLeft, Math.min(maxRight, nextX));
      const clampedY = Math.max(maxTop, Math.min(maxBottom, nextY));
      const rotate = Math.max(-15, Math.min(15, (dx / radius) * 18 * depth));
      const scale = 1 + force * 0.1;

      object.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) rotate(${rotate}deg) scale(${scale})`;
      object.style.filter = `drop-shadow(0 ${Math.round(force * 18)}px ${Math.round(18 + force * 22)}px rgba(23,32,51,${0.08 + force * 0.12}))`;
      object.style.zIndex = String(Math.ceil(force * 10) + 1);
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
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

    fieldRef.current?.querySelectorAll<HTMLElement>("[data-tech-object]").forEach(resetObject);
  }

  return (
    <section className={compact ? "" : "section-shell py-14 sm:py-20"}>
      <div className="mb-8 grid gap-4 lg:grid-cols-[320px_1fr]">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// toolkit"}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl">
            Technologies I&apos;m learning and applying.
          </h2>
          <button
            type="button"
            onClick={updateMotion}
            className="w-fit font-mono text-xs uppercase tracking-[0.18em] text-slate-500 transition hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 dark:text-slate-400 dark:focus:ring-offset-slate-950"
            aria-pressed={motionEnabled}
            aria-label={`Toolkit motion is ${motionEnabled ? "on" : "off"}. Toggle pointer physics.`}
          >
            Motion: <span className="text-ink dark:text-white">{motionEnabled ? "On" : "Off"}</span>
          </button>
        </div>
      </div>

      <div
        ref={fieldRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative isolate -mx-4 overflow-hidden border-y border-ink/10 px-4 py-10 dark:border-white/10 sm:-mx-6 sm:px-6 sm:py-14 lg:-mx-10 lg:px-10"
        aria-label="Interactive technology toolkit"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(29,111,143,0.08),transparent_26%),radial-gradient(circle_at_78%_60%,rgba(15,93,87,0.08),transparent_24%)]" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-9 sm:gap-x-9 sm:gap-y-12 lg:gap-x-12 lg:gap-y-14">
          {technologies.map((technology, index) => {
            const Icon = technology.logo.icon;
            const styleIndex = index % objectStyles.length;
            const category = technology.category.replace("Cloud and Infrastructure", "Cloud + Infra");
            const logoSize = Math.round(iconSizes[styleIndex] * (technology.logo.sizeAdjust ?? 1));

            return (
              <figure
                key={`${technology.category}-${technology.name}`}
                data-tech-object
                data-depth={1 + (index % 4) * 0.11}
                className={cn(
                  "group relative grid justify-items-center gap-3 text-center will-change-transform",
                  "transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  objectStyles[styleIndex]
                )}
              >
                <div className="grid aspect-square w-24 place-items-center rounded-[2rem] border border-ink/5 bg-[#fbfaf5]/70 transition group-hover:bg-white/90 dark:border-white/10 dark:bg-slate-50/90 sm:w-28 lg:w-32">
                  <Icon aria-hidden style={{ color: technology.logo.color }} size={logoSize} />
                </div>
                <figcaption>
                  <span className="block text-base font-semibold leading-tight text-ink dark:text-white">{technology.name}</span>
                  <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{category}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        {!ready ? <span className="sr-only">Loading motion preference</span> : null}
      </div>
    </section>
  );
}
