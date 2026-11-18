"use client";

import { useEffect, useRef } from "react";
import { createFluidRenderer } from "@/lib/graphics/fluid-renderer";

export function FluidCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let renderer: ReturnType<typeof createFluidRenderer> = null;
    let frame = 0, previousTime = 0, lastInput = 0;
    let contextLost = false;
    let lastPointer: {x:number;y:number} | null = null;
    const pending: [number,number,number,number][] = [];
    const enabled = () => !contextLost && !preference.matches && finePointer.matches && !document.hidden;
    function stop() {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0; lastPointer = null;
      pending.length = 0; renderer?.clear();
    }
    function configure() {
      stop();
      if (!enabled()) { node!.hidden = true; return; }
      renderer ??= createFluidRenderer(node!);
      node!.hidden = !renderer;
      node!.dataset.renderer = renderer ? "webgl2" : "unavailable";
    }
    function tick(time: number) {
      if (!enabled() || !renderer) { stop(); return; }
      const dt = previousTime ? Math.min(.033,Math.max(.008,(time-previousTime)/1000)) : .016;
      previousTime = time;
      while (pending.length) renderer.splat(...pending.shift()!);
      renderer.render(dt);
      // Sleep after the density has dissipated, with no idle GPU rendering.
      if (time-lastInput < 4500) frame = requestAnimationFrame(tick);
      else { renderer.clear(); frame = 0; previousTime = 0; }
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !enabled() || !renderer) return;
      if (!lastPointer) { lastPointer = {x:event.clientX,y:event.clientY}; return; }
      const dx = event.clientX-lastPointer.x, dy = lastPointer.y-event.clientY;
      lastPointer = {x:event.clientX,y:event.clientY};
      if (!dx && !dy) return;
      // Ignore pointer teleports between windows rather than injecting a giant splat.
      if (Math.hypot(dx,dy) > 250) return;
      if (pending.length === 24) pending.shift();
      pending.push([event.clientX/innerWidth,1-event.clientY/innerHeight,dx,dy]);
      lastInput = performance.now();
      if (!frame) frame = requestAnimationFrame(tick);
    }
    function leave() { lastPointer = null; }
    function resize() { stop(); renderer?.resize(); }
    function lost(event: Event) { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); frame = 0; pending.length = 0; lastPointer = null; node!.hidden = true; }
    function restored() { contextLost = false; renderer?.dispose(); renderer = null; configure(); }
    configure();
    window.addEventListener("pointermove",move,{passive:true});
    document.documentElement.addEventListener("pointerleave",leave);
    window.addEventListener("blur",stop); window.addEventListener("resize",resize);
    document.addEventListener("visibilitychange",configure);
    preference.addEventListener("change",configure); finePointer.addEventListener("change",configure);
    node.addEventListener("webglcontextlost",lost); node.addEventListener("webglcontextrestored",restored);
    return () => {
      stop(); renderer?.dispose();
      window.removeEventListener("pointermove",move); document.documentElement.removeEventListener("pointerleave",leave);
      window.removeEventListener("blur",stop); window.removeEventListener("resize",resize);
      document.removeEventListener("visibilitychange",configure);
      preference.removeEventListener("change",configure); finePointer.removeEventListener("change",configure);
      node.removeEventListener("webglcontextlost",lost); node.removeEventListener("webglcontextrestored",restored);
    };
  },[]);
  return <canvas ref={canvas} hidden className="fluid-cursor" aria-hidden="true" />;
}
