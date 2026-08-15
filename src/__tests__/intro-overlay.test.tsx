import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntroOverlay } from "@/components/intro/intro-overlay";

type MockContext = {
  canvas?: HTMLCanvasElement;
  arc: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  createLinearGradient: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  ellipse: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  getImageData: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  quadraticCurveTo: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  setLineDash: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
};

function mockMotionPreference(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function createMockContext(cleared = false): MockContext {
  const gradient = { addColorStop: vi.fn() };
  const data = new Uint8ClampedArray(96 * 96 * 4);

  for (let index = 3; index < data.length; index += 4) {
    data[index] = cleared ? 0 : 255;
  }

  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    drawImage: vi.fn(),
    ellipse: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({ data })),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn()
  };
}

function mockCanvas(cleared = false) {
  const context = createMockContext(cleared);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
    bottom: 720,
    height: 720,
    left: 0,
    right: 1024,
    top: 0,
    width: 1024,
    x: 0,
    y: 0,
    toJSON: () => ({})
  });
}

function dispatchPointer(canvas: HTMLCanvasElement, type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: x },
    clientY: { value: y },
    pointerId: { value: 1 },
    pointerType: { value: "mouse" }
  });
  fireEvent(canvas, event);
}

describe("IntroOverlay", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMotionPreference(false);
    mockCanvas(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  it("lets first-time visitors enter immediately", async () => {
    const user = userEvent.setup();
    render(<IntroOverlay />);

    const enterButton = await screen.findByRole("button", { name: /enter without scratching/i });
    await user.click(enterButton);

    expect(localStorage.getItem("portfolio-intro-seen")).toBeNull();
    await waitFor(() => expect(screen.queryByRole("button", { name: /enter without scratching/i })).not.toBeInTheDocument());
  });

  it("renders for returning visitors in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    localStorage.setItem("portfolio-intro-seen", "true");
    render(<IntroOverlay />);

    expect(await screen.findByRole("button", { name: /enter without scratching/i })).toBeInTheDocument();
  });

  it("still renders for returning visitors in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    localStorage.setItem("portfolio-intro-seen", "true");
    render(<IntroOverlay />);

    expect(await screen.findByRole("button", { name: /enter without scratching/i })).toBeInTheDocument();
  });

  it("completes the intro after enough of the cover is scratched", async () => {
    mockCanvas(true);
    render(<IntroOverlay />);

    const canvas = await screen.findByLabelText("Portfolio scratch intro").then((overlay) => overlay.querySelector("canvas"));
    expect(canvas).toBeInTheDocument();

    dispatchPointer(canvas as HTMLCanvasElement, "pointerdown", 120, 120);
    dispatchPointer(canvas as HTMLCanvasElement, "pointermove", 220, 180);

    await waitFor(() => expect(screen.queryByRole("button", { name: /enter without scratching/i })).not.toBeInTheDocument());
  });

  it("does not scratch from passive mouse movement", async () => {
    mockCanvas(true);
    render(<IntroOverlay />);

    const canvas = await screen.findByLabelText("Portfolio scratch intro").then((overlay) => overlay.querySelector("canvas"));
    expect(canvas).toBeInTheDocument();

    dispatchPointer(canvas as HTMLCanvasElement, "pointermove", 180, 160);

    expect(localStorage.getItem("portfolio-intro-seen")).toBeNull();
  });
});
