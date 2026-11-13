import { ResumeRequestForm } from "@/components/forms/resume-request-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ResumePage() {
  return (
    <section className="section-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHeading eyebrow="Resume" title="Request my resume">
        Tell me a little about the opportunity. Approved requests receive an expiring access link.
      </SectionHeading>
      <ResumeRequestForm />
    </section>
  );
}
