import { describe, expect, it } from "vitest";
import { scrollProgress } from "@/lib/scroll-progress";

describe("scroll-linked reveal progress",() => {
  it("keeps distant content unrevealed and finishes only after its scroll interval",() => {
    expect(scrollProgress(50,100,500)).toBe(0);
    expect(scrollProgress(300,100,500)).toBe(.5);
    expect(scrollProgress(600,100,500)).toBe(1);
  });
  it("reverses when scrolling upward",() => {
    expect(scrollProgress(200,100,500)).toBeLessThan(scrollProgress(300,100,500));
  });
  it("handles a zero-length interval without invalid animation values",() => {
    expect(scrollProgress(10,20,20)).toBe(0);
    expect(scrollProgress(20,20,20)).toBe(1);
  });
});
