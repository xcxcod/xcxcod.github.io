"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { resumeRequestSchema } from "@/lib/validation";

const source = "https://github.com/xcxcod/xcxcod.github.io/blob/c5a5db2/src";
const sample = {
  fullName: "Alex Example",
  email: "alex@example.com",
  organisation: "Example Studio",
  jobTitle: "Recruiter",
  reason: "Review a resume for an internship opportunity.",
  consent: true
};
const steps = [
  { title: "Form", file: "components/forms/resume-request-form.tsx" },
  { title: "Validation", file: "lib/validation.ts" },
  { title: "Pending record", file: "services/client-message-service.ts" }
] as const;

export function ResumeWalkthrough() {
  const [step, setStep] = useState(0);
  const result = resumeRequestSchema.safeParse(sample);
  const finalStep = step === steps.length - 1;

  return (
    <div className="trace-content">
      <h3>Follow a résumé request</h3>
      <p className="text-sm">Simulation with sample data. Nothing is sent or stored.</p>
      <ol className="resume-trace-steps" aria-label="Request stages">
        {steps.map(({ title }, index) => (
          <li key={title} data-reached={index <= step} aria-current={index === step ? "step" : undefined}>{title}</li>
        ))}
      </ol>
      <div role="status" className="min-h-20">
        {step === 0 && <p>{sample.fullName}, a recruiter at {sample.organisation}, requests a résumé for an internship review.</p>}
        {step === 1 && <p>{result.success ? "The sample passed validation. The email, reason and consent meet the form requirements." : "The sample did not pass validation."}</p>}
        {finalStep && result.success && (
          <pre className="overflow-x-auto border border-current/20 p-3 text-sm">{JSON.stringify({ collection: "resumeRequests", status: "Pending" }, null, 2)}</pre>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="button" className="editorial-action" disabled={step === 1 && !result.success} onClick={() => setStep(finalStep ? 0 : step + 1)}>
          {finalStep ? <>Replay <RotateCcw size={16} aria-hidden /></> : <>{step === 0 ? "Validate sample" : "Preview record"} <ArrowRight size={16} aria-hidden /></>}
        </button>
        <a className="editorial-link" href={`${source}/${steps[step].file}`}>View source <ArrowUpRight size={16} aria-hidden /></a>
      </div>
    </div>
  );
}
