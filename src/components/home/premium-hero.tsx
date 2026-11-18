"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { InteractiveField } from "./interactive-field";
import { createHeroMotion } from "@/lib/hero-motion";
import type { Profile } from "@/types/portfolio";

export function PremiumHero({profile}:{profile:Profile}) {
  const root = useRef<HTMLElement>(null);
  const motion = useRef(createHeroMotion());
  useLayoutEffect(() => {
    const host=root.current;if(!host)return;
    const desktop=matchMedia("(min-width: 901px) and (min-height: 650px)"),reduced=matchMedia("(prefers-reduced-motion: reduce)");
    let disposed=false,requested=false,teardown=()=>{};
    function prepare() {
      if(requested||!desktop.matches||reduced.matches)return;
      requested=true;
      import("@/lib/create-hero-timeline").then(({createHeroTimeline})=>{
        if(!disposed)teardown=createHeroTimeline(host!,motion);
      }).catch(()=>{requested=false;}); // Static semantic hero remains available if the chunk fails.
    }
    prepare();desktop.addEventListener("change",prepare);reduced.addEventListener("change",prepare);
    return()=>{disposed=true;teardown();desktop.removeEventListener("change",prepare);reduced.removeEventListener("change",prepare);};
  },[]);
  return <section ref={root} className="studio-hero premium-hero" aria-label="Introduction">
    <div className="hero-scene">
      <div className="hero-heading"><div><p className="eyebrow"><span className="connection-marker"/> {profile.name} · {profile.location}</p><h1><span className="hero-line"><span>Turning curiosity</span></span><span className="hero-line"><span>into <em>working ideas.</em></span></span></h1></div><div className="hero-intro"><p>{profile.study} student at {profile.university}. Learning by connecting software, systems and security.</p><a className="pill-link" href="#selected-work">Discover my work <ArrowDownRight size={19} aria-hidden/></a></div></div>
      <div className="hero-visual-wrap"><InteractiveField motion={motion}/>
      <div className="hero-bridge" aria-hidden="true"><span className="eyebrow">Curiosity → practice → possibility</span><p><span className="hero-bridge-line"><span>Ideas become real</span></span><span className="hero-bridge-line"><span><em>when you build.</em></span></span></p><span className="hero-scroll-cue">Scroll into the work <ArrowDownRight size={20}/></span></div>
      </div><div className="scene-meter" aria-hidden="true"><span/></div>
    </div>
  </section>;
}
