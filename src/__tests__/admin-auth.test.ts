import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/admin", () => ({
  adminAuth: () => ({
    verifyIdToken: async (token: string) => ({
      admin: token === "admin-token",
      email: token === "email-token" ? "owner@example.com" : "other@example.com"
    })
  })
}));

describe("admin token verification", () => {
  it("accepts custom admin claims", async () => {
    const { verifyAdminToken } = await import("@/lib/auth/admin");
    await expect(verifyAdminToken("admin-token")).resolves.toBe(true);
  });

  it("accepts configured admin email fallback", async () => {
    vi.stubEnv("ADMIN_EMAILS", "owner@example.com");
    const { verifyAdminToken } = await import("@/lib/auth/admin");
    await expect(verifyAdminToken("email-token")).resolves.toBe(true);
  });
});
