export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl border-t border-current/20 pt-6">
      {eyebrow ? <p className="editorial-label mb-4 flex items-center gap-3"><span className="connection-marker" aria-hidden />{eyebrow}</p> : null}
      <h1 className="signal-heading text-balance">{title}</h1>
      {children ? <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{children}</p> : null}
    </div>
  );
}
