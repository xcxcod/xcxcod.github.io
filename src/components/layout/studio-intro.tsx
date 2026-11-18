"use client";

import { useEffect, useRef, useState } from "react";

// Choreography adapted from Giats' MIT-licensed Loader.jsx.
// Copyright (c) 2025 Evangelos Giatsidis. See public/licenses/giats-MIT.txt.
export function StudioIntro() {
  const [visible, setVisible] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const fullName = useRef<HTMLSpanElement>(null);
  const shortName = useRef<HTMLSpanElement>(null);
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    function ready() {
      document.body.dataset.introState = "complete";
      window.dispatchEvent(new Event("portfolio:intro-complete"));
    }
    try {
      if (sessionStorage.getItem("portfolio-studio-intro") === "seen") { ready(); return; }
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { ready(); return; }
    document.body.dataset.introState = "playing";
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const root = cover.current;
    const name = fullName.current;
    const nickname = shortName.current;
    const page = document.getElementById("portfolio-page");
    if (!root || !name || !nickname || !page) return;
    const animations: Animation[] = [];
    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    page.setAttribute("inert", "");
    function complete() {
      if (cancelled) return;
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
      page?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      try { sessionStorage.setItem("portfolio-studio-intro", "seen"); } catch {}
      setVisible(false);
      document.body.dataset.introState = "complete";
      window.dispatchEvent(new Event("portfolio:intro-complete"));
    }
    finish.current = complete;
    function animate(element: HTMLElement, frames: Keyframe[], duration: number, delay = 0) {
      const animation = element.animate(frames, { duration, delay, easing: "cubic-bezier(.76,0,.24,1)", fill: "both" });
      animations.push(animation);
      return animation.finished;
    }
    async function play() {
      try {
        await animate(name!, [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], 650);
        if (cancelled) return;
        await Promise.all([
          animate(name!, [{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], 650, 350),
          animate(nickname!, [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], 650, 350)
        ]);
        if (cancelled) return;
        await animate(root!, [{ transform: "scale(1)", borderRadius: "0" }, { transform: "scale(.92)", borderRadius: "16px" }], 450, 250);
        if (cancelled) return;
        await Promise.all([
          animate(root!, [{ transform: "translateX(0) scale(.92)" }, { transform: "translateX(-105%) scale(.92)" }], 700),
          animate(page!, [{ transform: "translateX(100%) scale(.92)" }, { transform: "translateX(0) scale(1)" }], 900)
        ]);
        complete();
      } catch { complete(); }
    }
    void play();
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") complete(); }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
      page.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div ref={cover} className="studio-intro" role="dialog" aria-modal="true" aria-label="Welcome to Dani’s portfolio">
      <p className="intro-caption">Dani Adonai / Portfolio</p>
      <div className="intro-name-window">
        <span ref={fullName}>Dani Adonai</span>
        <span ref={shortName}>Call me Dani.</span>
      </div>
      <button type="button" className="intro-skip" onClick={() => finish.current()}>Skip intro ↗</button>
    </div>
  );
}
