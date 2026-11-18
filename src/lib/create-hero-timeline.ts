import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MutableRefObject } from "react";
import type { HeroMotionState } from "./hero-motion";

/** Loaded only for the desktop motion path. The context owns every hero transform. */
export function createHeroTimeline(host:HTMLElement,motion:MutableRefObject<HeroMotionState>) {
    gsap.registerPlugin(ScrollTrigger);
    let context:gsap.Context|null = null;
    let animation:gsap.core.Timeline|null = null;
    let resizeFrame = 0, disposed = false, openingPlayed = false;
    const desktop = matchMedia("(min-width: 901px) and (min-height: 650px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function clear() {
      context?.revert();context = null;animation = null;
      motion.current.enabled = false;motion.current.progress = 0;motion.current.invalidate();
      delete host!.dataset.heroMotion;
      host!.querySelectorAll<HTMLAnchorElement>(".hero-heading a").forEach(link => link.removeAttribute("tabindex"));
    }
    function setup() {
      clear();
      const enabled = !reduced.matches && host!.closest<HTMLElement>(".scroll-presentation")?.dataset.motion === "on";
      if (!enabled) return;
      // A wide but short laptop window also gets the unpinned flow.
      if (!desktop.matches) return;
      host!.dataset.heroMotion = "on";
      motion.current.enabled = true;
      context = gsap.context(() => {
        const select = gsap.utils.selector(host);
        const heading = host!.querySelector<HTMLElement>(".hero-heading")!;
        const visual = select(".hero-visual-wrap");
        const bridge = select(".hero-bridge");
        gsap.set(visual,{transformOrigin:"50% 100%"});
        gsap.set(select(".scene-meter span"),{scaleX:0});
        const headingLinks=Array.from(host!.querySelectorAll<HTMLAnchorElement>(".hero-heading a"));
        gsap.set(bridge,{opacity:0,y:28});
        gsap.set(select(".hero-bridge-line > span"),{yPercent:108});
        const timeline = gsap.timeline({defaults:{ease:"none"},scrollTrigger:{
          id:"portfolio-hero",trigger:host,start:"top top",end:() => `+=${Math.max(1,host!.offsetHeight-innerHeight)}`,
          scrub:true,invalidateOnRefresh:true,
          onUpdate:self => {
            motion.current.progress = self.progress;motion.current.invalidate();
            // Only change focusability when crossing the visual visibility boundary.
            const hidden = self.progress>.3;
            headingLinks.forEach(link => {
              if (hidden && link.tabIndex !== -1) link.tabIndex = -1;
              else if (!hidden && link.tabIndex === -1) link.removeAttribute("tabindex");
            });
          },
        }});
        animation = timeline;
        timeline.addLabel("opening",0)
          .to(heading,{y:-48,scale:.95,opacity:0,duration:.3},0)
          .to(visual,{y:() => -heading.offsetHeight*.73,scale:1.065,duration:.48},0)
          .to(select(".field-copy"),{opacity:0,y:-22,duration:.3},.08)
          .addLabel("perspective",.3)
          .to(bridge,{opacity:1,y:0,duration:.18},.3)
          .to(select(".hero-bridge-line > span"),{yPercent:0,stagger:.065,duration:.25},.33)
          .to(select(".scene-meter span"),{scaleX:1,transformOrigin:"left",duration:1},0)
          .addLabel("handoff",.78);
        // First load only: scroll seeks do not restart entrance animation.
        if (!openingPlayed && document.body.dataset.introState !== "playing" && scrollY < host!.offsetTop+20) {
          openingPlayed = true;
          gsap.fromTo(select(".hero-line > span"),{yPercent:105},{yPercent:0,duration:.65,stagger:.07,ease:"power3.out",clearProps:"transform"});
        }
        motion.current.progress = timeline.scrollTrigger?.progress ?? 0;
        motion.current.invalidate();
      },host!);
      ScrollTrigger.refresh();
    }
    function schedule() {if (!resizeFrame) resizeFrame=requestAnimationFrame(() => {resizeFrame=0;if (!disposed) ScrollTrigger.getById("portfolio-hero")?.refresh();});}
    function focus(event:FocusEvent) {
      if (event.target instanceof Node && host!.querySelector(".hero-heading")?.contains(event.target) && (animation?.scrollTrigger?.progress ?? 0)>.3) {
        window.scrollTo({top:animation!.scrollTrigger!.start,behavior:"instant"});
      }
    }
    // The existing page coordinator owns only lower sections and the global pause setting.
    const observer = new MutationObserver(records => {if(records.some(record => record.attributeName === "data-motion")) setup();});
    const parent = host.closest(".scroll-presentation");if (parent) observer.observe(parent,{attributes:true,attributeFilter:["data-motion"]});
    const size = new ResizeObserver(schedule);size.observe(host);
    setup();desktop.addEventListener("change",setup);reduced.addEventListener("change",setup);
    host.addEventListener("focusin",focus);window.addEventListener("portfolio:intro-complete",setup);
    document.fonts?.ready.then(() => {if(!disposed) schedule();});
    return () => {disposed=true;cancelAnimationFrame(resizeFrame);size.disconnect();observer.disconnect();desktop.removeEventListener("change",setup);reduced.removeEventListener("change",setup);host.removeEventListener("focusin",focus);window.removeEventListener("portfolio:intro-complete",setup);clear();};
}
