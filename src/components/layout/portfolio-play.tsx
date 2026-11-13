"use client";

import Link from "next/link";
import { Bot, MoonStar, Rocket, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const rocketReturnEvent = "portfolio:rocket-return";

export function AfterHours() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="flashlight-toggle" title="After Hours" aria-label="Open After Hours" onClick={() => dialog.current?.showModal()}>
        <MoonStar size={18} aria-hidden />
      </button>
      <dialog ref={dialog} className="after-hours" aria-labelledby="after-hours-title">
        <div className="flex items-center justify-between gap-4 p-4">
          <h2 id="after-hours-title" className="text-xl font-semibold">Melbourne after hours</h2>
          <button type="button" className="flashlight-toggle" aria-label="Close After Hours" onClick={() => dialog.current?.close()}><X size={20} /></button>
        </div>
        <div className="after-hours-skyline">
          {[["Work", "/projects"], ["Toolkit", "/skills"], ["Contact", "/contact"]].map(([name, href]) => (
            <div key={href} className="after-hours-building">
              <Link href={href} onClick={() => dialog.current?.close()}>{name}</Link>
            </div>
          ))}
        </div>
      </dialog>
    </>
  );
}

const stars = [[13, 67], [25, 23], [46, 42], [59, 17], [74, 66], [87, 29]];

export function FooterPlay() {
  const [path, setPath] = useState<number[]>([]);
  const [roaming, setRoaming] = useState(false);
  const rover = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!roaming) return;
    const marker = rover.current;
    if (!marker) return;
    function follow(event: PointerEvent) {
      if (!event.isPrimary) return;
      marker?.style.setProperty("--rover-x", `${Math.min(event.clientX + 18, window.innerWidth - 40)}px`);
      marker?.style.setProperty("--rover-y", `${Math.min(event.clientY + 18, window.innerHeight - 40)}px`);
    }
    function dock(event: KeyboardEvent) {
      if (event.key === "Escape") setRoaming(false);
    }
    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("pointerdown", follow, { passive: true });
    window.addEventListener("keydown", dock);
    return () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerdown", follow);
      window.removeEventListener("keydown", dock);
    };
  }, [roaming]);

  function connect(index: number) {
    setPath((current) => current.includes(index) ? current : [...current, index]);
  }

  return (
    <div className="flex flex-wrap items-start gap-4 md:col-span-2">
      <details className="min-w-0 max-w-full">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">Make a constellation</summary>
        <div className="constellation-grid" data-complete={path.length === stars.length}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={path.map((index) => stars[index].join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          {stars.map(([x, y], index) => (
            <button type="button" key={index} style={{ left: `${x}%`, top: `${y}%` }} aria-label={`Star ${index + 1}`} aria-pressed={path.includes(index)} onClick={() => connect(index)} onPointerEnter={(event) => { if (event.buttons === 1) connect(index); }} onPointerDown={() => connect(index)} />
          ))}
        </div>
        <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setPath([])} disabled={!path.length}>Clear constellation</button>
        <span className="sr-only" role="status">{path.length === stars.length ? "Constellation complete" : `${path.length} of ${stars.length} stars connected`}</span>
      </details>
      <button type="button" className="inline-flex min-h-11 items-center gap-2 font-semibold" aria-pressed={roaming} onClick={() => setRoaming((value) => !value)}>
        <Bot size={18} aria-hidden />{roaming ? "Dock rover" : "Release rover"}
      </button>
      {roaming && <span ref={rover} className="portfolio-rover" aria-hidden="true"><Bot size={22} /></span>}
    </div>
  );
}

export function RocketFlyby() {
  const [unlocked, setUnlocked] = useState(false);
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    function unlock() { setUnlocked(true); }
    window.addEventListener(rocketReturnEvent, unlock);
    return () => window.removeEventListener(rocketReturnEvent, unlock);
  }, []);

  if (!unlocked) return null;
  return (
    <div className="rocket-flyby-control">
      <button type="button" className="flashlight-toggle" aria-label="Launch rocket flyby" title="Launch rocket flyby" disabled={flying} onClick={() => setFlying(true)}>
        <Rocket size={18} aria-hidden />
      </button>
      {flying && <span className="rocket-flyby" aria-hidden="true" onAnimationEnd={() => setFlying(false)}><Rocket size={24} /></span>}
    </div>
  );
}
