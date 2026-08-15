"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

const GRID_SIZE = 4;

function resetTile(tile: HTMLElement) {
  tile.style.transform = "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
  tile.style.boxShadow = "none";
}

export function HeroPortrait({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const frameId = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [motionEnabled, setMotionEnabled] = useState(false);
  const tiles = useMemo(() => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => index), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setMotionEnabled(!media.matches && hasFinePointer);

    function handleChange(event: MediaQueryListEvent) {
      setMotionEnabled(!event.matches && hasFinePointer);
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function applyTileTransforms() {
    frameId.current = null;
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const { x, y } = pointerRef.current;

    frame.querySelectorAll<HTMLElement>("[data-portrait-tile]").forEach((tile) => {
      const tileRect = tile.getBoundingClientRect();
      const centerX = tileRect.left + tileRect.width / 2;
      const centerY = tileRect.top + tileRect.height / 2;
      const dx = centerX - x;
      const dy = centerY - y;
      const distance = Math.hypot(dx, dy);
      const radius = rect.width * 0.62;

      if (distance > radius) {
        resetTile(tile);
        return;
      }

      const force = (1 - distance / radius) ** 1.45;
      const normalizedX = (x - centerX) / radius;
      const normalizedY = (y - centerY) / radius;
      const shiftX = -normalizedX * force * 7;
      const shiftY = -normalizedY * force * 7;
      const rotateX = normalizedY * force * 8;
      const rotateY = -normalizedX * force * 8;
      const lift = force * 16;

      tile.style.transform = `translate3d(${shiftX}px, ${shiftY}px, ${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      tile.style.boxShadow = `0 ${Math.round(force * 12)}px ${Math.round(14 + force * 16)}px rgba(23,32,51,${0.05 + force * 0.08})`;
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!motionEnabled || event.pointerType === "touch") return;

    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameId.current === null) {
      frameId.current = window.requestAnimationFrame(applyTileTransforms);
    }
  }

  function resetPortrait() {
    if (frameId.current !== null) {
      window.cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
    frameRef.current?.querySelectorAll<HTMLElement>("[data-portrait-tile]").forEach(resetTile);
  }

  function handleClick() {
    if (!motionEnabled || !frameRef.current) return;

    frameRef.current.querySelectorAll<HTMLElement>("[data-portrait-tile]").forEach((tile, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = (col - 1.5) * 3;
      const y = (row - 1.5) * 3;

      tile.animate(
        [
          { transform: tile.style.transform || "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)" },
          { transform: `translate3d(${x}px, ${y}px, 24px) rotateX(${(row - 1.5) * -5}deg) rotateY(${(col - 1.5) * 5}deg)` },
          { transform: "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)" }
        ],
        { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    });
  }

  if (!imageUrl) {
    return (
      <div className="mx-auto aspect-[4/4.45] max-w-[24rem] overflow-hidden rounded-[2rem] bg-slate-100 shadow-[18px_18px_0_rgba(23,32,51,0.08)] dark:bg-slate-900 lg:max-w-none">
        <div className="image-noise flex h-full items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">YOUR_PROFILE_IMAGE</div>
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPortrait}
      onClick={handleClick}
      className="group/portrait mx-auto aspect-[4/4.45] max-w-[24rem] overflow-hidden rounded-[2rem] bg-slate-100 shadow-[18px_18px_0_rgba(23,32,51,0.08)] outline-none dark:bg-slate-900 lg:max-w-none"
      style={{ perspective: "1000px" }}
      role="img"
      aria-label={alt}
      tabIndex={0}
    >
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 rounded-[2rem]" aria-hidden="true">
        {tiles.map((tile) => {
          const row = Math.floor(tile / GRID_SIZE);
          const col = tile % GRID_SIZE;

          return (
            <span
              key={tile}
              data-portrait-tile
              className="block bg-cover bg-no-repeat transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                backgroundPosition: `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`,
                transformStyle: "preserve-3d"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
