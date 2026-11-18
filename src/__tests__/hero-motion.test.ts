import { describe, expect, it } from "vitest";
import { createHeroMotion, heroPose } from "@/lib/hero-motion";

describe("direct hero scroll pose",()=>{
  it("is deterministic and reverses exactly without a time accumulator",()=>{
    const forward=heroPose(.6);heroPose(1);expect(heroPose(.6)).toEqual(forward);
    expect(heroPose(.2).scale).toBeLessThan(forward.scale);
    expect(heroPose(.6)).toEqual(heroPose(.6));
  });
  it("clamps restored scroll positions and keeps finite transforms",()=>{
    expect(heroPose(-1)).toEqual(heroPose(0));expect(heroPose(2)).toEqual(heroPose(1));
    expect(Object.values(heroPose(.5)).every(Number.isFinite)).toBe(true);
  });
  it("creates independent mutable render channels with a safe unmounted invalidator",()=>{
    const a=createHeroMotion(),b=createHeroMotion();a.progress=.8;
    expect(b.progress).toBe(0);expect(()=>b.invalidate()).not.toThrow();expect(b.enabled).toBe(false);
  });
});
