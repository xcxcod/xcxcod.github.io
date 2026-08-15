import { adminAuth } from "@/lib/firebase/admin";

export async function verifyAdminToken(idToken?: string) {
  if (!idToken) return false;
  const decoded = await adminAuth().verifyIdToken(idToken);
  if (decoded.admin === true) return true;

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(decoded.email && allowedEmails.includes(decoded.email.toLowerCase()));
}
