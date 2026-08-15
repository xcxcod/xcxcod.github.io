import { ResumeRequestForm } from "@/components/forms/resume-request-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ResumePage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <SectionHeading eyebrow="Resume access" title="Request protected resume access">
        The resume is not publicly downloadable. Approved requesters receive a unique, expiring access link that can be revoked by the site owner.
      </SectionHeading>
      <ResumeRequestForm />
    </section>
  );
}
