"use server";

import { revalidatePath } from "next/cache";
import { createContactMessage, createResumeRequest } from "@/services/message-service";
import { contactSchema, resumeRequestSchema } from "@/lib/validation";

type ActionState = {
  ok: boolean;
  message: string;
};

function formToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function submitContact(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await createContactMessage(parsed.data);
    revalidatePath("/contact");
    return { ok: true, message: "Thanks. Your message has been submitted." };
  } catch {
    return { ok: false, message: "The message could not be submitted. Check Firebase configuration and try again." };
  }
}

export async function submitResumeRequest(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resumeRequestSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await createResumeRequest(parsed.data);
    revalidatePath("/resume");
    return { ok: true, message: "Your resume access request has been submitted for review." };
  } catch {
    return { ok: false, message: "The request could not be submitted. Check Firebase configuration and try again." };
  }
}
