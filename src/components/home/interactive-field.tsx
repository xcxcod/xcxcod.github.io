"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Pause, Play } from "lucide-react";

type Vector = [number, number, number];
const normalise = (v: Vector): Vector => { const length = Math.hypot(...v) || 1; return v.map(n => n / length) as Vector; };
const cross = (a: Vector, b: Vector): Vector => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const centre = (t: number): Vector => [Math.sin(t)+2*Math.sin(2*t), Math.cos(t)-2*Math.cos(2*t), -Math.sin(3*t)];

// Original procedural knot. All geometry is local, with no downloaded model or texture.
function createSculpture() {
  const vertices: Vector[] = [], normals: Vector[] = [], faces: number[][] = [];
  const segments = 180, sides = 32;
  for (let i = 0; i < segments; i++) {
    const t = i / segments * Math.PI * 2;
    const c = centre(t), next = centre(t+.001);
    const tangent = normalise(next.map((n,k) => n-c[k]) as Vector);
    const normal = normalise(cross(tangent,[0,0,1])), binormal = cross(tangent,normal);
    for (let j = 0; j < sides; j++) {
      const angle = j/sides*Math.PI*2;
      const n = normal.map((v,k) => v*Math.cos(angle)+binormal[k]*Math.sin(angle)) as Vector;
      vertices.push(c.map((v,k) => v+n[k]*.46) as Vector); normals.push(n);
      faces.push([i*sides+j, ((i+1)%segments)*sides+j, ((i+1)%segments)*sides+(j+1)%sides, i*sides+(j+1)%sides]);
    }
  }
  return { vertices, normals, faces };
}

export function InteractiveField() {
  const canvas = useRef<HTMLCanvasElement>(null), surface = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const orientation = useRef(.4);
  const [playing,setPlaying] = useState(true);
  useEffect(() => {
    const node = canvas.current, host = surface.current;
    const ctx = node?.getContext("2d",{ alpha: false });
    if (!node || !host || !ctx) return;
    const mesh = createSculpture(), preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches, visible = true, frame = 0, previous = 0, rotation = orientation.current;
    let width = 1, height = 1, px = 0, py = 0;
    const light = normalise([-1,-1,2]);
    function draw(time: number) {
      const context = ctx!;
      const delta = Math.min((time-previous)/1000,.05); previous = time;
      if (playing && !reduced) rotation += delta*.13;
      orientation.current = rotation;
      px += ((reduced ? 0 : pointer.current.x)-px)*.045;
      py += ((reduced ? 0 : pointer.current.y)-py)*.045;
      const ay = rotation+px*.32, ax = -.5+py*.2;
      const transform = ([x,y,z]: Vector): Vector => {
        const a = x*Math.cos(ay)+z*Math.sin(ay), b = -x*Math.sin(ay)+z*Math.cos(ay);
        return [a,y*Math.cos(ax)-b*Math.sin(ax),y*Math.sin(ax)+b*Math.cos(ax)];
      };
      const compact = width < 600;
      const scale = Math.min(width*.13,height*.125);
      const halo = context.createRadialGradient(width*.6,height*.5,0,width*.6,height*.5,width*.65);
      halo.addColorStop(0,"#25304d"); halo.addColorStop(1,"#10121b");
      context.fillStyle = halo; context.fillRect(0,0,width,height);
      const points = mesh.vertices.map(v => { const r = transform(v), p = 13/(13-r[2]); return { x: width*(compact ? .5 : .65)+r[0]*scale*p, y: height*(compact ? .35 : .47)+r[1]*scale*p, z: r[2] }; });
      const normals = mesh.normals.map(transform);
      const sorted = mesh.faces.map(face => ({ face, z: face.reduce((sum,i) => sum+points[i].z,0)/4 })).sort((a,b) => a.z-b.z);
      for (const { face } of sorted) {
        const n = normalise(face.reduce((sum,i) => sum.map((v,k) => v+normals[i][k]) as Vector,[0,0,0] as Vector));
        const diffuse = Math.max(0,n.reduce((sum,v,k) => sum+v*light[k],0));
        const highlight = Math.pow(Math.max(0,n.reduce((sum,v,k) => sum+v*[-.35,-.4,.85][k],0)),22);
        const brightness = .2+diffuse*.72;
        const color = [65,100,240].map(v => Math.min(255,Math.round(v*brightness+highlight*145)));
        context.fillStyle = `rgb(${color.join(",")})`; context.beginPath();
        face.forEach((index,k) => { const p = points[index]; if (!k) context.moveTo(p.x,p.y); else context.lineTo(p.x,p.y); });
        context.closePath(); context.fill();
      }
    }
    function tick(time: number) {
      // A restrained 30fps is enough for this slow sculpture, reducing CPU/battery use.
      if (time-previous >= 32 || !previous || reduced || !playing) draw(time);
      if (visible && !document.hidden && playing && !reduced) frame = requestAnimationFrame(tick); else frame = 0;
    }
    function start() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick); }
    const resize = new ResizeObserver(() => {
      width = host!.clientWidth; height = host!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1,1.5);
      node!.width = Math.round(width*ratio); node!.height = Math.round(height*ratio);
      ctx!.setTransform(ratio,0,0,ratio,0,0); start();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; } });
    function preferences() { reduced = preference.matches; start(); }
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); }
    resize.observe(host); observer.observe(host);
    preference.addEventListener("change",preferences); document.addEventListener("visibilitychange",visibility);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); preference.removeEventListener("change",preferences); document.removeEventListener("visibilitychange",visibility); };
  },[playing]);
  return (
    <div ref={surface} className="studio-field" onPointerMove={event => {
      if (event.pointerType === "touch") return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointer.current = { x: (event.clientX-rect.left)/rect.width*2-1, y: (event.clientY-rect.top)/rect.height*2-1 };
    }} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="field-corner"><span className="live-dot" /> An experiment in connection</div>
      <div className="field-copy"><p>Software. Systems. Possibility.</p><h2>Everything<br />connects.</h2></div>
      <div className="field-bottom"><a href="#selected-work">Explore the work <ArrowDownRight size={20} aria-hidden /></a><button type="button" onClick={() => setPlaying(v => !v)} aria-label={playing ? "Pause sculpture animation" : "Play sculpture animation"} aria-pressed={!playing}>{playing ? <Pause size={16} /> : <Play size={16} />}<span>{playing ? "Motion on" : "Motion off"}</span></button></div>
    </div>
  );
}
