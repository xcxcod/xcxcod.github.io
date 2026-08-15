"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const MOTION_STORAGE_KEY = "portfolio-toolkit-motion";

function projectCode(project: Project, index: number) {
  return `PROJECT_${String(index + 1).padStart(2, "0")} / ${project.id.toUpperCase().slice(0, 14)}`;
}

function ProjectPreview({ project, active }: { project: Project; active: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none relative aspect-[16/10] overflow-hidden border border-white/15 bg-slate-900 shadow-[18px_18px_0_rgba(29,111,143,0.22)] transition duration-500",
        active ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    >
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="image-noise flex h-full w-full items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-400">
          YOUR_PROJECT_IMAGE
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-teal-200">{project.status}</p>
      </div>
    </div>
  );
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
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

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches && !sessionStorage.getItem(MOTION_STORAGE_KEY)) {
        setMotionEnabled(false);
      }
    }

    function handleStorage() {
      setMotionEnabled(sessionStorage.getItem(MOTION_STORAGE_KEY) !== "off" && !media?.matches);
    }

    media?.addEventListener("change", handleChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("portfolio-motion-change", handleStorage);
    return () => {
      media?.removeEventListener("change", handleChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("portfolio-motion-change", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!previewVisible || !motionEnabled) {
      if (previewRef.current) {
        previewRef.current.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
      }
    }
  }, [motionEnabled, previewVisible]);

  function animatePreview() {
    frameRef.current = null;
    const preview = previewRef.current;
    if (!preview) return;

    easedRef.current.x += (pointerRef.current.x - easedRef.current.x) * 0.14;
    easedRef.current.y += (pointerRef.current.y - easedRef.current.y) * 0.14;
    const x = Math.max(-18, Math.min(18, easedRef.current.x));
    const y = Math.max(-14, Math.min(14, easedRef.current.y));
    const rotate = Math.max(-4, Math.min(4, x * 0.12));

    preview.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;

    if (Math.abs(pointerRef.current.x - easedRef.current.x) > 0.4 || Math.abs(pointerRef.current.y - easedRef.current.y) > 0.4) {
      frameRef.current = window.requestAnimationFrame(animatePreview);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 42,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 32
    };

    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(animatePreview);
    }
  }

  function handleLeave() {
    setPreviewVisible(false);
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }

  if (!sortedProjects.length) return null;

  return (
    <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]" onPointerMove={handlePointerMove} onPointerLeave={handleLeave}>
      <div className="border-y border-white/15">
        {sortedProjects.map((project, index) => (
          <article key={project.id} className="group relative border-b border-white/15 last:border-b-0">
            <Link
              href={`/projects/${project.slug}`}
              onPointerEnter={() => {
                setActiveIndex(index);
                setPreviewVisible(true);
              }}
              onFocus={() => {
                setActiveIndex(index);
                setPreviewVisible(true);
              }}
              className="grid gap-4 py-7 outline-none transition focus-visible:ring-2 focus-visible:ring-accent sm:grid-cols-[84px_minmax(0,1fr)] sm:py-8 lg:hover:translate-x-3"
            >
              <span className="font-mono text-3xl leading-none text-white/35 transition group-hover:text-accent sm:text-4xl">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">{projectCode(project, index)}</span>
                <span className="mt-2 block text-4xl font-semibold uppercase leading-[0.9] tracking-tight text-white transition group-hover:tracking-[0.03em] group-hover:text-teal-100 sm:text-5xl lg:text-6xl">
                  {project.title}
                </span>
                <span className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
                  <span>{project.type}</span>
                  <span aria-hidden="true">/</span>
                  <span>{project.technologies.slice(0, 4).join(" / ")}</span>
                </span>
              </span>
            </Link>

            <div className="mb-7 block lg:hidden">
              <ProjectPreview project={project} active />
            </div>

            <div className="absolute bottom-7 right-0 hidden gap-4 font-mono text-xs uppercase tracking-[0.16em] text-slate-400 lg:flex">
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <Github size={14} /> Code
                </a>
              ) : null}
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <ExternalLink size={14} /> Live
                </a>
              ) : null}
              <span className="inline-flex items-center gap-2 text-slate-500">
                Case <ArrowUpRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <aside className="sticky top-24 hidden h-fit lg:block">
        <div ref={previewRef} className="will-change-transform">
          {activeProject ? <ProjectPreview project={activeProject} active={previewVisible} /> : null}
        </div>
        <p className="mt-5 font-mono text-[0.65rem] uppercase leading-5 tracking-[0.18em] text-slate-500">
          Hover index rows for preview / click title for case study
        </p>
      </aside>
    </div>
  );
}
