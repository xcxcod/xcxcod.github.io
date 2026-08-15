"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { createClientContactMessage } from "@/services/client-message-service";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, setState] = useState({ ok: false, message: "" });
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      try {
        await createClientContactMessage(Object.fromEntries(formData.entries()) as never);
        setState({ ok: true, message: "Thanks. Your message has been submitted." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "The message could not be submitted. Check Firebase configuration and try again.";
        setState({ ok: false, message });
      }
    });
  }

  return (
    <form action={submit} className="grid gap-6 border-y border-ink/15 py-8 dark:border-white/15">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <FormInput label="Name" name="name" autoComplete="name" required />
      <FormInput label="Email" name="email" type="email" autoComplete="email" required />
      <FormInput label="Company or organisation" name="organisation" required />
      <FormInput label="Subject" name="subject" required />
      <FormTextarea label="Message" name="message" required />
      {state.message ? <p className={state.ok ? "text-sm text-evergreen dark:text-teal-300" : "text-sm text-red-700 dark:text-red-300"}>{state.message}</p> : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        <Send size={16} className="mr-2" />
        {pending ? "Submitting..." : "Send message"}
      </Button>
    </form>
  );
}
