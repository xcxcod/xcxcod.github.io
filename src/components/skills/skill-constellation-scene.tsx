"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer, Line, OrbitControls } from "@react-three/drei";
import { Group, MathUtils, OrthographicCamera, Vector3 } from "three";
import type { InterleavedBufferAttribute } from "three";
import type { Line2, OrbitControls as OrbitControlsType } from "three-stdlib";
import { TechnologyLogo } from "./toolkit-section";
import type { buildConstellation, SkillConnection, SkillNode } from "@/lib/skill-constellation";

type Graph = ReturnType<typeof buildConstellation>;
type Props = {
  graph:Graph;progress:MutableRefObject<number>;invalidateRef:MutableRefObject<() => void>;
  category:string|null;selected:string|null;hovered:string|null;resetKey:number;reduced:boolean;running:boolean;
  setHovered:(id:string|null) => void;onSelect:(node:SkillNode,trigger?:HTMLElement) => void;
};
type Positions = MutableRefObject<Record<string,Vector3>>;

function Skill({node,positions,...props}:Props & {node:SkillNode;positions:Positions}) {
  const group = useRef<Group>(null), button = useRef<HTMLButtonElement>(null);
  const start = useMemo(() => new Vector3(...node.scattered),[node]);
  const end = useMemo(() => new Vector3(...node.position),[node]);
  const active = props.hovered === node.id || props.selected === node.id;
  const dimmed = Boolean(props.category && props.category !== node.groupId);
  useFrame(({clock,camera}) => {
    if (!group.current) return;
    const delay = node.index*.035;
    const p = props.reduced ? 1 : MathUtils.clamp((props.progress.current-delay)/(1-delay),0,1);
    const ease = p*p*(3-2*p);
    group.current.position.lerpVectors(start,end,ease);
    if (props.running && p === 1) group.current.position.z += Math.sin(clock.elapsedTime*.5+node.index)*.045;
    group.current.rotation.y = (1-ease)*.65;
    positions.current[node.id] = group.current.position;
    if (button.current) {
      button.current.style.opacity = String(Math.min(1,p*2)*(dimmed ? .22 : 1));
      button.current.style.pointerEvents = p > .6 ? "auto" : "none";
      button.current.tabIndex = p > .6 ? 0 : -1;
      button.current.style.width = `${Math.min(118,Math.max(80,(camera as OrthographicCamera).zoom*2.55))}px`;
    }
  });
  return <group ref={group} position={node.scattered}>
    <mesh rotation={[Math.PI/2,0,Math.PI/6]}>
      <cylinderGeometry args={[.84,.84,.27,6]}/>
      <meshPhysicalMaterial color={active ? "#8faaff" : "#d5e3ff"} roughness={.13} metalness={.1} transmission={.4} thickness={.35} ior={1.4} transparent opacity={dimmed ? .12 : .8} clearcoat={1}/>
    </mesh>
    <Html center position={[0,0,.2]} zIndexRange={[22,10]}>
      <button ref={button} type="button" className={`constellation-node${active ? " is-active" : ""}${props.category === node.groupId ? " is-focused" : ""}`} aria-label={`${node.name}, ${node.category}`} aria-pressed={props.selected === node.id} aria-controls="skill-information"
        onPointerDown={event => event.stopPropagation()} onPointerEnter={() => props.setHovered(node.id)} onPointerLeave={() => props.setHovered(null)} onFocus={() => props.setHovered(node.id)} onBlur={() => props.setHovered(null)} onClick={event => {event.stopPropagation();props.onSelect(node,event.currentTarget);}}>
        <span className="constellation-node-brand"><TechnologyLogo skill={node.name} size={30}/></span><span className="constellation-node-name">{node.name}</span>
      </button>
    </Html>
  </group>;
}

function Connection({edge,positions,...props}:Props & {edge:SkillConnection;positions:Positions}) {
  const line = useRef<Line2>(null);
  const active = props.hovered ?? props.selected;
  const relevant = Boolean(active && (edge.from === active || edge.to === active));
  const dimmed = Boolean(active && !relevant);
  useFrame(() => {
    const from = positions.current[edge.from], to = positions.current[edge.to];
    if (!from || !to || !line.current) return;
    const start = line.current.geometry.attributes.instanceStart as InterleavedBufferAttribute;
    const end = line.current.geometry.attributes.instanceEnd as InterleavedBufferAttribute;
    start.setXYZ(0,from.x,from.y,from.z-.2);end.setXYZ(0,to.x,to.y,to.z-.2);
    start.data.needsUpdate = true;
    line.current.material.opacity = (props.reduced ? 1 : props.progress.current)*(relevant ? .9 : dimmed ? .06 : edge.kind === "project" ? .4 : .3);
  });
  return <Line ref={line} points={[[0,0,0],[0,0,0]]} frustumCulled={false} transparent opacity={0} color={edge.kind === "project" || relevant ? "#294ee8" : "#7b90b7"} lineWidth={relevant ? 1.8 : edge.kind === "project" ? 1.15 : .8} depthWrite={false}/>;
}

function Network(props:Props) {
  const positions = useRef<Record<string,Vector3>>({});
  const controls = useRef<OrbitControlsType>(null);
  const {camera,size,invalidate} = useThree();
  const goal = useRef({position:new Vector3(0,0,24),target:new Vector3(),zoom:40,active:false});
  useEffect(() => {
    props.invalidateRef.current = invalidate;
    return () => {props.invalidateRef.current = () => {};};
  },[invalidate,props.invalidateRef]);
  useEffect(() => {
    props.graph.clusters.forEach(cluster => {positions.current[`hub:${cluster.id}`] = new Vector3(...cluster.position);});
    positions.current.root = new Vector3(0,-2.4,-1.3);
  },[props.graph]);
  useEffect(() => {
    controls.current?.reset();
    const cluster = props.graph.clusters.find(item => item.id === props.category);
    const target = cluster ? new Vector3(cluster.position[0],cluster.position[1]-4,0) : new Vector3(0,-2.4,0);
    goal.current = {target,position:target.clone().add(new Vector3(0,0,24)),zoom:cluster ? Math.min(size.width/11,size.height/9) : Math.min(size.width/28,size.height/20),active:true};
    invalidate();
  },[props.category,props.resetKey,props.graph,size.width,size.height,invalidate]);
  useFrame((_,delta) => {
    const target = goal.current, orbit = controls.current;
    // A restrained establishing camera move while nodes assemble; interaction wins afterwards.
    if (!props.reduced && !props.category && props.progress.current < .99) {
      const p = props.progress.current;
      target.position.set((1-p)*2,-2.4+(1-p)*1.2,24);target.active = true;
    }
    if (!target.active || !orbit) return;
    const ease = props.reduced ? 1 : 1-Math.exp(-Math.min(delta,.05)*5);
    const cam = camera as OrthographicCamera;
    cam.position.lerp(target.position,ease);orbit.target.lerp(target.target,ease);
    cam.zoom = MathUtils.lerp(cam.zoom,target.zoom,ease);cam.updateProjectionMatrix();orbit.update();
    if (cam.position.distanceTo(target.position)<.005 && Math.abs(cam.zoom-target.zoom)<.01) target.active = false;
    else invalidate();
  });
  const hubs:SkillConnection[] = props.graph.clusters.map(cluster => ({from:"root",to:`hub:${cluster.id}`,kind:"category",projectTitles:[]}));
  return <>
    <ambientLight intensity={1.2}/><directionalLight position={[0,6,8]} intensity={2}/>
    {props.graph.nodes.map(node => <Skill key={node.id} node={node} positions={positions} {...props}/>)}
    {[...hubs,...props.graph.connections].map(edge => <Connection key={`${edge.kind}:${edge.from}:${edge.to}`} edge={edge} positions={positions} {...props}/>)}
    {props.graph.clusters.map((cluster,index) => <Html key={cluster.id} center position={cluster.position} zIndexRange={[5,0]} style={{pointerEvents:"none"}}><div className={`constellation-cluster-label${props.category && props.category !== cluster.id ? " is-dimmed" : ""}`}><span>{String(index+1).padStart(2,"0")} /</span>{cluster.name}</div></Html>)}
    <mesh position={[0,-2.4,-1.3]}><octahedronGeometry args={[.12]}/><meshStandardMaterial color="#294ee8" metalness={.2} roughness={.3}/></mesh>
    <OrbitControls ref={controls} enablePan={false} enableZoom={false} enableDamping={!props.reduced} dampingFactor={.08} minPolarAngle={1.1} maxPolarAngle={1.95} minAzimuthAngle={-.45} maxAzimuthAngle={.45} rotateSpeed={.45} onStart={() => {goal.current.active = false;}}/>
    <Environment frames={1} resolution={64}><Lightformer position={[0,6,6]} intensity={3} scale={[15,3,1]}/><Lightformer position={[-10,1,5]} intensity={2} scale={[2,10,1]} color="#94b2ff"/></Environment>
  </>;
}

export default function SkillConstellationScene(props:Props) {
  return <Canvas orthographic camera={{position:[0,0,24],zoom:40,near:.1,far:100}} dpr={[1,1.25]} frameloop={props.running ? "always" : "demand"} gl={{alpha:true,antialias:true,powerPreference:"low-power"}} fallback={<p className="constellation-loading">3D is unavailable on this device. Choose Accessible list above.</p>}>
    <Suspense fallback={null}><Network {...props}/></Suspense>
  </Canvas>;
}
