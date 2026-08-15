"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio-intro-seen";
const statusMessages = ["Checking interface...", "Loading project index...", "Mapping toolkit...", "Opening portfolio shell..."];
const letters = "DANI ADONAI".split("");
const signalRows = ["AUTH: ethical access", "MODE: portfolio preview", "STACK: software / cloud / security", "STATUS: ready"];
const tileVectors = [
  [-160, -120],
  [145, -96],
  [-112, 112],
  [172, 92],
  [-36, -162],
  [58, 152],
  [-210, 12],
  [218, -18]
] as const;

export function IntroOverlay() {
  const timersRef = useRef<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<"boot" | "loading" | "ready" | "exit">("boot");
  const [reducedMotion, setReducedMotion] = useState(false);

  const statusRows = useMemo(
    () =>
      statusMessages.map((message, index) => ({
        message,
        delay: `${680 + index * 190}ms`
      })),
    []
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const finishIntro = useCallback((hideDelay = 0) => {
    clearTimers();
    localStorage.setItem(STORAGE_KEY, "true");
    setStage("exit");
    if (hideDelay > 0) {
      timersRef.current = [window.setTimeout(() => setVisible(false), hideDelay)];
      return;
    }
    setVisible(false);
  }, [clearTimers]);

  const playIntro = useCallback(
    (shouldReduceMotion: boolean) => {
      clearTimers();
      setStage("boot");
      setVisible(true);

      if (shouldReduceMotion) {
        timersRef.current = [window.setTimeout(() => finishIntro(), 900)];
        return;
      }

      timersRef.current = [
        window.setTimeout(() => setStage("loading"), 650),
        window.setTimeout(() => setStage("ready"), 2050),
        window.setTimeout(() => setStage("exit"), 2850),
        window.setTimeout(() => finishIntro(), 3550)
      ];
    },
    [clearTimers, finishIntro]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alreadySeen = localStorage.getItem(STORAGE_KEY) === "true";
    const shouldForceIntro = process.env.NODE_ENV === "development";

    setReducedMotion(media.matches);

    if (shouldForceIntro || !alreadySeen) {
      playIntro(media.matches);
    }

    function handleReplayIntro() {
      localStorage.removeItem(STORAGE_KEY);
      playIntro(media.matches);
    }

    window.addEventListener("portfolio:replay-intro", handleReplayIntro);
    return () => {
      window.removeEventListener("portfolio:replay-intro", handleReplayIntro);
      clearTimers();
    };
  }, [clearTimers, playIntro]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] isolate flex min-h-dvh items-center justify-center overflow-hidden bg-ink px-5 text-white",
        stage === "exit" && "pointer-events-none opacity-0 transition-opacity duration-700 ease-out"
      )}
      role="presentation"
      aria-label="Portfolio intro"
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_42%,rgba(29,111,143,0.34),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(8,11,18,0.08),rgba(8,11,18,0.9))]" />
      <div className={cn("absolute left-0 right-0 top-1/2 h-px bg-accent/50 shadow-[0_0_32px_rgba(29,111,143,0.75)]", !reducedMotion && "animate-[intro-scan_2.4s_ease-in-out_forwards]")} />

      <button
        type="button"
        onClick={() => finishIntro(260)}
        className="absolute right-4 top-4 z-10 border border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-teal-200 hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-200 sm:right-6 sm:top-6"
      >
        Skip Intro
      </button>

      <div className="relative w-full max-w-4xl py-20 text-center">
        <div className="pointer-events-none absolute -left-2 top-6 hidden w-52 text-left font-mono text-[0.62rem] uppercase leading-6 tracking-[0.16em] text-slate-400/80 lg:block">
          {signalRows.map((row) => (
            <p key={row} className="border-l border-white/10 pl-3">{row}</p>
          ))}
        </div>
        <div className="pointer-events-none absolute -right-2 bottom-8 hidden w-56 text-left font-mono text-[0.62rem] leading-6 tracking-[0.12em] text-slate-400/75 lg:block">
          <p>{"const access = \"ethical\";"}</p>
          <p>{"scan(scope: \"portfolio\")"}</p>
          <p>{"return interface.ready;"}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          {tileVectors.map(([x, y], index) => (
            <span
              key={`${x}-${y}`}
              className={cn(
                "absolute left-1/2 top-1/2 h-3 w-3 border border-white/35 bg-accent/15 opacity-80 shadow-[0_0_22px_rgba(29,111,143,0.28)] transition-transform duration-700 ease-out",
                stage === "exit" && "opacity-0"
              )}
              style={{
                transform:
                  stage === "exit"
                    ? `translate3d(${x}px, ${y}px, 0) rotate(${index % 2 ? 28 : -28}deg) scale(1.35)`
                    : `translate3d(${x * 0.2}px, ${y * 0.16}px, 0) rotate(${index % 2 ? 8 : -8}deg) scale(1)`
              }}
            />
          ))}
        </div>

        <p className={cn("font-mono text-xs uppercase tracking-[0.26em] text-teal-200 transition", stage !== "boot" && "opacity-70")}>
          {stage === "boot" ? "Initializing secure interface" : stage === "ready" || stage === "exit" ? "Interface Ready" : "Ethical Security Portfolio"}
        </p>

        <h1 className="mt-7 flex flex-wrap justify-center gap-x-2 gap-y-3 text-5xl font-semibold leading-none tracking-tight sm:text-7xl lg:text-8xl" aria-label="Dani Adonai">
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              className={cn(
                "inline-block min-w-[0.25em] transition duration-700 ease-out",
                stage === "boot" && !reducedMotion ? "translate-y-5 rotate-3 opacity-0 blur-sm" : "translate-y-0 rotate-0 opacity-100 blur-0",
                stage === "exit" && !reducedMotion && (index % 2 === 0 ? "-translate-y-4 opacity-0" : "translate-y-4 opacity-0")
              )}
              style={{ transitionDelay: reducedMotion ? "0ms" : `${index * 36}ms` }}
            >
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-5 max-w-xl font-mono text-xs uppercase tracking-[0.2em] text-slate-300 sm:text-sm">
          White-hat mindset / developer toolkit / secure systems thinking
        </p>

        <div className="mx-auto mt-8 h-px max-w-xl overflow-hidden bg-white/10">
          <span className={cn("block h-full bg-accent", !reducedMotion && "animate-[intro-progress_2.6s_ease-out_forwards]")} />
        </div>

        <div className="mx-auto mt-8 grid max-w-md gap-2 text-left font-mono text-xs uppercase tracking-[0.16em] text-slate-300 sm:text-sm">
          {statusRows.map((row) => (
            <p
              key={row.message}
              className={cn("flex items-center justify-between border-b border-white/10 pb-2 opacity-0", !reducedMotion && "animate-[intro-status_520ms_ease-out_forwards]")}
              style={{ animationDelay: reducedMotion ? "0ms" : row.delay }}
            >
              <span>{row.message}</span>
              <span className="text-teal-200">PASS</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
