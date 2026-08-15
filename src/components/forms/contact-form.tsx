"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { submitContact } from "@/app/actions";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

const initialState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action] = useFormState(submitContact, initialState);

  return (
    <form action={action} className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <FormInput label="Name" name="name" autoComplete="name" required />
      <FormInput label="Email" name="email" type="email" autoComplete="email" required />
      <FormInput label="Company or organisation" name="organisation" required />
      <FormInput label="Subject" name="subject" required />
      <FormTextarea label="Message" name="message" required />
      {state.message ? <p className={state.ok ? "text-sm text-evergreen dark:text-teal-300" : "text-sm text-red-700 dark:text-red-300"}>{state.message}</p> : null}
      <SubmitButton label="Send message" />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending} className="w-full sm:w-fit">
      <Send size={16} className="mr-2" />
      {status.pending ? "Submitting..." : label}
    </Button>
  );
}
