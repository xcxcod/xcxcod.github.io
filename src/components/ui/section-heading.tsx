export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl reveal-in">
      {eyebrow ? <p className="mb-4 font-mono text-sm text-accent dark:text-teal-300">{eyebrow}</p> : null}
      <h1 className="text-balance text-4xl font-semibold leading-[0.96] tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">{title}</h1>
      {children ? <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{children}</p> : null}
    </div>
  );
}
