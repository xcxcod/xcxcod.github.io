"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, CSSProperties, PointerEvent, SVGProps } from "react";
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
const portfolioLogoColor = "#1d6f8f";
const portfolioLogoAccent = "#0f5d57";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;

type LogoSpec = {
  icon: IconComponent;
  color: string;
  sizeAdjust?: number;
};

type OrbitTechnology = {
  name: string;
  category: string;
  logo: LogoSpec;
};

type OrbitGroup = SkillGroup & {
  label: string;
  technologies: OrbitTechnology[];
};

type OrbitLayout = {
  rx: number;
  ry: number;
  rotation: number;
  speed: number;
  direction: 1 | -1;
  phase: number;
  labelAngle: number;
  stroke: number;
  opacity: number;
  dash?: string;
};

const fallbackLogo: LogoSpec = {
  icon: Code2,
  color: portfolioLogoColor
};

const logoMap: Record<string, LogoSpec> = {
  python: { icon: SiPython, color: portfolioLogoColor, sizeAdjust: 1.04 },
  java: { icon: FaJava, color: portfolioLogoColor, sizeAdjust: 1.12 },
  javascript: { icon: SiJavascript, color: portfolioLogoColor, sizeAdjust: 1.06 },
  typescript: { icon: SiTypescript, color: portfolioLogoColor, sizeAdjust: 1.06 },
  php: { icon: SiPhp, color: portfolioLogoColor, sizeAdjust: 1.2 },
  sql: { icon: Database, color: portfolioLogoAccent, sizeAdjust: 0.92 },
  react: { icon: SiReact, color: portfolioLogoColor, sizeAdjust: 1.12 },
  "next.js": { icon: SiNextdotjs, color: portfolioLogoColor, sizeAdjust: 1.06 },
  firebase: { icon: SiFirebase, color: portfolioLogoColor, sizeAdjust: 1.08 },
  bootstrap: { icon: SiBootstrap, color: portfolioLogoColor, sizeAdjust: 1.12 },
  "tailwind css": { icon: SiTailwindcss, color: portfolioLogoColor, sizeAdjust: 1.08 },
  "microsoft sql server": { icon: DiMsqlServer, color: portfolioLogoColor, sizeAdjust: 1.18 },
  mysql: { icon: SiMysql, color: portfolioLogoColor, sizeAdjust: 1.16 },
  firestore: { icon: SiFirebase, color: portfolioLogoColor, sizeAdjust: 1.08 },
  aws: { icon: FaAws, color: portfolioLogoColor, sizeAdjust: 1.2 },
  docker: { icon: SiDocker, color: portfolioLogoColor, sizeAdjust: 1.1 },
  linux: { icon: FaLinux, color: portfolioLogoColor, sizeAdjust: 1.06 },
  networking: { icon: Network, color: portfolioLogoColor, sizeAdjust: 0.94 },
  virtualisation: { icon: Boxes, color: portfolioLogoAccent, sizeAdjust: 0.94 },
  git: { icon: SiGit, color: portfolioLogoColor, sizeAdjust: 1.08 },
  github: { icon: SiGithub, color: portfolioLogoColor, sizeAdjust: 1.08 },
  "visual studio code": { icon: TbBrandVscode, color: portfolioLogoColor, sizeAdjust: 1.14 },
  "intellij idea": { icon: SiIntellijidea, color: portfolioLogoColor, sizeAdjust: 1.08 }
};

const iconSizes = [24, 26, 29, 25, 30, 24];
const featuredTechnologySizes: Record<string, number> = {
  python: 1.08,
  react: 1.1,
  typescript: 1.08,
  aws: 1.1,
  docker: 1.08
};
const orbitRatios: OrbitLayout[] = [
  { rx: 0.38, ry: 0.29, rotation: -3, speed: 0.010, direction: 1, phase: 218, labelAngle: 210, stroke: 1.2, opacity: 0.2 },
  { rx: 0.55, ry: 0.41, rotation: 5, speed: 0.0075, direction: -1, phase: 288, labelAngle: 324, stroke: 0.95, opacity: 0.18, dash: "7 11" },
  { rx: 0.7, ry: 0.55, rotation: -6, speed: 0.0058, direction: 1, phase: 30, labelAngle: 48, stroke: 1.45, opacity: 0.22 },
  { rx: 0.84, ry: 0.68, rotation: 4, speed: 0.0048, direction: -1, phase: 104, labelAngle: 124, stroke: 1, opacity: 0.16, dash: "3 9" },
  { rx: 0.98, ry: 0.8, rotation: -4, speed: 0.0039, direction: 1, phase: 166, labelAngle: 168, stroke: 1.7, opacity: 0.2 }
];

function getLogo(skill: string) {
  return logoMap[skill.trim().toLowerCase()] ?? fallbackLogo;
}

function rotatePoint(x: number, y: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
}

function getResponsiveBounds(field: HTMLElement) {
  const rect = field.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const maxRx = width * (isMobile ? 0.39 : isTablet ? 0.43 : 0.46);
  const maxRy = height * (isMobile ? 0.39 : isTablet ? 0.35 : 0.36);

  return { rect, maxRx, maxRy };
}

function placeOrbitLabel(label: HTMLElement, field: HTMLElement, orbit: OrbitLayout) {
  const { maxRx, maxRy } = getResponsiveBounds(field);
  const angle = (orbit.labelAngle * Math.PI) / 180;
  const base = rotatePoint(Math.cos(angle) * maxRx * orbit.rx * 1.04, Math.sin(angle) * maxRy * orbit.ry * 1.04, orbit.rotation);
  label.style.transform = `translate(-50%, -50%) translate3d(${base.x}px, ${base.y}px, 0)`;
}

function placePlanet(planet: HTMLElement, field: HTMLElement, elapsed: number, motionEnabled: boolean, pointer?: { x: number; y: number }) {
  const groupIndex = Number(planet.dataset.groupIndex ?? "0");
  const itemIndex = Number(planet.dataset.itemIndex ?? "0");
  const itemCount = Number(planet.dataset.itemCount ?? "1");
  const orbit = orbitRatios[groupIndex % orbitRatios.length];
  const { rect, maxRx, maxRy } = getResponsiveBounds(field);
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const spacing = 360 / itemCount;
  const wobble = itemIndex % 2 === 0 ? 4 : -4;
  const angleDegrees = orbit.phase + spacing * itemIndex + wobble + (motionEnabled ? elapsed * orbit.speed * orbit.direction : 0);
  const angle = (angleDegrees * Math.PI) / 180;
  const orbitPoint = rotatePoint(Math.cos(angle) * maxRx * orbit.rx, Math.sin(angle) * maxRy * orbit.ry, orbit.rotation);
  const sizeBias = Number(planet.dataset.sizeBias ?? "1");
  const depth = (0.84 + (Math.sin(angle) + 1) * 0.095 + groupIndex * 0.012) * sizeBias;
  let repelX = 0;
  let repelY = 0;
  let scaleBoost = 0;
  let active = false;

  if (motionEnabled && pointer) {
    const planetX = centerX + orbitPoint.x;
    const planetY = centerY + orbitPoint.y;
    const dx = planetX - pointer.x;
    const dy = planetY - pointer.y;
    const distance = Math.hypot(dx, dy);
    const radius = rect.width < 640 ? 108 : 150;

    if (distance < radius) {
      active = true;
      const force = (1 - distance / radius) ** 1.45;
      const pushAngle = Math.atan2(dy, dx);
      const push = force * (rect.width < 640 ? 12 : 24);
      repelX = Math.cos(pushAngle) * push;
      repelY = Math.sin(pushAngle) * push;
      scaleBoost = force * 0.09;
    }
  }

  planet.style.transform = `translate(-50%, -50%) translate3d(${orbitPoint.x + repelX}px, ${orbitPoint.y + repelY}px, 0) scale(${depth + scaleBoost})`;
  planet.style.zIndex = String(Math.round(depth * 100) + (active ? 60 : 0));
  planet.style.setProperty("--orbit-depth", String(depth));
  planet.style.opacity = String(0.76 + Math.min(0.2, depth * 0.14));
  planet.style.boxShadow = active
    ? "0 22px 48px rgba(23,32,51,0.16), inset 0 0 0 1px rgba(255,255,255,0.72)"
    : `0 ${Math.round(10 + depth * 10)}px ${Math.round(26 + depth * 12)}px rgba(23,32,51,${0.07 + depth * 0.035}), inset 0 0 0 1px rgba(255,255,255,0.62)`;
  planet.toggleAttribute("data-near-pointer", active);
}

export function ToolkitSection({ skills, compact = false }: { skills: SkillGroup[]; compact?: boolean }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const visibleRef = useRef(true);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const skillGroups = useMemo<OrbitGroup[]>(
    () =>
      skills.map((group) => ({
        ...group,
        label: group.category.replace("Cloud and Infrastructure", "Cloud + Infrastructure"),
        technologies: group.skills.map((skill) => ({
          name: skill,
          category: group.category.replace("Cloud and Infrastructure", "Cloud + Infrastructure"),
          logo: getLogo(skill)
        }))
      })),
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
    const field = fieldRef.current;
    if (!field) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
      },
      { rootMargin: "180px" }
    );

    observer.observe(field);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let running = true;
    const field = fieldRef.current;
    if (!field || !ready) return undefined;

    function draw(timestamp: number) {
      if (!running || !field) return;

      const planets = field.querySelectorAll<HTMLElement>("[data-tech-planet]");
      const labels = field.querySelectorAll<HTMLElement>("[data-orbit-label]");

      labels.forEach((label) => {
        const groupIndex = Number(label.dataset.groupIndex ?? "0");
        placeOrbitLabel(label, field, orbitRatios[groupIndex % orbitRatios.length]);
      });

      planets.forEach((planet) => placePlanet(planet, field, timestamp, motionEnabled && visibleRef.current, pointerRef.current ?? undefined));

      if (motionEnabled) {
        frameRef.current = window.requestAnimationFrame(draw);
      }
    }

    frameRef.current = window.requestAnimationFrame(draw);

    function handleResize() {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [motionEnabled, ready, skillGroups]);

  function updateMotion() {
    const next = !motionEnabled;
    setMotionEnabled(next);
    sessionStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event("portfolio-motion-change"));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerLeave() {
    pointerRef.current = null;
    fieldRef.current?.querySelectorAll<HTMLElement>("[data-tech-planet]").forEach((planet) => {
      planet.removeAttribute("data-near-pointer");
    });
    clearOrbitEmphasis();
  }

  function emphasizeOrbit(groupIndex: number) {
    const field = fieldRef.current;
    if (!field) return;

    field.querySelectorAll<SVGElement>("[data-orbit-ring]").forEach((ring) => {
      const isActive = ring.dataset.groupIndex === String(groupIndex);
      ring.style.opacity = isActive ? "0.42" : "0.14";
      ring.style.strokeWidth = isActive ? "2.2" : ring.dataset.strokeWidth ?? "";
    });

    field.querySelectorAll<HTMLElement>("[data-tech-planet]").forEach((planet) => {
      const isActive = planet.dataset.groupIndex === String(groupIndex);
      planet.style.filter = isActive ? "saturate(1.08)" : "saturate(0.92)";
      planet.style.opacity = isActive ? "1" : "0.82";
    });
  }

  function clearOrbitEmphasis() {
    const field = fieldRef.current;
    if (!field) return;

    field.querySelectorAll<SVGElement>("[data-orbit-ring]").forEach((ring) => {
      ring.style.opacity = "";
      ring.style.strokeWidth = "";
    });

    field.querySelectorAll<HTMLElement>("[data-tech-planet]").forEach((planet) => {
      planet.style.filter = "";
      planet.style.opacity = "";
    });
  }

  return (
    <section className={compact ? "" : "section-shell py-14 sm:py-20"}>
      <div className="mb-8 grid gap-4 lg:grid-cols-[320px_1fr]">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// technical_orbit"}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl">
            Technologies I&apos;m learning and applying.
          </h2>
          <button
            type="button"
            onClick={updateMotion}
            className="w-fit font-mono text-xs uppercase tracking-[0.18em] text-slate-500 transition hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 dark:text-slate-400 dark:focus:ring-offset-slate-950"
            aria-pressed={motionEnabled}
            aria-label={`Toolkit motion is ${motionEnabled ? "on" : "off"}. Toggle orbital motion and pointer physics.`}
          >
            Motion: <span className="text-ink dark:text-white">{motionEnabled ? "On" : "Off"}</span>
          </button>
        </div>
      </div>

      <div
        ref={fieldRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative isolate min-h-[570px] overflow-hidden py-7 sm:min-h-[650px] sm:py-9 lg:min-h-[720px]"
        aria-label="Interactive technical orbit"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,111,143,0.13),rgba(15,93,87,0.055)_36%,transparent_68%)] blur-sm dark:bg-[radial-gradient(circle,rgba(45,212,191,0.12),rgba(29,111,143,0.07)_36%,transparent_68%)] sm:h-[30rem] sm:w-[30rem]" />

        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-visible"
          viewBox="-500 -360 1000 720"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          {orbitRatios.map((orbit, index) => (
            <ellipse
              key={`${orbit.rx}-${orbit.ry}`}
              data-orbit-ring
              data-group-index={index}
              data-stroke-width={orbit.stroke}
              cx="0"
              cy="0"
              rx={orbit.rx * 470}
              ry={orbit.ry * 310}
              transform={`rotate(${orbit.rotation})`}
              className="origin-center fill-none stroke-accent transition-[opacity,stroke-width] duration-300 dark:stroke-teal-200"
              strokeWidth={orbit.stroke}
              opacity={orbit.opacity}
              strokeDasharray={orbit.dash}
            />
          ))}
          <ellipse cx="0" cy="0" rx="108" ry="62" className="fill-none stroke-ink/10 dark:stroke-white/10" strokeWidth="1.2" />
          <ellipse cx="0" cy="0" rx="150" ry="86" className="fill-none stroke-accent/20 dark:stroke-teal-200/20" strokeWidth="1" strokeDasharray="4 9" />
        </svg>

        <div className={cn("pointer-events-none absolute left-1/2 top-1/2 z-30 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-accent/30 bg-[#fbfaf5]/90 text-center shadow-[0_24px_70px_rgba(29,111,143,0.18),inset_0_0_0_12px_rgba(29,111,143,0.045)] backdrop-blur dark:border-teal-200/30 dark:bg-slate-950/90 dark:shadow-[0_24px_70px_rgba(45,212,191,0.12),inset_0_0_0_12px_rgba(45,212,191,0.055)] sm:h-36 sm:w-36", motionEnabled && "motion-safe:animate-[orbit_core_760ms_ease-out_both]")}>
          <div className="absolute inset-[-20px] rounded-full border border-accent/15 dark:border-teal-200/15" />
          <div className="absolute inset-[-42px] rounded-full border border-ink/10 dark:border-white/10" />
          <div>
            <p className="mb-2 font-mono text-[0.52rem] uppercase tracking-[0.24em] text-accent/70 dark:text-teal-200/70">CORE / DANI_IT</p>
            <p className="text-2xl font-semibold leading-none text-ink dark:text-white sm:text-3xl">DANI</p>
            <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-accent dark:text-teal-300">IT</p>
          </div>
        </div>

        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.id}
            data-orbit-label
            data-group-index={groupIndex}
            className={cn("pointer-events-none absolute left-1/2 top-1/2 z-20 whitespace-nowrap border-x border-accent/25 bg-[#f7f5ef] px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-accent/80 shadow-[0_0_0_6px_rgba(247,245,239,0.84)] dark:border-teal-200/25 dark:bg-slate-950 dark:text-teal-200/80 dark:shadow-[0_0_0_6px_rgba(2,6,23,0.78)] sm:text-[0.62rem]", motionEnabled && "motion-safe:animate-[orbit_label_620ms_ease-out_both]")}
            style={{ animationDelay: `${120 + groupIndex * 55}ms` }}
          >
            {String(groupIndex + 1).padStart(2, "0")} / {group.label}
          </div>
        ))}

        {skillGroups.flatMap((group, groupIndex) =>
          group.technologies.map((technology, index) => {
            const Icon = technology.logo.icon;
            const visualBias = featuredTechnologySizes[technology.name.toLowerCase()] ?? (index % 3 === 0 ? 1.03 : index % 3 === 1 ? 0.97 : 1);
            const logoSize = Math.round(iconSizes[(groupIndex + index) % iconSizes.length] * (technology.logo.sizeAdjust ?? 1) * visualBias);

            return (
              <button
                key={`${technology.category}-${technology.name}`}
                type="button"
                data-tech-planet
                data-group-index={groupIndex}
                data-item-index={index}
                data-item-count={group.technologies.length}
                data-size-bias={visualBias}
                onPointerEnter={() => emphasizeOrbit(groupIndex)}
                onFocus={() => emphasizeOrbit(groupIndex)}
                onPointerLeave={clearOrbitEmphasis}
                onBlur={clearOrbitEmphasis}
                className={cn("group absolute left-1/2 top-1/2 grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-accent/20 bg-[#f7f5ef]/90 text-accent outline-none backdrop-blur transition-[border-color,background-color,filter,opacity] duration-300 will-change-transform hover:border-accent/50 hover:bg-white focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-[#f7f5ef] data-[near-pointer]:border-accent/45 dark:border-teal-200/20 dark:bg-slate-950/90 dark:text-teal-200 dark:hover:bg-slate-900 dark:focus:ring-offset-slate-950 sm:h-16 sm:w-16", motionEnabled && "motion-safe:animate-[orbit_planet_520ms_ease-out_both]")}
                aria-label={`${technology.name}, ${technology.category}`}
                style={{ "--orbit-depth": "1", animationDelay: `${320 + groupIndex * 70 + index * 28}ms` } as CSSProperties}
              >
                <span className="pointer-events-none absolute inset-1 rounded-full border border-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-teal-200/10" />
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/50 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 dark:bg-white/[0.04] sm:h-10 sm:w-10">
                  <Icon aria-hidden style={{ color: technology.logo.color }} size={logoSize} />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] z-50 min-w-28 -translate-x-1/2 border border-accent/20 bg-[#fbfaf5]/95 px-2.5 py-2 text-left opacity-0 shadow-[0_18px_42px_rgba(23,32,51,0.12)] backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:border-teal-200/20 dark:bg-slate-950/95">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink dark:text-white">{technology.name}</span>
                  <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.14em] text-accent/75 dark:text-teal-200/75">
                    {technology.category}
                  </span>
                </span>
              </button>
            );
          })
        )}

        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.2em] text-slate-400 sm:bottom-6">
          Hover a technology to explore
        </p>
        {!ready ? <span className="sr-only">Loading motion preference</span> : null}
      </div>
    </section>
  );
}
