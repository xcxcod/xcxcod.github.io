"use client";

import { useEffect, useRef, useState } from "react";

export function HeroRover({ paused }: { paused: boolean }) {
  const lane = useRef<HTMLDivElement>(null);
  const motionPaused = useRef(paused);
  const [ready, setReady] = useState(false);
  useEffect(() => { motionPaused.current = paused; }, [paused]);

  useEffect(() => {
    const element = lane.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import("./rover-scene").then(({ mountRover }) => {
      if (!cancelled) dispose = mountRover(element, () => motionPaused.current, () => setReady(true));
    }).catch(() => {});
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return (
    <div className="hero-rover" aria-hidden="true" data-model-ready={ready}>
      <div ref={lane} className="hero-rover-model" />
      <div className="hero-rover-travel">
        <svg className="hero-rover-body" viewBox="0 0 240 126" fill="none">
          <ellipse cx="111" cy="116" rx="91" ry="7" fill="#05080f" opacity=".26" />
          <g transform="translate(14 -8)" opacity=".8">
            {[42, 100, 159].map((x) => <Wheel key={x} x={x} />)}
          </g>
          <g strokeLinejoin="round" strokeLinecap="round">
            <path d="M36 91 68 73 106 92 143 75 169 96" stroke="#263349" strokeWidth="10" />
            <path d="M36 91 68 73 106 92 143 75 169 96" stroke="#8795a9" strokeWidth="4" />
            <path d="m38 62 17-12h95l26 10-18 14H53Z" fill="#e2e9f2" stroke="#4f6076" strokeWidth="2" />
            <path d="m38 62 15 12h105l18-14-5 24-17 8H56L38 79Z" fill="#6f7e93" stroke="#36465c" strokeWidth="2" />
            <path d="M57 74h94v13H57z" fill="#c3ccda" />
            <path d="m54 60 16-7h61l14 6-15 9H66Z" fill="#2d4368" stroke="#91a4be" />
            <path d="m71 53-5 15m19-15-5 15m19-15-5 15m19-15-5 15m18-15-4 15m-61-8h82" stroke="#6683aa" />
            <path d="M62 78h22m-22 4h15m55-4h13m-13 4h13" stroke="#536379" strokeWidth="2" />
            <circle cx="154" cy="76" r="2" fill="#ffd181" />
            <path d="m57 52-8-22m-7 2 15-5" stroke="#8296b5" strokeWidth="3" />
            <path d="M113 54V29l5-6" stroke="#475970" strokeWidth="8" />
            <path d="M113 53V29l5-6" stroke="#c4cfdb" strokeWidth="3" />
            <g className="hero-rover-eye">
              <path d="m104 14 6-5h26l8 6-6 6h-34z" fill="#dbe3ee" stroke="#526680" strokeWidth="2" />
              <rect x="104" y="15" width="35" height="16" rx="3" fill="#27354b" stroke="#8396b2" strokeWidth="2" />
              <g className="hero-rover-lens">
                <circle cx="115" cy="23" r="5" fill="#111c2f" stroke="#a0b5d2" />
                <circle cx="129" cy="23" r="4" fill="#82d8ff" />
                <circle cx="128" cy="22" r="1.5" fill="#e9fbff" />
              </g>
            </g>
            <g className="hero-rover-arm">
              <path d="m167 78 19-27" stroke="#33445c" strokeWidth="9" />
              <path d="m167 78 19-27" stroke="#a1aec0" strokeWidth="4" />
              <g className="hero-rover-elbow">
                <path d="m186 51 25 9 8 12" stroke="#34465f" strokeWidth="8" />
                <path d="m186 51 25 9 8 12" stroke="#bdc8d6" strokeWidth="3" />
                <rect x="213" y="70" width="13" height="8" rx="2" fill="#647892" stroke="#30405a" />
                <path d="m216 78-2 6m9-6 3 5" stroke="#526984" strokeWidth="2" />
              </g>
              <circle cx="186" cy="51" r="4" fill="#536781" stroke="#c6d2e3" />
              <circle cx="167" cy="78" r="5" fill="#536781" stroke="#c6d2e3" />
            </g>
          </g>
          {[42, 100, 159].map((x) => <Wheel key={x} x={x} />)}
        </svg>
      </div>
    </div>
  );
}

function Wheel({ x }: { x: number }) {
  return (
    <g className="hero-rover-wheel">
      <circle cx={x} cy="101" r="15" fill="#202936" stroke="#55657b" strokeWidth="2" />
      <circle cx={x} cy="101" r="13.5" stroke="#8a99ad" strokeWidth="3" strokeDasharray="2 4" />
      <circle cx={x} cy="101" r="8.5" fill="#43546b" stroke="#a1aec0" />
      <path d={`M${x - 6} 101h12m-6-6v12`} stroke="#c4cfdf" strokeWidth="1.5" />
      <circle cx={x} cy="101" r="2.5" fill="#26384f" />
    </g>
  );
}
