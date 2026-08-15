import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntroOverlay } from "@/components/intro/intro-overlay";

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

describe("IntroOverlay", () => {
  beforeEach(() => {
    localStorage.clear();
    mockMotionPreference(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  it("lets first-time visitors skip the intro immediately", async () => {
    const user = userEvent.setup();
    render(<IntroOverlay />);

    const skipButton = await screen.findByRole("button", { name: /skip intro/i });
    await user.click(skipButton);

    expect(localStorage.getItem("portfolio-intro-seen")).toBe("true");
    await waitFor(() => expect(screen.queryByRole("button", { name: /skip intro/i })).not.toBeInTheDocument());
  });

  it("does not render for returning visitors in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    localStorage.setItem("portfolio-intro-seen", "true");
    render(<IntroOverlay />);

    await waitFor(() => expect(screen.queryByRole("button", { name: /skip intro/i })).not.toBeInTheDocument());
  });

  it("still renders for returning visitors in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    localStorage.setItem("portfolio-intro-seen", "true");
    render(<IntroOverlay />);

    expect(await screen.findByRole("button", { name: /skip intro/i })).toBeInTheDocument();
  });
});
