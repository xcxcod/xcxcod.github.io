import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { contactSchema, resumeRequestSchema, type ContactInput, type ResumeRequestInput } from "@/lib/validation";

export async function createContactMessage(input: ContactInput) {
  const parsed = contactSchema.parse(input);
  const doc = await adminDb().collection("contactMessages").add({
    name: parsed.name,
    email: parsed.email,
    organisation: parsed.organisation,
    subject: parsed.subject,
    message: parsed.message,
    read: false,
    archived: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return doc.id;
}

export async function createResumeRequest(input: ResumeRequestInput) {
  const parsed = resumeRequestSchema.parse(input);
  const doc = await adminDb().collection("resumeRequests").add({
    fullName: parsed.fullName,
    email: parsed.email,
    organisation: parsed.organisation,
    jobTitle: parsed.jobTitle,
    reason: parsed.reason,
    linkedinUrl: parsed.linkedinUrl || "",
    consent: parsed.consent,
    status: "Pending",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return doc.id;
}
