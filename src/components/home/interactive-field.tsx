"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState } from "react";
import { ArrowDownRight, Pause, Play } from "lucide-react";
import type { MutableRefObject, ReactNode } from "react";
import type { HeroMotionState } from "@/lib/hero-motion";
import portfolio from "../../../public/images/portfolio-current.jpg";

const GlassScene = dynamic(() => import("./glass-scene"),{ssr:false});
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? null : this.props.children;}
}

export function InteractiveField({motion}:{motion:MutableRefObject<HeroMotionState>}) {
  const surface = useRef<HTMLDivElement>(null);
  const pointer = useRef({x:.32,y:0,active:false});
  const [playing,setPlaying] = useState(true),[active,setActive] = useState(false),[enhanced,setEnhanced] = useState(false);
  useEffect(() => {
    const desktop=matchMedia("(min-width: 901px) and (min-height: 650px)"), reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const preference=()=>setEnhanced(desktop.matches&&!reduced.matches);
    preference();desktop.addEventListener("change",preference);reduced.addEventListener("change",preference);
    const observer=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting));if(surface.current)observer.observe(surface.current);
    return ()=>{observer.disconnect();desktop.removeEventListener("change",preference);reduced.removeEventListener("change",preference);};
  },[]);
  return <div ref={surface} className="studio-field glass-field" onPointerMove={event=>{
    if(event.pointerType!=="mouse"||!playing||!enhanced)return;
    // Viewport coordinates avoid synchronous DOM measurement after timeline writes.
    pointer.current={x:event.clientX/innerWidth*2-1,y:1-event.clientY/innerHeight*2,active:true};motion.current.invalidate();
  }} onPointerLeave={()=>{pointer.current.active=false;motion.current.invalidate();}}>
    <div className="glass-fallback" aria-hidden="true"><Image src={portfolio} alt="" sizes="(max-width: 900px) 80vw, 45vw"/></div>
    {enhanced&&<SceneBoundary><GlassScene pointer={pointer} motion={motion} running={playing&&active}/></SceneBoundary>}
    <div className="field-corner"><span className="live-dot"/> An experiment in perspective</div>
    <div className="field-copy"><p>Look closer. There’s a story in the details.</p><h2>A different<br/>perspective.</h2></div>
    <div className="glass-project-label" aria-hidden="true"><span>01 / PORTFOLIO WEBSITE</span><span>Design · Development · Exploration</span></div>
    <div className="field-bottom"><a href="#selected-work">Explore the work <ArrowDownRight size={20} aria-hidden/></a>{enhanced&&<><span className="glass-hint">Move to explore the lens</span><button type="button" onClick={()=>setPlaying(value=>!value)} aria-label={playing ? "Pause lens animation" : "Play lens animation"} aria-pressed={!playing}>{playing?<Pause size={16}/>:<Play size={16}/>}<span>{playing?"Motion on":"Motion off"}</span></button></>}</div>
  </div>;
}
