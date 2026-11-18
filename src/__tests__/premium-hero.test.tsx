import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PremiumHero } from "@/components/home/premium-hero";
import { profile } from "@/lib/sample-data";

vi.mock("gsap",()=>({gsap:{registerPlugin:vi.fn()}}));
vi.mock("gsap/ScrollTrigger",()=>({ScrollTrigger:{getById:vi.fn()}}));
vi.mock("@/components/home/interactive-field",()=>({InteractiveField:()=> <div>Visual fallback</div>}));

afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe("hero accessible static paths",()=>{
  it("keeps identity and a native work link visible with reduced motion",()=>{
    vi.stubGlobal("matchMedia",()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    vi.stubGlobal("ResizeObserver",class{observe(){}disconnect(){}});
    render(<PremiumHero profile={profile}/>);
    expect(screen.getByRole("heading",{level:1})).toHaveTextContent("Turning curiosity");
    expect(screen.getByRole("link",{name:"Discover my work"})).toHaveAttribute("href","#selected-work");
    expect(screen.getByRole("region",{name:"Introduction"})).not.toHaveAttribute("data-hero-motion");
  });
});
