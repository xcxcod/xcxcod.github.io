import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/admin";
import { adminDb } from "@/lib/firebase/admin";
import { approveResumeRequest, revokeResumeAccess } from "@/services/resume-service";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = (await request.json()) as { action?: "approve" | "reject" | "revoke" };

  if (body.action === "approve") {
    const result = await approveResumeRequest(params.id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    return NextResponse.json({
      accessUrl: `${siteUrl}/resume/access/${result.token}`,
      expiresAt: result.expiresAt
    });
  }

  if (body.action === "reject") {
    await adminDb().collection("resumeRequests").doc(params.id).update({
      status: "Rejected",
      updatedAt: FieldValue.serverTimestamp()
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "revoke") {
    await revokeResumeAccess(params.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
