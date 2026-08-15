import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <SectionHeading eyebrow="Contact" title="Start a professional conversation">
        Use this form for internship, graduate role, networking, or project-related enquiries. Submissions are validated and stored securely in Firestore.
      </SectionHeading>
      <ContactForm />
    </section>
  );
}
