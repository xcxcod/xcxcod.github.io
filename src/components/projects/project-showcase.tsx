"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const MOTION_STORAGE_KEY = "portfolio-toolkit-motion";

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function projectMeta(project: Project) {
  return `${project.type.toUpperCase()} / ${project.status.toUpperCase().replace(/\s+/g, "_")}`;
}

function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden border border-white/15 bg-slate-900 shadow-[22px_22px_0_rgba(29,111,143,0.22)]">
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="image-noise flex h-full w-full items-center justify-center p-10 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
          YOUR_PROJECT_IMAGE
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,11,18,0.04),transparent_45%,rgba(29,111,143,0.22))]" />
    </div>
  );
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const easedRef = useRef({ x: 0, y: 0 });

  const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.order - b.order), [projects]);
  const activeProject = sortedProjects[activeIndex] ?? sortedProjects[0];

  useEffect(() => {
    const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const stored = sessionStorage.getItem(MOTION_STORAGE_KEY);
    setMotionEnabled(stored ? stored === "on" : !media?.matches);

    function syncMotion() {
      setMotionEnabled(sessionStorage.getItem(MOTION_STORAGE_KEY) !== "off" && !media?.matches);
    }

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches && !sessionStorage.getItem(MOTION_STORAGE_KEY)) setMotionEnabled(false);
    }

    media?.addEventListener("change", handleChange);
    window.addEventListener("portfolio-motion-change", syncMotion);
    window.addEventListener("storage", syncMotion);
    return () => {
      media?.removeEventListener("change", handleChange);
      window.removeEventListener("portfolio-motion-change", syncMotion);
      window.removeEventListener("storage", syncMotion);
    };
  }, []);

  function animatePreview() {
    frameRef.current = null;
    const preview = previewRef.current;
    if (!preview) return;

    easedRef.current.x += (pointerRef.current.x - easedRef.current.x) * 0.12;
    easedRef.current.y += (pointerRef.current.y - easedRef.current.y) * 0.12;

    const x = Math.max(-14, Math.min(14, easedRef.current.x));
    const y = Math.max(-10, Math.min(10, easedRef.current.y));
    const rotate = Math.max(-2.5, Math.min(2.5, x * 0.06));
    preview.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;

    if (Math.abs(pointerRef.current.x - easedRef.current.x) > 0.35 || Math.abs(pointerRef.current.y - easedRef.current.y) > 0.35) {
      frameRef.current = window.requestAnimationFrame(animatePreview);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 38,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 28
    };

    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(animatePreview);
    }
  }

  function resetPreview() {
    pointerRef.current = { x: 0, y: 0 };
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(animatePreview);
  }

  if (!sortedProjects.length || !activeProject) return null;

  return (
    <div className="relative" onPointerMove={handlePointerMove} onPointerLeave={resetPreview}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(340px,1.04fr)] lg:items-start">
        <div className="scene-reveal border-y border-white/15">
          {sortedProjects.map((project, index) => {
            const active = activeIndex === index;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                onPointerEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={cn(
                  "group block border-b border-white/15 py-6 transition last:border-b-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-ink sm:py-7",
                  active && "bg-white/[0.035]"
                )}
              >
                <div className="grid gap-4 sm:grid-cols-[3rem_1fr] sm:items-start">
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-accent">{projectNumber(index)}</span>
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold uppercase leading-none tracking-tight text-white sm:text-3xl">
                          {project.title}
                        </h3>
                        <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{projectMeta(project)}</p>
                      </div>
                      <ArrowUpRight className="mt-1 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" size={20} />
                    </div>
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{project.shortDescription}</p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">
                      {project.technologies.slice(0, 5).map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>
                    <div className="mt-5 md:hidden">
                      <ProjectPreview project={project} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="scene-reveal hidden md:block">
          <div ref={previewRef} className="sticky top-24 will-change-transform">
            <ProjectPreview project={activeProject} />
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href={`/projects/${activeProject.slug}`} className="inline-flex min-h-11 items-center gap-2 bg-white px-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:-translate-y-0.5">
                View Case Study <ArrowUpRight size={15} />
              </Link>
              {activeProject.githubUrl ? (
                <a href={activeProject.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
                  <Github size={15} /> GitHub
                </a>
              ) : null}
              {activeProject.liveUrl ? (
                <a href={activeProject.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-white">
                  <ExternalLink size={15} /> Live
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
