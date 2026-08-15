import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { contactSchema, resumeRequestSchema, type ContactInput, type ResumeRequestInput } from "@/lib/validation";

export async function createClientContactMessage(input: ContactInput) {
  const parsed = contactSchema.parse(input);
  const doc = await addDoc(collection(db, "contactMessages"), {
    name: parsed.name,
    email: parsed.email,
    organisation: parsed.organisation,
    subject: parsed.subject,
    message: parsed.message,
    read: false,
    archived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return doc.id;
}

export async function createClientResumeRequest(input: ResumeRequestInput) {
  const parsed = resumeRequestSchema.parse(input);
  const doc = await addDoc(collection(db, "resumeRequests"), {
    fullName: parsed.fullName,
    email: parsed.email,
    organisation: parsed.organisation,
    jobTitle: parsed.jobTitle,
    reason: parsed.reason,
    linkedinUrl: parsed.linkedinUrl || "",
    consent: parsed.consent,
    status: "Pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return doc.id;
}
