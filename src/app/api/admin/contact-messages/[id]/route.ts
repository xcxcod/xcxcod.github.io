import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/admin";
import { adminDb } from "@/lib/firebase/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const body = (await request.json()) as { read?: boolean; archived?: boolean };

  await adminDb().collection("contactMessages").doc(params.id).update({
    ...body,
    updatedAt: FieldValue.serverTimestamp()
  });

  return NextResponse.json({ ok: true });
}
