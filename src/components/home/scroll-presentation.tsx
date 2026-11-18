"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { scrollProgress } from "@/lib/scroll-progress";

type Track = { element: HTMLElement; animation: Animation; anchor: HTMLElement; phase: [number,number]; scene: boolean; start: number; end: number };

/** One native-scroll clock. Paused WAAPI timelines never advance on wall time. */
export function ScrollPresentation({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused,setPaused] = useState(false);
  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 900px)");
    let destroy = () => {};
    function setup() {
      destroy();
      if (!host || preference.matches || paused || !Element.prototype.animate) return;
      const tracks:Track[] = [];
      const scenes = Array.from(host.querySelectorAll<HTMLElement>("[data-motion-scene]:not(.studio-hero)"));
      const forced = new WeakSet<HTMLElement>();
      let frame = 0, disposed = false;
      host.dataset.motion = "on";
      const add = (element:HTMLElement|null, frames:Keyframe[], anchor?:HTMLElement, phase:[number,number] = [0,1], scene = false) => {
        if (!element) return;
        const animation = element.animate(frames,{duration:1000,fill:"both",easing:"linear"});
        animation.pause();animation.currentTime = 0;
        tracks.push({element,animation,anchor:anchor ?? element,phase,scene,start:0,end:1});
      };
      const masked:Keyframe[] = [{opacity:0,transform:"translate3d(0,70px,0)",clipPath:"inset(0 0 100% 0)"},{opacity:1,transform:"translate3d(0,0,0)",clipPath:"inset(0 0 0% 0)"}];
      host.querySelectorAll<HTMLElement>("[data-reveal] > *").forEach(element => {
        if (!element.closest(".studio-story,.studio-learning")) add(element,masked);
      });
      host.querySelectorAll<HTMLElement>("[data-scroll-stage]").forEach(stage => {
        add(stage.querySelector(".project-cover"),[{clipPath:"inset(8% 15% 8% 15% round 32px)",transform:"scale(.86)"},{clipPath:"inset(0 0 0 0 round 16px)",transform:"scale(1)"}],stage,[0,.55],true);
        add(stage.querySelector(".project-cover img"),[{transform:"perspective(1400px) rotateX(12deg) rotateY(-8deg) scale(.94)"},{transform:"perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)"}],stage,[.1,.64],true);
        add(stage.querySelector(".project-caption"),masked,stage,[.44,.78],true);
        add(stage.querySelector(".project-cover-label"),[{opacity:0},{opacity:1}],stage,[.45,.65],true);
        add(stage.querySelector(".project-tech"),[{opacity:0,transform:"translateX(30px)"},{opacity:1,transform:"translateX(0)"}],stage,[.65,.9],true);
      });
      const story = host.querySelector<HTMLElement>(".studio-story");
      if (story) {
        add(story.querySelector(".studio-introduction > .eyebrow"),masked,story,[0,.18],true);
        add(story.querySelector("h2"),[{clipPath:"inset(0 0 100% 0)",transform:"translateY(70px)"},{clipPath:"inset(0 0 0% 0)",transform:"translateY(0)"}],story,[.08,.45],true);
        add(story.querySelector(".introduction-copy"),masked,story,[.34,.75],true);
        add(story.querySelector(".about-portrait"),[{opacity:0,transform:"translateY(35px)",clipPath:"inset(8% 0 8% 0 round 20px)"},{opacity:1,transform:"translateY(0)",clipPath:"inset(0 0 0 0 round 20px)"}],story,[.12,.58],true);
        add(story.querySelector(".story-wordmark"),[{transform:"translateX(12%)",opacity:.2},{transform:"translateX(-5%)",opacity:1}],story,[0,1],true);
      }
      const learning = host.querySelector<HTMLElement>(".studio-learning");
      if (learning) {
        add(learning.querySelector("[data-reveal]"),masked,learning,[0,.35],true);
        learning.querySelectorAll<HTMLElement>(".learning-detail > div").forEach((element,index) => add(element,masked,learning,[.15+index*.3,.55+index*.3],true));
      }
      const footer = document.querySelector<HTMLElement>(".studio-footer");
      footer?.querySelectorAll<HTMLElement>(".eyebrow,.studio-contact-title,.footer-invitation").forEach(element => add(element,masked));
      const bounds = new Map<HTMLElement,{top:number;distance:number}>();
      function update() {
        frame = 0;
        if (disposed) return;
        for (const track of tracks) {
          const progress = forced.has(track.element) ? 1 : scrollProgress(scrollY,track.start,track.end);
          if (track.animation.currentTime !== progress*1000) {
            track.animation.currentTime = progress*1000;
            track.element.dataset.revealProgress = progress.toFixed(3);
          }
        }
        for (const scene of scenes) {
          const range = bounds.get(scene);
          if (range) scene.dataset.sceneProgress = scrollProgress(scrollY,range.top,range.top+range.distance).toFixed(4);
        }
        window.dispatchEvent(new Event("portfolio:scroll"));
      }
      function measure() {
        if (disposed) return;
        tracks.forEach(track => {track.animation.currentTime = 1000;});
        const topOf = (element:HTMLElement) => {let y = 0;let cursor:HTMLElement|null = element;while(cursor){y += cursor.offsetTop;cursor = cursor.offsetParent as HTMLElement|null;}return y;};
        scenes.forEach(scene => bounds.set(scene,{top:topOf(scene),distance:Math.max(1,scene.offsetHeight-innerHeight)}));
        const maximum = document.documentElement.scrollHeight-innerHeight;
        for (const track of tracks) {
          const top = topOf(track.anchor);
          if (track.scene) {
            const pinned = !compact.matches && track.anchor.matches(".studio-hero,.studio-story,[data-scroll-stage]");
            const start = top-(pinned ? 0 : innerHeight*.85);
            const distance = pinned ? Math.max(innerHeight*.55,track.anchor.offsetHeight-innerHeight) : Math.max(innerHeight*.8,track.anchor.offsetHeight*.85);
            track.start = start+distance*track.phase[0];track.end = Math.min(maximum,start+distance*track.phase[1]);
          } else {
            track.start = top-innerHeight*.92;track.end = Math.min(maximum,top-innerHeight*.5);
          }
        }
        update();
      }
      function schedule() {if (!frame) frame = requestAnimationFrame(update);}
      function focus(event:FocusEvent) {
        for (const track of tracks) if (event.target instanceof Node && track.element.contains(event.target)) forced.add(track.element);
        schedule();
      }
      const resize = new ResizeObserver(measure);resize.observe(host);
      window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",measure);
      document.addEventListener("focusin",focus);
      measure();document.fonts?.ready.then(() => {if (!disposed) measure();});
      destroy = () => {
        disposed = true;cancelAnimationFrame(frame);resize.disconnect();
        window.removeEventListener("scroll",schedule);window.removeEventListener("resize",measure);
        document.removeEventListener("focusin",focus);
        tracks.forEach(track => {track.animation.cancel();delete track.element.dataset.revealProgress;});
        scenes.forEach(scene => {delete scene.dataset.sceneProgress;});delete host.dataset.motion;
        window.dispatchEvent(new Event("portfolio:scroll"));
      };
    }
    setup();preference.addEventListener("change",setup);compact.addEventListener("change",setup);
    return () => {destroy();preference.removeEventListener("change",setup);compact.removeEventListener("change",setup);};
  },[paused,children]);
  return <div ref={root} className="scroll-presentation"><div className="motion-access"><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Enable scroll effects" : "Pause scroll effects"}</button></div>{children}</div>;
}
