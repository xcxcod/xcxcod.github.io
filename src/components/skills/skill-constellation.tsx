"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowUpRight, List, Move3D, Pause, Play, RotateCcw, X } from "lucide-react";
import { TechnologyLogo, TechnologyLink } from "./toolkit-section";
import { buildConstellation, documentedProjects } from "@/lib/skill-constellation";
import type { SkillNode } from "@/lib/skill-constellation";
import type { Project, SkillGroup } from "@/types/portfolio";

const Scene = dynamic(() => import("./skill-constellation-scene"),{ssr:false,loading:() => <p className="constellation-loading" role="status">Preparing the constellation…</p>});

class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() {return {failed:true};}
  render() {return this.state.failed ? this.props.fallback : this.props.children;}
}

export function SkillConstellation({groups,projects}:{groups:SkillGroup[];projects:Project[]}) {
  const graph = useMemo(() => buildConstellation(groups,projects),[groups,projects]);
  const [category,setCategory] = useState<string|null>(null);
  const [selected,setSelected] = useState<SkillNode|null>(null);
  const [hovered,setHovered] = useState<string|null>(null);
  const [list,setList] = useState(false);
  const [large,setLarge] = useState(false);
  const [reduced,setReduced] = useState(true);
  const [visible,setVisible] = useState(false);
  const [ready,setReady] = useState(false);
  const [playing,setPlaying] = useState(true);
  const [resetKey,setResetKey] = useState(0);
  const chapter = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const engaged = useRef(false);
  const invalidate = useRef<() => void>(() => {});
  const previousTrigger = useRef<HTMLElement|null>(null);
  const information = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selected && (!large || list)) information.current?.scrollIntoView({behavior:reduced ? "auto" : "smooth",block:"nearest"});
  },[selected,large,list,reduced]);
  useEffect(() => {
    const screen = matchMedia("(min-width: 1000px)"), motion = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {setLarge(screen.matches);setReduced(motion.matches);};
    preference();screen.addEventListener("change",preference);motion.addEventListener("change",preference);
    const observer = new IntersectionObserver(([entry]) => {setVisible(entry.isIntersecting);if (entry.isIntersecting) setReady(true);},{rootMargin:"150px"});
    if (chapter.current) observer.observe(chapter.current);
    let frame = 0;
    function update() {
      frame = 0;
      const rect = chapter.current?.getBoundingClientRect();
      if (rect) {
        const host = chapter.current?.closest<HTMLElement>(".scroll-presentation");
        progress.current = motion.matches || !playing || engaged.current || (host && host.dataset.motion !== "on") ? 1 : Math.max(0,Math.min(1,(innerHeight*.9-rect.top)/(innerHeight*.9)));
        chapter.current?.style.setProperty("--assembly",String(progress.current));
        chapter.current?.setAttribute("data-assembly",progress.current.toFixed(3));
        if (rect.bottom > 0 && rect.top < innerHeight) invalidate.current();
      }
    }
    const schedule = () => {if (!frame) frame = requestAnimationFrame(update);};
    const resize = new ResizeObserver(schedule);if (chapter.current) resize.observe(chapter.current);
    const clock = chapter.current?.closest(".scroll-presentation") ? "portfolio:scroll" : "scroll";
    update();window.addEventListener(clock,schedule,{passive:true});window.addEventListener("resize",schedule);
    return () => {observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);screen.removeEventListener("change",preference);motion.removeEventListener("change",preference);window.removeEventListener(clock,schedule);window.removeEventListener("resize",schedule);};
  },[playing]);
  const relevant = selected ? documentedProjects(projects,selected.name) : [];
  function engage() {engaged.current = true;progress.current = 1;chapter.current?.style.setProperty("--assembly","1");chapter.current?.setAttribute("data-assembly","1.000");invalidate.current();}
  function select(node:SkillNode,trigger?:HTMLElement) {engage();previousTrigger.current = trigger ?? null;setSelected(node);}
  function close() {setSelected(null);previousTrigger.current?.focus();}
  function reset() {engage();setCategory(null);setHovered(null);setSelected(null);setResetKey(key => key+1);}
  const filtered = graph.clusters.filter(cluster => !category || cluster.id === category);
  const cards = <div className="constellation-mobile-clusters">{filtered.map(cluster => <section key={cluster.id} aria-label={cluster.name}><h3>{cluster.name}</h3><div>{cluster.nodes.map(node => <button type="button" key={node.id} onClick={event => select(node,event.currentTarget)} aria-pressed={selected?.id === node.id} aria-controls="skill-information"><TechnologyLogo skill={node.name} size={30}/><span>{node.name}</span><ArrowUpRight size={14}/></button>)}</div></section>)}</div>;
  return (
    <div ref={chapter} className="constellation-chapter">
      <div className="constellation-sticky">
        <div className="constellation-top"><div><span className="constellation-kicker">An interconnected toolkit</span><p>Explore the tools. Follow the connections.</p></div><div className="constellation-view"><button type="button" aria-pressed={!list} onClick={() => setList(false)}><Move3D size={17}/>Constellation</button><button type="button" aria-pressed={list} onClick={() => {setList(true);setHovered(null);}}><List size={17}/>Accessible list</button></div></div>
        <div className="constellation-categories" role="group" aria-label="Focus a skill category"><button type="button" aria-pressed={!category} onClick={() => {engage();setCategory(null);setResetKey(key => key+1);}}>All connections</button>{graph.clusters.map(cluster => <button type="button" key={cluster.id} aria-pressed={category === cluster.id} onClick={() => {engage();setCategory(cluster.id);}}>{cluster.name}</button>)}</div>
        {list ? <div className="constellation-list">{filtered.map(cluster => <section key={cluster.id}><h3>{cluster.name}</h3><ul>{cluster.nodes.map(node => <li key={node.id}><button type="button" aria-pressed={selected?.id === node.id} aria-controls="skill-information" onClick={event => select(node,event.currentTarget)}><TechnologyLogo skill={node.name} size={23}/>{node.name}<ArrowUpRight size={17}/></button></li>)}</ul></section>)}</div> : large ? <div className="constellation-viewport" role="group" aria-label="Interactive technology constellation. Drag empty space to rotate, or use the category and list controls."><SceneBoundary fallback={cards}>{ready ? <Scene graph={graph} progress={progress} invalidateRef={invalidate} category={category} selected={selected?.id ?? null} hovered={hovered} setHovered={setHovered} onSelect={select} resetKey={resetKey} reduced={reduced || !playing} running={visible && playing && !reduced}/> : <p className="constellation-loading">Scroll to assemble the constellation</p>}</SceneBoundary></div> : cards}
        <div className="constellation-bottom"><p><span className="connection-key category-key"/> Category membership <span className="connection-key project-key"/> Shared documented project</p><div><button type="button" onClick={() => setPlaying(value => !value)} aria-pressed={!playing}>{playing ? <Pause size={16}/> : <Play size={16}/>}Motion {playing ? "on" : "off"}</button><button type="button" onClick={reset}><RotateCcw size={16}/>Reset view</button></div><span>{large && !list ? "Drag to rotate · Select a node" : "Select a technology to explore"}</span></div>
        <aside ref={information} id="skill-information" className="skill-information" aria-labelledby="skill-information-title" onKeyDown={event => {if(event.key === "Escape") close();}}>
          {selected ? <><div className="skill-info-heading"><TechnologyLogo skill={selected.name} size={36}/><div><p className="constellation-kicker">{selected.category}</p><h3 id="skill-information-title">{selected.name}</h3></div><button type="button" aria-label="Close technology details" onClick={close}><X size={21}/></button></div><div className="skill-info-evidence"><p className="constellation-kicker">Documented in my portfolio</p>{relevant.length ? relevant.map(project => <Link key={project.id} href={`/projects/${project.slug}`}><strong>{project.title}<ArrowUpRight size={17}/></strong><span>{project.shortDescription}</span></Link>) : <p>Listed in my toolkit. No documented project association has been added yet.</p>}<TechnologyLink skill={selected.name}/></div></> : <><div><p className="constellation-kicker">A map of what I’m learning</p><h3 id="skill-information-title">Every tool has a context.</h3></div><p>Select a technology to see its category and documented project connections. Node size is a design choice, not a proficiency rating.</p></>}
        </aside>
        <span className="sr-only" aria-live="polite">{selected ? `${selected.name}, ${selected.category}. ${relevant.length ? `${relevant.length} documented project connection.` : "No documented project association yet."}` : "No technology selected."}</span>
      </div>
    </div>
  );
}
