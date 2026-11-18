"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, LoaderCircle, AlertCircle } from "lucide-react";
import { createClientResumeRequest } from "@/services/client-message-service";
import { resumeRequestSchema } from "@/lib/validation";

const fields = [
  { name: "fullName", label: "Full name", autoComplete: "name", maxLength: 80 },
  { name: "email", label: "Professional email address", autoComplete: "email", type: "email", maxLength: 120 },
  { name: "organisation", label: "Company or organisation", autoComplete: "organization", maxLength: 120 },
  { name: "jobTitle", label: "Job title", autoComplete: "organization-title", maxLength: 120 },
  { name: "linkedinUrl", label: "LinkedIn URL", autoComplete: "url", type: "url", optional: true },
  { name: "reason", label: "Reason for requesting the resume", autoComplete: "off", maxLength: 1600 },
] as const;
type FieldName = (typeof fields)[number]["name"] | "consent" | "website";
type Errors = Partial<Record<FieldName, string>>;

export function ResumeRequestForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState("");
  const inFlight = useRef(false);
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => { if (success) confirmation.current?.focus(); }, [success]);

  function validateField(name: FieldName, value: string | boolean) {
    const result = resumeRequestSchema.shape[name].safeParse(value);
    setErrors(previous => ({ ...previous, [name]: result.success ? undefined : result.error.issues[0].message }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = new FormData(event.currentTarget);
    const result = resumeRequestSchema.safeParse({
      ...Object.fromEntries(data.entries()), consent: data.get("consent") === "true",
    });
    setFailure("");
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as FieldName;
        next[field] ??= issue.message;
      }
      setErrors(next);
      const first = event.currentTarget.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setErrors({});
    inFlight.current = true;
    setPending(true);
    try {
      await createClientResumeRequest(result.data);
      setSuccess(true);
    } catch {
      setFailure("Your request couldn’t be submitted. Your details are still here — please try again.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (success) return (
    <div className="resume-confirmation" ref={confirmation} tabIndex={-1} role="status">
      <span className="resume-confirmation-icon"><Check size={28} aria-hidden="true" /></span>
      <p className="resume-eyebrow">Introduction received</p>
      <h2>Thank you for<br />reaching out.</h2>
      <p>Your resume access request has been submitted for review. Submission does not grant immediate access.</p>
      <a className="resume-submit" href="/projects/">Explore my work <ArrowUpRight size={19} aria-hidden="true" /></a>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate aria-busy={pending} className="resume-form">
      <div className="resume-form-heading"><h2>A little about you</h2><p>Fields marked <span aria-hidden="true">*</span> are required.</p></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {Object.values(errors).some(Boolean) && <p className="resume-feedback" role="alert"><AlertCircle size={17} aria-hidden="true" />Please check the highlighted fields below.</p>}
      <fieldset className="resume-fields"><legend className="sr-only">Your professional details</legend>
        {fields.map(field => {
          const optional = "optional" in field && field.optional;
          const id = `resume-${field.name}`;
          const error = errors[field.name];
          const hint = field.name === "reason" ? "A brief introduction to the opportunity. 20–1,600 characters." : undefined;
          const shared = {
            id, name: field.name, required: !optional, autoComplete: field.autoComplete,
            maxLength: "maxLength" in field ? field.maxLength : undefined,
            "aria-invalid": !!error,
            "aria-describedby": [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined,
            onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => validateField(field.name, event.target.value),
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (error) validateField(field.name, event.target.value); },
          };
          return <div className={`resume-field ${field.name === "linkedinUrl" || field.name === "reason" ? "resume-field-wide" : ""}`} key={field.name}>
            <label htmlFor={id}>{field.label}{optional ? <span className="resume-optional">Optional</span> : <span className="resume-required" aria-hidden="true">*</span>}</label>
            {field.name === "reason" ? <textarea {...shared} rows={4} /> : <input {...shared} type={"type" in field ? field.type : "text"} spellCheck={!("type" in field)} />}
            {hint && <p id={`${id}-hint`} className="resume-field-hint">{hint}</p>}
            {error && <p id={`${id}-error`} className="resume-field-error">{error}</p>}
          </div>;
        })}
        <div className="resume-field-wide resume-consent-wrap">
          <label className="resume-consent" htmlFor="resume-consent"><input id="resume-consent" type="checkbox" name="consent" value="true" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "resume-consent-error" : undefined} onChange={event => validateField("consent", event.target.checked)} /><span>I consent to this information being stored for the purpose of reviewing my resume access request.</span></label>
          {errors.consent && <p id="resume-consent-error" className="resume-field-error">{errors.consent}</p>}
        </div>
      </fieldset>
      {failure && <p className="resume-feedback" role="alert"><AlertCircle size={19} aria-hidden="true" />{failure}</p>}
      <button type="submit" className="resume-submit" disabled={pending}>{pending ? <><LoaderCircle className="resume-spinner" size={19} aria-hidden="true" />Submitting request…</> : <>Request resume access <ArrowRight size={19} aria-hidden="true" /></>}</button>
      <p className="resume-submit-note" role={pending ? "status" : undefined}>{pending ? "Sending your details for review. Please keep this page open." : "A personal introduction. A considered review."}</p>
    </form>
  );
}
