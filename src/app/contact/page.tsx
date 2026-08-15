import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  return (
    <section className="section-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHeading eyebrow="// contact" title="Start a professional conversation">
        Use this form for internship, graduate role, networking, or project-related enquiries. Submissions are validated and stored securely in Firestore.
      </SectionHeading>
      <ContactForm />
    </section>
  );
}
