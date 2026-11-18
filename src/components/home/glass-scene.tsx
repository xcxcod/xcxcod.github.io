"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, useTexture } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";
import { heroPose } from "@/lib/hero-motion";
import type { HeroMotionState } from "@/lib/hero-motion";
import portfolio from "../../../public/images/portfolio-current.jpg";

type Props={pointer:MutableRefObject<{x:number;y:number;active:boolean}>;motion:MutableRefObject<HeroMotionState>;running:boolean};
function Composition({pointer,motion,running}:Props) {
  const lens=useRef<Mesh>(null),backdrop=useRef<Group>(null);
  const {viewport,invalidate}=useThree();
  const original=useTexture(portfolio.src);
  const interfaceTexture=useMemo(()=>{const texture=original.clone();texture.repeat.set(1,.36);texture.offset.set(0,.64);texture.needsUpdate=true;return texture;},[original]);
  useEffect(()=>()=>interfaceTexture.dispose(),[interfaceTexture]);
  useEffect(()=>{const state=motion.current;state.invalidate=()=>{if(running&&!document.hidden)invalidate();};invalidate();return()=>{state.invalidate=()=>{};};},[invalidate,motion,running]);
  useFrame((_,delta)=>{
    const pose=heroPose(motion.current.enabled ? motion.current.progress : 0);
    if(backdrop.current){
      // Scroll pose is exact. Only pointer offset uses brief damping.
      backdrop.current.rotation.set(0,pose.rotationY,pose.rotationZ);
      backdrop.current.position.y=pose.y;backdrop.current.scale.setScalar(pose.scale);
    }
    if(!lens.current)return;
    const targetX=pointer.current.active&&running ? pointer.current.x*.8 : 0;
    const targetY=pointer.current.active&&running ? pointer.current.y*.55 : 0;
    const ease=running ? 1-Math.exp(-Math.min(delta,.05)*20) : 1;
    const pointerX=MathUtils.lerp(lens.current.userData.pointerX??0,targetX,ease);
    const pointerY=MathUtils.lerp(lens.current.userData.pointerY??0,targetY,ease);
    lens.current.userData.pointerX=pointerX;lens.current.userData.pointerY=pointerY;
    const limitX=Math.max(0,viewport.width/2-1.3),limitY=Math.max(0,viewport.height/2-1.3);
    lens.current.position.set(MathUtils.clamp(pose.lensX*viewport.width*.42+pointerX,-limitX,limitX),MathUtils.clamp(pointerY,-limitY,limitY),1.2);
    lens.current.rotation.set(-pointerY*.12,pointerX*.12,0);
    if(running&&(Math.abs(pointerX-targetX)>.001||Math.abs(pointerY-targetY)>.001))invalidate();
  });
  const cardWidth=Math.min(viewport.width*.45,5.8),cardHeight=cardWidth*(portfolio.height*.36/portfolio.width),cardX=viewport.width*.19;
  return <>
    <color attach="background" args={["#101521"]}/><ambientLight intensity={.8}/>
    <group ref={backdrop} position={[0,0,-1]}>
      <RoundedBox args={[cardWidth+.16,cardHeight+.16,.08]} radius={.08} position={[cardX,0,0]} rotation={[0,-.09,.025]} smoothness={2}>
        <meshStandardMaterial color="#8a9fc9" roughness={.45} metalness={.2}/>
        <mesh position={[0,0,.051]}><planeGeometry args={[cardWidth,cardHeight]}/><meshBasicMaterial map={interfaceTexture} toneMapped={false}/></mesh>
      </RoundedBox>
      <mesh position={[cardX+.5,-.1,-.5]} rotation={[0,0,-.15]}><planeGeometry args={[cardWidth+1,cardHeight+.8]}/><meshBasicMaterial color="#233455"/></mesh>
      <mesh position={[cardX-1,.4,-.8]} rotation={[0,0,.13]}><planeGeometry args={[cardWidth+.4,cardHeight+.7]}/><meshBasicMaterial color="#18253d"/></mesh>
    </group>
    <mesh ref={lens} position={[viewport.width*.16,0,1.2]} scale={[1.3,1.3,.42]}>
      <sphereGeometry args={[1,48,32]}/>
      <MeshTransmissionMaterial samples={3} resolution={256} transmission={1} thickness={.9} ior={1.2} roughness={.02} chromaticAberration={.012} anisotropicBlur={0} distortion={0} temporalDistortion={0} color="#ffffff"/>
    </mesh>
    <Environment resolution={64} frames={1}><Lightformer intensity={4} position={[0,5,3]} scale={[8,2,1]} color="white"/><Lightformer intensity={2} position={[-5,0,2]} rotation={[0,Math.PI/2,0]} scale={[2,8,1]} color="#d5e4ff"/><Lightformer intensity={3} position={[5,1,0]} rotation={[0,-Math.PI/2,0]} scale={[1,7,1]} color="white"/></Environment>
  </>;
}
export default function GlassScene(props:Props) {
  return <div className="glass-canvas" aria-hidden="true"><Canvas orthographic camera={{position:[0,0,10],zoom:85,near:.1,far:50}} dpr={1} frameloop="demand" resize={{scroll:false,offsetSize:true,debounce:{resize:120,scroll:0}}} gl={{antialias:true,alpha:false,powerPreference:"low-power"}} fallback={<span/>}><Suspense fallback={null}><Composition {...props}/></Suspense></Canvas></div>;
}
