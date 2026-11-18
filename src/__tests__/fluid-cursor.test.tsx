import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FluidCursor } from "@/components/layout/fluid-cursor";

const mocks = vi.hoisted(() => ({
  create: vi.fn(), splat:vi.fn(), render:vi.fn(), clear:vi.fn(), resize:vi.fn(), dispose:vi.fn()
}));
vi.mock("@/lib/graphics/fluid-renderer",() => ({createFluidRenderer:mocks.create}));

describe("Fluid cursor accessibility and lifecycle",() => {
  let reduced: boolean;
  let fine: boolean;
  let callbacks: FrameRequestCallback[];
  beforeEach(() => {
    vi.clearAllMocks(); reduced = false; fine = true; callbacks = [];
    mocks.create.mockReturnValue(mocks);
    vi.stubGlobal("matchMedia",(query: string) => ({matches:query.includes("reduced") ? reduced : fine,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    vi.stubGlobal("requestAnimationFrame",(callback: FrameRequestCallback) => {callbacks.push(callback); return callbacks.length;});
    vi.stubGlobal("cancelAnimationFrame",vi.fn());
  });
  afterEach(() => {cleanup(); vi.unstubAllGlobals();});
  it("avoids creating a GPU renderer for reduced motion and touch devices",() => {
    reduced = true;
    const first = render(<FluidCursor />); first.unmount();
    reduced = false; fine = false;
    render(<FluidCursor />);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("seeds the first pointer position and injects subsequent movement with inverted Y",() => {
    const view = render(<FluidCursor />);
    const move = (x: number,y: number) => {
      const event = new Event("pointermove");
      Object.assign(event,{pointerType:"mouse",clientX:x,clientY:y});
      window.dispatchEvent(event);
    };
    act(() => {move(100,100);});
    expect(callbacks).toHaveLength(0);
    act(() => {move(130,120); callbacks[0](performance.now());});
    expect(mocks.splat).toHaveBeenCalledWith(130/innerWidth,1-120/innerHeight,30,-20);
    view.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });
  it("keeps the native pointer usable if WebGL is unavailable",() => {
    mocks.create.mockReturnValue(null);
    const {container} = render(<FluidCursor />);
    expect(container.querySelector("canvas")).toHaveAttribute("hidden");
    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden","true");
  });
});
