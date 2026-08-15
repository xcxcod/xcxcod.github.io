import crypto from "node:crypto";

const TOKEN_BYTES = 32;

export function createResumeToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashResumeToken(token: string, secret = process.env.RESUME_TOKEN_SECRET ?? "") {
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("RESUME_TOKEN_SECRET is required in production.");
  }

  return crypto.createHmac("sha256", secret || "development-secret").update(token).digest("hex");
}

export function getTokenExpiry(days = 14) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

export function isTokenExpired(expiresAt: Date) {
  return expiresAt.getTime() <= Date.now();
}
