import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/admin";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const db = adminDb();
  const [projects, featured, pending, contacts] = await Promise.all([
    db.collection("projects").count().get(),
    db.collection("projects").where("featured", "==", true).count().get(),
    db.collection("resumeRequests").where("status", "==", "Pending").count().get(),
    db.collection("contactMessages").where("archived", "==", false).count().get()
  ]);

  return NextResponse.json({
    projects: projects.data().count,
    featuredProjects: featured.data().count,
    pendingResumeRequests: pending.data().count,
    contactMessages: contacts.data().count
  });
}
