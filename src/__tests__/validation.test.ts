import { describe, expect, it } from "vitest";
import { contactSchema, resumeRequestSchema } from "@/lib/validation";

describe("form validation", () => {
  it("accepts a complete contact message", () => {
    const result = contactSchema.safeParse({
      name: "Requester",
      email: "requester@example.com",
      organisation: "Example Organisation",
      subject: "Internship conversation",
      message: "I would like to discuss a possible internship opportunity.",
      website: ""
    });

    expect(result.success).toBe(true);
  });

  it("rejects short resume reasons and missing consent", () => {
    const result = resumeRequestSchema.safeParse({
      fullName: "Requester",
      email: "requester@example.com",
      organisation: "Example Organisation",
      jobTitle: "Recruiter",
      reason: "Resume",
      consent: false,
      website: ""
    });

    expect(result.success).toBe(false);
  });
});
