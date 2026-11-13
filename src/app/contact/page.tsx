import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ContactPage() {
  return (
    <section className="section-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHeading eyebrow="Contact" title="Let’s talk">
        Get in touch about internships, graduate roles or a project you’re working on.
      </SectionHeading>
      <ContactForm />
    </section>
  );
}
