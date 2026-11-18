"use client";

import { useLayoutEffect, useRef } from "react";
import { scrollProgress } from "@/lib/scroll-progress";

type Track = { element: HTMLElement; animation: Animation; start: number; end: number; anchor?: HTMLElement; phase?: [number,number] };

export function ScrollPresentation({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let destroy = () => {};
    function setup() {
      destroy();
      if (preference.matches) return;
      const tracks: Track[] = [], entrance: Animation[] = [];
      const forced = new WeakSet<HTMLElement>();
      let frame = 0, entered = false;
      host!.dataset.motion = "on";
      const add = (element: HTMLElement, frames: Keyframe[], anchor?: HTMLElement, phase?: [number,number]) => {
        const animation = element.animate(frames,{duration:1000,fill:"both",easing:"cubic-bezier(.22,.65,.3,1)"});
        animation.pause(); animation.currentTime = 0;
        tracks.push({element,animation,start:0,end:1,anchor,phase});
      };
      host!.querySelectorAll<HTMLElement>("[data-reveal] > *, .learning-detail > div, .studio-toolkit dl > div").forEach(element => {
        add(element,[{opacity:0,transform:"translateY(64px)",clipPath:"inset(0 0 100% 0)"},{opacity:1,transform:"translateY(0)",clipPath:"inset(0 0 0% 0)"}]);
      });
      host!.querySelectorAll<HTMLElement>("[data-scroll-stage]").forEach(stage => {
        const image = stage.querySelector<HTMLElement>(".project-cover");
        const caption = stage.querySelector<HTMLElement>(".project-caption");
        if (image) add(image,[{clipPath:"inset(12% 18% 12% 18% round 24px)",transform:"scale(.9)"},{clipPath:"inset(0% 0% 0% 0% round 18px)",transform:"scale(1)"}],stage,[0,.65]);
        if (caption) add(caption,[{opacity:0,transform:"translateY(55px)"},{opacity:1,transform:"translateY(0)"}],stage,[.38,.85]);
      });
      const footer = document.querySelector<HTMLElement>(".studio-footer");
      footer?.querySelectorAll<HTMLElement>(".eyebrow,.studio-contact-title,.footer-invitation").forEach(element => add(element,[{opacity:0,transform:"translateY(70px)",clipPath:"inset(0 0 100% 0)"},{opacity:1,transform:"translateY(0)",clipPath:"inset(0 0 0% 0)"}]));
      host!.querySelectorAll<HTMLElement>(".hero-heading .eyebrow,.hero-line > span,.hero-intro,.studio-field").forEach((element,index) => {
        const animation = element.animate([{opacity:0,transform:"translateY(50px)"},{opacity:1,transform:"translateY(0)"}],{duration:1050,delay:index*110,fill:"both",easing:"cubic-bezier(.16,1,.3,1)"});
        animation.pause(); entrance.push(animation);
      });
      function enter() {
        if (entered || document.body.dataset.introState !== "complete") return;
        entered = true; entrance.forEach(animation => animation.play());
      }
      function update() {
        frame = 0;
        for (const track of tracks) {
          const progress = forced.has(track.element) ? 1 : scrollProgress(scrollY,track.start,track.end);
          track.animation.currentTime = progress*1000;
          track.element.dataset.revealProgress = progress.toFixed(3);
        }
      }
      function measure() {
        // Measure the natural layout, never the currently translated animation bounds.
        tracks.forEach(track => {track.animation.currentTime = 1000;});
        for (const track of tracks) {
          const element = track.anchor ?? track.element;
          const top = element.getBoundingClientRect().top+scrollY;
          if (track.anchor && track.phase) {
            const distance = Math.max(innerHeight*.7,element.offsetHeight-innerHeight*.45);
            track.start = top-innerHeight*.8+distance*track.phase[0];
            track.end = top-innerHeight*.8+distance*track.phase[1];
          } else {
            track.start = top-innerHeight*.94;
            track.end = Math.min(top-innerHeight*.48,document.documentElement.scrollHeight-innerHeight);
          }
        }
        update();
      }
      function schedule() { if (!frame) frame = requestAnimationFrame(update); }
      function focus(event: FocusEvent) {
        for (const track of tracks) if (event.target instanceof Node && track.element.contains(event.target)) forced.add(track.element);
        schedule();
      }
      const resize = new ResizeObserver(measure); resize.observe(host!);
      window.addEventListener("scroll",schedule,{passive:true}); window.addEventListener("resize",measure);
      window.addEventListener("portfolio:intro-complete",enter); document.addEventListener("focusin",focus);
      measure(); enter();
      destroy = () => {
        cancelAnimationFrame(frame); resize.disconnect();
        window.removeEventListener("scroll",schedule); window.removeEventListener("resize",measure);
        window.removeEventListener("portfolio:intro-complete",enter); document.removeEventListener("focusin",focus);
        tracks.forEach(track => {track.animation.cancel(); delete track.element.dataset.revealProgress;}); entrance.forEach(animation => animation.cancel());
        delete host!.dataset.motion;
      };
    }
    setup(); preference.addEventListener("change",setup);
    return () => {destroy(); preference.removeEventListener("change",setup);};
  },[]);
  return <div ref={root} className="scroll-presentation">{children}</div>;
}
