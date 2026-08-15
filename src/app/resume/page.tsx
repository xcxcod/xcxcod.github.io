import { ResumeRequestForm } from "@/components/forms/resume-request-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ResumePage() {
  return (
    <section className="section-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHeading eyebrow="// resume_access" title="Request protected resume access">
        The resume is not publicly downloadable. Approved requesters receive a unique, expiring access link that can be revoked by the site owner.
      </SectionHeading>
      <ResumeRequestForm />
    </section>
  );
}
