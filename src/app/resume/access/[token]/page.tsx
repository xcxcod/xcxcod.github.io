import { LockKeyhole } from "lucide-react";
import { verifyResumeAccess } from "@/services/resume-service";

export default async function ResumeAccessPage({ params }: { params: { token: string } }) {
  const access = await verifyResumeAccess(params.token);

  if (!access.ok) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <LockKeyhole className="mx-auto mb-5 text-red-600" size={36} />
        <h1 className="text-3xl font-semibold">Resume access unavailable</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{access.reason}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-md border border-line bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">Resume access approved</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          This secure link is valid until {access.expiresAt.toLocaleDateString()}. Connect a private PDF source in the admin dashboard to serve the final resume file.
        </p>
      </div>
    </section>
  );
}
