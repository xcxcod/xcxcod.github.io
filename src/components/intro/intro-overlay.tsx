"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio-intro-seen";
const SOUND_STORAGE_KEY = "portfolio-scratch-sound";
const REVEAL_THRESHOLD = 0.6;

type Point = {
  x: number;
  y: number;
};

type ScratchParticle = Point & {
  alpha: number;
  size: number;
  vx: number;
  vy: number;
};

type ScratchAudio = {
  context: AudioContext;
  filter: BiquadFilterNode;
  gain: GainNode;
  source: AudioBufferSourceNode;
};

function getCanvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (Number.isFinite(clientX) ? clientX : rect.left) - rect.left,
    y: (Number.isFinite(clientY) ? clientY : rect.top) - rect.top
  };
}

export function IntroOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<ScratchAudio | null>(null);
  const isDrawingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const particlesRef = useRef<ScratchParticle[]>([]);
  const particleFrameRef = useRef<number | null>(null);
  const revealFrameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cursorPoint, setCursorPoint] = useState<Point | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const stopScratchSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const now = audio.context.currentTime;
    audio.gain.gain.cancelScheduledValues(now);
    audio.gain.gain.setTargetAtTime(0, now, 0.025);
  }, []);

  const startScratchSound = useCallback(
    (velocity = 0) => {
      if (!soundEnabled || reducedMotion) return;

      const AudioContextConstructor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) return;

      if (!audioRef.current) {
        const context = new AudioContextConstructor();
        const bufferLength = Math.floor(context.sampleRate * 1.2);
        const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
        const channel = buffer.getChannelData(0);

        for (let index = 0; index < bufferLength; index += 1) {
          channel[index] = (Math.random() * 2 - 1) * 0.42;
        }

        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        source.buffer = buffer;
        source.loop = true;
        filter.type = "bandpass";
        filter.frequency.value = 1450;
        filter.Q.value = 0.72;
        gain.gain.value = 0;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        source.start();
        audioRef.current = { context, filter, gain, source };
      }

      const audio = audioRef.current;
      if (audio.context.state === "suspended") {
        void audio.context.resume();
      }

      const strength = Math.min(1, velocity / 90);
      const now = audio.context.currentTime;
      audio.filter.frequency.setTargetAtTime(1100 + strength * 700, now, 0.04);
      audio.gain.gain.cancelScheduledValues(now);
      audio.gain.gain.setTargetAtTime(0.018 + strength * 0.035, now, 0.035);
    },
    [reducedMotion, soundEnabled]
  );

  const clearParticles = useCallback(() => {
    particlesRef.current = [];
    const canvas = particleCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    if (particleFrameRef.current !== null) {
      window.cancelAnimationFrame(particleFrameRef.current);
      particleFrameRef.current = null;
    }
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = particleCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current
      .map((particle) => ({
        ...particle,
        alpha: particle.alpha - 0.055,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.015
      }))
      .filter((particle) => particle.alpha > 0);

    particlesRef.current.forEach((particle) => {
      context.globalAlpha = particle.alpha;
      context.fillStyle = "rgba(23,32,51,0.28)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    if (particlesRef.current.length > 0) {
      particleFrameRef.current = window.requestAnimationFrame(drawParticles);
    } else {
      particleFrameRef.current = null;
    }
  }, []);

  const addScratchParticles = useCallback(
    (point: Point, velocity: number) => {
      if (reducedMotion) return;

      const amount = Math.min(5, Math.max(2, Math.round(velocity / 32)));
      for (let index = 0; index < amount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const travel = 0.35 + Math.random() * 1.15;
        particlesRef.current.push({
          alpha: 0.32 + Math.random() * 0.22,
          size: 0.8 + Math.random() * 1.6,
          vx: Math.cos(angle) * travel,
          vy: Math.sin(angle) * travel,
          x: point.x + (Math.random() - 0.5) * 26,
          y: point.y + (Math.random() - 0.5) * 22
        });
      }

      particlesRef.current = particlesRef.current.slice(-42);
      if (particleFrameRef.current === null) {
        particleFrameRef.current = window.requestAnimationFrame(drawParticles);
      }
    },
    [drawParticles, reducedMotion]
  );

  const finishIntro = useCallback(
    (hideDelay = 360) => {
      clearTimers();
      localStorage.setItem(STORAGE_KEY, "true");
      stopScratchSound();
      clearParticles();
      isDrawingRef.current = false;
      hasDraggedRef.current = false;
      lastPointRef.current = null;
      setIsPressing(false);
      setExiting(true);
      timersRef.current = [window.setTimeout(() => setVisible(false), hideDelay)];
    },
    [clearParticles, clearTimers, stopScratchSound]
  );

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCanvas = particleCanvasRef.current;
    const particleContext = particleCanvas?.getContext("2d");
    if (particleCanvas && particleContext) {
      particleCanvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
      particleCanvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
      particleCanvas.style.width = `${rect.width}px`;
      particleCanvas.style.height = `${rect.height}px`;
      particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particleContext.clearRect(0, 0, rect.width, rect.height);
    }

    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, rect.width, rect.height);

    const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#fbfaf5");
    gradient.addColorStop(0.42, "#eceae2");
    gradient.addColorStop(0.68, "#f7f5ef");
    gradient.addColorStop(1, "#dfe9ec");
    context.fillStyle = gradient;
    context.fillRect(0, 0, rect.width, rect.height);

    context.strokeStyle = "rgba(23, 32, 51, 0.055)";
    context.lineWidth = 1;
    for (let x = 0; x < rect.width; x += 46) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, rect.height);
      context.stroke();
    }
    for (let y = 0; y < rect.height; y += 46) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(rect.width, y);
      context.stroke();
    }

    context.globalAlpha = 0.11;
    for (let i = 0; i < 380; i += 1) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const radius = Math.random() * 1.8 + 0.25;
      context.fillStyle = i % 3 === 0 ? "#1d6f8f" : "#172033";
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 0.18;
    context.strokeStyle = "rgba(29, 111, 143, 0.35)";
    context.setLineDash([7, 12]);
    context.strokeRect(18, 18, rect.width - 36, rect.height - 36);
    context.setLineDash([]);
    context.globalAlpha = 1;
  }, []);

  const measureReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sourceContext = canvas.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) return;

    const sampleCanvas = progressCanvasRef.current ?? document.createElement("canvas");
    progressCanvasRef.current = sampleCanvas;
    const sampleSize = 96;
    sampleCanvas.width = sampleSize;
    sampleCanvas.height = sampleSize;
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!sampleContext) return;

    sampleContext.clearRect(0, 0, sampleSize, sampleSize);
    sampleContext.drawImage(canvas, 0, 0, sampleSize, sampleSize);
    const pixels = sampleContext.getImageData(0, 0, sampleSize, sampleSize).data;
    let cleared = 0;

    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] < 20) cleared += 1;
    }

    const nextProgress = cleared / (sampleSize * sampleSize);
    setRevealProgress(nextProgress);

    if (nextProgress >= REVEAL_THRESHOLD) {
      finishIntro(520);
    }
  }, [finishIntro]);

  const scheduleRevealMeasure = useCallback(() => {
    if (revealFrameRef.current !== null) return;
    revealFrameRef.current = window.requestAnimationFrame(() => {
      revealFrameRef.current = null;
      measureReveal();
    });
  }, [measureReveal]);

  const scratch = useCallback(
    (point: Point, previousPoint: Point | null, brushScale = 1, velocity = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const rect = canvas.getBoundingClientRect();
      const brush = Math.max(52, Math.min(104, rect.width * 0.085)) * brushScale;
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "rgba(0,0,0,1)";
      context.fillStyle = "rgba(0,0,0,1)";

      if (previousPoint) {
        const midX = (previousPoint.x + point.x) / 2;
        const midY = (previousPoint.y + point.y) / 2;
        context.lineWidth = brush;
        context.beginPath();
        context.moveTo(previousPoint.x, previousPoint.y);
        context.quadraticCurveTo(midX, midY, point.x, point.y);
        context.stroke();
      }

      context.beginPath();
      context.ellipse(point.x, point.y, brush * 0.54, brush * 0.44, Math.sin(point.x * 0.02) * 0.35, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 0.42;
      context.beginPath();
      context.ellipse(point.x + brush * 0.18, point.y - brush * 0.12, brush * 0.24, brush * 0.18, Math.cos(point.y * 0.02) * 0.4, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;

      for (let index = 0; index < 9; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = brush * (0.28 + Math.random() * 0.34);
        const edgeX = point.x + Math.cos(angle) * distance;
        const edgeY = point.y + Math.sin(angle) * distance;
        context.beginPath();
        context.ellipse(edgeX, edgeY, brush * (0.045 + Math.random() * 0.05), brush * (0.035 + Math.random() * 0.04), angle, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      addScratchParticles(point, velocity);
      scheduleRevealMeasure();
    },
    [addScratchParticles, scheduleRevealMeasure]
  );

  const playIntro = useCallback(
    (shouldReduceMotion: boolean) => {
      clearTimers();
      setExiting(false);
      setRevealProgress(0);
      setCursorPoint(null);
      setIsPressing(false);
      setVisible(true);

      if (shouldReduceMotion) {
        timersRef.current = [window.setTimeout(() => finishIntro(420), 1200)];
        return;
      }

      window.requestAnimationFrame(paintCover);
    },
    [clearTimers, finishIntro, paintCover]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const alreadySeen = localStorage.getItem(STORAGE_KEY) === "true";
    const shouldForceIntro = process.env.NODE_ENV === "development";
    const storedSound = localStorage.getItem(SOUND_STORAGE_KEY);

    setReducedMotion(media.matches);
    setSoundEnabled(storedSound !== "off");

    if (shouldForceIntro || !alreadySeen) {
      playIntro(media.matches);
    }

    function handleReplayIntro() {
      localStorage.removeItem(STORAGE_KEY);
      playIntro(media.matches);
    }

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    media.addEventListener("change", handleChange);
    window.addEventListener("portfolio:replay-intro", handleReplayIntro);
    return () => {
      media.removeEventListener("change", handleChange);
      window.removeEventListener("portfolio:replay-intro", handleReplayIntro);
      clearTimers();
      stopScratchSound();
      clearParticles();
      if (audioRef.current) {
        try {
          audioRef.current.source.stop();
        } catch {
          // Source may already be stopped by the browser.
        }
        void audioRef.current.context.close();
        audioRef.current = null;
      }
      if (revealFrameRef.current !== null) window.cancelAnimationFrame(revealFrameRef.current);
    };
  }, [clearParticles, clearTimers, playIntro, stopScratchSound]);

  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? "on" : "off");
    if (!soundEnabled) stopScratchSound();
  }, [soundEnabled, stopScratchSound]);

  useEffect(() => {
    if (!visible || reducedMotion) return undefined;

    paintCover();
    window.addEventListener("resize", paintCover);
    return () => window.removeEventListener("resize", paintCover);
  }, [paintCover, reducedMotion, visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] isolate min-h-dvh overflow-hidden bg-[#f7f5ef]/72 backdrop-blur-[2px]",
        exiting && "pointer-events-none opacity-0 transition-opacity duration-500 ease-out"
      )}
      role="presentation"
      aria-label="Portfolio scratch intro"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_46%,rgba(29,111,143,0.14),transparent_34%),linear-gradient(90deg,rgba(23,32,51,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(23,32,51,0.028)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px]" />

      <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6">
        <div
          className={cn(
            "relative isolate h-[min(78vh,42rem)] w-full max-w-5xl overflow-hidden border border-ink/18 shadow-[18px_18px_0_rgba(23,32,51,0.08),0_30px_90px_rgba(23,32,51,0.14)]",
            exiting && "scale-[1.015] opacity-0 transition duration-500 ease-out"
          )}
        >
          <div className="pointer-events-none absolute inset-0 z-0 border-[14px] border-[#f7f5ef]/88" />
          <div className="pointer-events-none absolute left-6 top-6 z-30 h-9 w-9 border-l border-t border-ink/30" />
          <div className="pointer-events-none absolute right-6 top-6 z-30 h-9 w-9 border-r border-t border-ink/30" />
          <div className="pointer-events-none absolute bottom-6 left-6 z-30 h-9 w-9 border-b border-l border-ink/30" />
          <div className="pointer-events-none absolute bottom-6 right-6 z-30 h-9 w-9 border-b border-r border-ink/30" />

          {!reducedMotion ? (
            <>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 h-full w-full cursor-none touch-none"
                aria-hidden="true"
                onPointerDown={(event) => {
                  isDrawingRef.current = true;
                  hasDraggedRef.current = false;
                  setIsPressing(true);
                  const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
                  setCursorPoint(point);
                  lastPointRef.current = point;
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                }}
                onPointerMove={(event) => {
                  const point = getCanvasPoint(event.currentTarget, event.clientX, event.clientY);
                  setCursorPoint(point);

                  if (!isDrawingRef.current) return;

                  if (lastPointRef.current) {
                    const distance = Math.hypot(point.x - lastPointRef.current.x, point.y - lastPointRef.current.y);
                    if (distance > 2) hasDraggedRef.current = true;
                  }

                  if (hasDraggedRef.current) {
                    const velocity = lastPointRef.current ? Math.hypot(point.x - lastPointRef.current.x, point.y - lastPointRef.current.y) : 0;
                    scratch(point, lastPointRef.current, event.pointerType === "touch" ? 1.18 : 1, velocity);
                    startScratchSound(velocity);
                  }
                  lastPointRef.current = point;
                }}
                onPointerUp={() => {
                  isDrawingRef.current = false;
                  hasDraggedRef.current = false;
                  lastPointRef.current = null;
                  setIsPressing(false);
                  stopScratchSound();
                }}
                onPointerCancel={() => {
                  isDrawingRef.current = false;
                  hasDraggedRef.current = false;
                  lastPointRef.current = null;
                  setIsPressing(false);
                  stopScratchSound();
                }}
                onPointerLeave={() => {
                  isDrawingRef.current = false;
                  hasDraggedRef.current = false;
                  lastPointRef.current = null;
                  setIsPressing(false);
                  setCursorPoint(null);
                  stopScratchSound();
                }}
                onPointerEnter={(event) => {
                  setCursorPoint(getCanvasPoint(event.currentTarget, event.clientX, event.clientY));
                }}
              />
              <canvas ref={particleCanvasRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden="true" />
            </>
          ) : (
            <div className="absolute inset-0 z-10 bg-[#f7f5ef]/96" />
          )}

          <div className="pointer-events-none absolute inset-0 z-20 grid grid-rows-[auto_1fr_auto] p-7 text-ink sm:p-10">
            <div className="flex items-start justify-between gap-6 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              <p>DANI ADONAI / PORTFOLIO 2026</p>
              <p className="hidden text-right sm:block">Melbourne / Australia</p>
            </div>

            <div className="grid content-center gap-8 py-8 sm:grid-cols-[1fr_15rem] sm:items-center">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">Admission / portfolio access</p>
                <h1 className="mt-5 max-w-2xl text-[clamp(4.2rem,12vw,9rem)] font-semibold uppercase leading-[0.78] tracking-tight">
                  Scratch<br />to Reveal
                </h1>
                <p className="mt-7 max-w-md font-mono text-[0.7rem] uppercase leading-6 tracking-[0.16em] text-slate-500">
                  {reducedMotion ? "Enter the portfolio when ready." : "Press, hold and drag across the surface to uncover the portfolio."}
                </p>
              </div>

              <div className="grid gap-3 border-l border-ink/12 pl-5 font-mono text-[0.66rem] uppercase leading-5 tracking-[0.16em] text-slate-500">
                <p>01 / Software</p>
                <p>02 / Cloud</p>
                <p>03 / Cybersecurity</p>
                <p>RMIT / Information Technology</p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="w-44">
                <div className="h-px bg-ink/15">
                  <span className="block h-px bg-accent transition-[width] duration-200" style={{ width: `${Math.min(100, Math.round(revealProgress * 100))}%` }} />
                </div>
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-slate-500">
                  Revealed / {Math.min(100, Math.round(revealProgress * 100))}%
                </p>
              </div>
              <p className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-slate-400 sm:block">Surface coating / removable</p>
            </div>
          </div>

          {!reducedMotion && cursorPoint ? (
            <div
              className={cn(
                "pointer-events-none absolute z-40 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/35 bg-[#f7f5ef]/20 font-mono text-[0.48rem] uppercase tracking-[0.14em] text-ink/70 backdrop-blur-[1px] transition-transform duration-150",
                isPressing && "scale-75 border-accent/60 bg-accent/10 text-accent"
              )}
              style={{ left: cursorPoint.x, top: cursorPoint.y }}
            >
              Scratch
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => finishIntro(220)}
            className="absolute bottom-7 right-7 z-40 border border-ink/18 bg-[#f7f5ef]/88 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur transition hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-[#f7f5ef] sm:bottom-10 sm:right-10"
          >
            Enter without scratching
          </button>
          {!reducedMotion ? (
            <button
              type="button"
              onClick={() => setSoundEnabled((value) => !value)}
              className="absolute bottom-20 right-7 z-40 border border-ink/12 bg-[#f7f5ef]/76 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-slate-600 backdrop-blur transition hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-[#f7f5ef] sm:bottom-24 sm:right-10"
              aria-pressed={soundEnabled}
            >
              Sound: <span className="text-ink">{soundEnabled ? "On" : "Off"}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
