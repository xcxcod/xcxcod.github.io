"use client";

import { useState, useTransition } from "react";
import { LockKeyhole } from "lucide-react";
import { createClientResumeRequest } from "@/services/client-message-service";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/ui/form-input";

export function ResumeRequestForm() {
  const [state, setState] = useState({ ok: false, message: "" });
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      try {
        await createClientResumeRequest(Object.fromEntries(formData.entries()) as never);
        setState({ ok: true, message: "Your resume access request has been submitted for review." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "The request could not be submitted. Check Firebase configuration and try again.";
        setState({ ok: false, message });
      }
    });
  }

  return (
    <form action={submit} className="grid gap-6 border-y border-ink/15 py-8 dark:border-white/15">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <FormInput label="Full name" name="fullName" autoComplete="name" required />
      <FormInput label="Professional email address" name="email" type="email" autoComplete="email" required />
      <FormInput label="Company or organisation" name="organisation" required />
      <FormInput label="Job title" name="jobTitle" required />
      <FormInput label="LinkedIn URL (optional)" name="linkedinUrl" type="url" placeholder="https://www.linkedin.com/in/..." />
      <FormTextarea label="Reason for requesting the resume" name="reason" required />
      <label className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <input type="checkbox" name="consent" value="true" required className="mt-1 h-4 w-4 border-line text-accent focus:ring-accent" />
        I consent to this information being stored for the purpose of reviewing my resume access request.
      </label>
      {state.message ? <p className={state.ok ? "text-sm text-evergreen dark:text-teal-300" : "text-sm text-red-700 dark:text-red-300"}>{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        <LockKeyhole size={16} className="mr-2" />
        {pending ? "Submitting..." : "Request access"}
      </Button>
    </form>
  );
}
