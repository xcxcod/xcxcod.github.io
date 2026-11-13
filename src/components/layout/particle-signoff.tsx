"use client";

import { useEffect, useRef } from "react";

type Dash = { x: number; y: number; dx: number; dy: number; vertical: boolean };

export function ParticleSignoff({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const mask = document.createElement("canvas");
    const ink = mask.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context || !ink) return;

    const motion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let dashes: Dash[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let disposed = false;
    let step = 4;
    let width = 0;
    let height = 0;

    function draw() {
      frame = 0;
      if (!context) return;
      context.clearRect(0, 0, width, height);
      let moving = false;
      const radius = Math.min(100, height * 0.58);

      for (const dash of dashes) {
        const x = pointer ? dash.x - pointer.x : 0;
        const y = pointer ? dash.y - pointer.y : 0;
        const distance = Math.hypot(x, y);
        const force = pointer && distance < radius ? 34 * (1 - distance / radius) ** 2 : 0;
        const targetX = (x / (distance || 1)) * force;
        const targetY = (y / (distance || 1)) * force;
        if (Math.abs(targetX - dash.dx) + Math.abs(targetY - dash.dy) > 0.05) {
          dash.dx += (targetX - dash.dx) * 0.22;
          dash.dy += (targetY - dash.dy) * 0.22;
          moving = true;
        } else {
          dash.dx = targetX;
          dash.dy = targetY;
        }
        const long = step * 0.83;
        const short = Math.max(1, step * 0.27);
        const w = dash.vertical ? short : long;
        const h = dash.vertical ? long : short;
        context.fillRect(dash.x + dash.dx - w / 2, dash.y + dash.dy - h / 2, w, h);
      }

      if (moving) frame = requestAnimationFrame(draw);
    }

    function rebuild() {
      if (disposed || !canvas || !context || !ink) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      cancelAnimationFrame(frame);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = getComputedStyle(canvas).color;
      mask.width = width;
      mask.height = height;
      const text = name.trim().toUpperCase();
      const font = '600 100px "Chakra Petch", Arial, sans-serif';
      ink.font = font;
      const size = Math.min(height * 0.82, 100 * (width - 16) / Math.max(1, ink.measureText(text).width));
      ink.font = font.replace("100px", `${size}px`);
      ink.textAlign = "center";
      const metrics = ink.measureText(text);
      const baseline = (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      ink.fillText(text, width / 2, baseline);
      const { data } = ink.getImageData(0, 0, width, height);
      step = size >= 100 ? 5 : size >= 54 ? 4 : 3;
      dashes = [];
      for (let y = step; y < height; y += step) {
        for (let x = step; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] > 140) {
            dashes.push({ x, y, dx: 0, dy: 0, vertical: (x / step + y / step) % 2 === 0 });
          }
        }
      }
      draw();
      canvas.dataset.ready = String(dashes.length > 0);
    }

    function move(event: PointerEvent) {
      if (!motion.matches || event.pointerType === "touch" || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function reset() {
      pointer = null;
      if (!motion.matches) rebuild();
      else if (!frame) frame = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(rebuild);
    observer.observe(canvas);
    void document.fonts.load('600 100px "Chakra Petch"').then(rebuild, rebuild);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", reset);
    motion.addEventListener("change", reset);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", reset);
    };
  }, [name]);

  return (
    <div className="particle-signoff md:col-span-2" aria-hidden="true">
      <canvas ref={canvasRef} />
      <p className="signal-signoff">{name}</p>
    </div>
  );
}
