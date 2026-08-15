import { LockKeyhole } from "lucide-react";
import { verifyResumeAccess } from "@/services/resume-service";

export default async function ResumeAccessPage({ params }: { params: { token: string } }) {
  const access = await verifyResumeAccess(params.token);

  if (!access.ok) {
    return (
      <section className="section-shell py-20 text-center">
        <LockKeyhole className="mx-auto mb-5 text-red-600" size={36} />
        <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight">Resume access unavailable</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{access.reason}</p>
      </section>
    );
  }

  return (
    <section className="section-shell py-20">
      <div className="max-w-3xl border-y border-ink/15 py-10 dark:border-white/15">
        <p className="font-mono text-sm text-accent dark:text-teal-300">{"// resume_access"}</p>
        <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight">Resume access approved</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          This secure link is valid until {access.expiresAt.toLocaleDateString()}. Connect a private PDF source in the admin dashboard to serve the final resume file.
        </p>
      </div>
    </section>
  );
}
