export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-evergreen dark:text-teal-300">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-ink dark:text-white sm:text-4xl">{title}</h1>
      {children ? <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{children}</p> : null}
    </div>
  );
}
