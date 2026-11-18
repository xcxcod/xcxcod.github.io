import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollPresentation } from "@/components/home/scroll-presentation";

describe("native scroll choreography",() => {
  let animations:Array<{currentTime:number;pause:ReturnType<typeof vi.fn>;play:ReturnType<typeof vi.fn>;cancel:ReturnType<typeof vi.fn>}>;
  let queued:FrameRequestCallback[];
  beforeEach(() => {
    animations = [];queued = [];
    vi.stubGlobal("matchMedia",() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    vi.stubGlobal("ResizeObserver",class {observe(){}disconnect(){}});
    vi.stubGlobal("requestAnimationFrame",(callback:FrameRequestCallback) => {queued.push(callback);return queued.length;});
    vi.stubGlobal("cancelAnimationFrame",vi.fn());
    Object.defineProperty(Element.prototype,"animate",{configurable:true,writable:true,value:vi.fn(() => {
      const animation = {currentTime:0,pause:vi.fn(),play:vi.fn(),cancel:vi.fn()};animations.push(animation);return animation as unknown as Animation;
    })});
    Object.defineProperty(document.documentElement,"scrollHeight",{configurable:true,value:10000});
    vi.spyOn(HTMLElement.prototype,"offsetHeight","get").mockReturnValue(2000);
    Object.defineProperty(window,"scrollY",{configurable:true,value:0,writable:true});
  });
  afterEach(() => {cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
  const fixture = <ScrollPresentation><section data-scroll-stage className="project-sequence"><a className="project-cover" href="/projects">View project</a><div className="project-caption"/></section></ScrollPresentation>;
  it("seeks paused timelines from scroll position and reverses without wall-clock playback",() => {
    render(fixture);
    expect(animations.length).toBeGreaterThan(0);
    const initial = animations[0].currentTime;
    Object.defineProperty(window,"scrollY",{value:200});fireEvent.scroll(window);queued.splice(0).forEach(callback => callback(0));
    expect(animations[0].currentTime).toBeGreaterThan(initial);
    const held = animations[0].currentTime;
    expect(animations[0].play).not.toHaveBeenCalled();expect(animations[0].currentTime).toBe(held);
    Object.defineProperty(window,"scrollY",{value:0});fireEvent.scroll(window);queued.splice(0).forEach(callback => callback(0));
    expect(animations[0].currentTime).toBe(initial);
  });
  it("cancels every timeline and removes pinning when effects are paused",() => {
    const {container} = render(fixture);
    expect(container.firstChild).toHaveAttribute("data-motion","on");
    fireEvent.click(screen.getByRole("button",{name:"Pause scroll effects"}));
    expect(container.firstChild).not.toHaveAttribute("data-motion");
    expect(animations.every(animation => animation.cancel.mock.calls.length === 1)).toBe(true);
  });
  it("leaves reduced-motion content readable without creating animations",() => {
    vi.stubGlobal("matchMedia",(query:string) => ({matches:query.includes("reduced-motion"),addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    const {container} = render(fixture);
    expect(animations).toHaveLength(0);expect(container.firstChild).not.toHaveAttribute("data-motion");
  });
  it("reveals a masked region immediately when its link receives keyboard focus",() => {
    render(<ScrollPresentation><div data-reveal><a href="/about">About my learning</a></div></ScrollPresentation>);
    fireEvent.focus(screen.getByRole("link",{name:"About my learning"}));queued.splice(0).forEach(callback => callback(0));
    expect(animations[0].currentTime).toBe(1000);
  });
});
