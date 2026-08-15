import { describe, expect, it } from "vitest";
import { createResumeToken, getTokenExpiry, hashResumeToken, isTokenExpired } from "@/lib/resume-token";

describe("resume token utilities", () => {
  it("creates non-predictable token hashes", () => {
    const token = createResumeToken();
    const hash = hashResumeToken(token, "test-secret");

    expect(token).not.toEqual(hash);
    expect(hash).toHaveLength(64);
  });

  it("detects expired links", () => {
    const expiry = getTokenExpiry(-1);
    expect(isTokenExpired(expiry)).toBe(true);
  });
});
