export function Reveal({children,className = ""}: {children: React.ReactNode;className?: string}) {
  return <div data-reveal className={className}>{children}</div>;
}
