"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { rocketReturnEvent } from "./portfolio-play";

export function RocketToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);
  const ignition = useRef<number | null>(null);

  useEffect(() => {
    function updateVisibility() {
      const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setVisible(window.scrollY > 64 && remaining <= Math.min(480, window.innerHeight * 0.65));
    }

    setLaunching(false);
    updateVisibility();
    const resize = new ResizeObserver(updateVisibility);
    resize.observe(document.body);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      if (ignition.current !== null) window.clearTimeout(ignition.current);
    };
  }, [pathname]);

  function launch(button: HTMLButtonElement) {
    if (launching) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function returnToTop() {
      ignition.current = null;
      if (document.activeElement === button) {
        document.getElementById("portfolio-main")?.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
      window.dispatchEvent(new Event(rocketReturnEvent));
    }

    if (reducedMotion) {
      returnToTop();
    } else {
      setLaunching(true);
      ignition.current = window.setTimeout(returnToTop, 220);
    }
  }

  return (
    <div className="rocket-dock" data-visible={visible || launching}>
      <button
        type="button"
        className="rocket-button"
        data-launching={launching}
        aria-hidden={!visible && !launching}
        aria-disabled={launching}
        tabIndex={visible && !launching ? 0 : -1}
        onClick={(event) => launch(event.currentTarget)}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && event.animationName === "rocket-launch") setLaunching(false);
        }}
      >
        <Rocket size={20} aria-hidden="true" />
        <span>Go to Top</span>
      </button>
    </div>
  );
}
