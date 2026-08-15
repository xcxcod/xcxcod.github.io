import { FieldValue } from "firebase-admin/firestore";
import { createResumeToken, getTokenExpiry, hashResumeToken, isTokenExpired } from "@/lib/resume-token";
import { adminDb } from "@/lib/firebase/admin";

export async function approveResumeRequest(requestId: string, days = 14) {
  const token = createResumeToken();
  const tokenHash = hashResumeToken(token);
  const expiresAt = getTokenExpiry(days);
  const db = adminDb();
  const tokenRef = db.collection("resumeAccessTokens").doc();
  const requestRef = db.collection("resumeRequests").doc(requestId);

  await db.runTransaction(async (transaction) => {
    const request = await transaction.get(requestRef);
    if (!request.exists) throw new Error("Resume request not found.");

    transaction.set(tokenRef, {
      requestId,
      tokenHash,
      expiresAt,
      revoked: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    transaction.update(requestRef, {
      status: "Approved",
      approvedAt: FieldValue.serverTimestamp(),
      expiresAt,
      accessTokenId: tokenRef.id,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return { token, tokenId: tokenRef.id, expiresAt };
}

export async function revokeResumeAccess(requestId: string) {
  const db = adminDb();
  const requestRef = db.collection("resumeRequests").doc(requestId);
  const request = await requestRef.get();
  const tokenId = request.data()?.accessTokenId as string | undefined;

  await requestRef.update({ status: "Expired", updatedAt: FieldValue.serverTimestamp() });
  if (tokenId) {
    await db.collection("resumeAccessTokens").doc(tokenId).update({
      revoked: true,
      revokedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }
}

export async function verifyResumeAccess(token: string) {
  const tokenHash = hashResumeToken(token);
  const snapshot = await adminDb()
    .collection("resumeAccessTokens")
    .where("tokenHash", "==", tokenHash)
    .where("revoked", "==", false)
    .limit(1)
    .get();

  if (snapshot.empty) return { ok: false as const, reason: "Invalid or revoked access link." };

  const record = snapshot.docs[0].data();
  const expiresAt = record.expiresAt.toDate() as Date;
  if (isTokenExpired(expiresAt)) return { ok: false as const, reason: "This resume access link has expired." };

  return { ok: true as const, requestId: record.requestId as string, expiresAt };
}
