import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  label: string;
};

export function FormInput({ label, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
      {label}
      <input className={cn("min-h-12 border-0 border-b border-ink/25 bg-transparent px-0 text-base normal-case tracking-normal text-ink outline-none transition placeholder:text-slate-400 focus:border-accent dark:border-white/25 dark:text-white", className)} {...props} />
    </label>
  );
}

type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
};

export function FormTextarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
      {label}
      <textarea className={cn("min-h-36 border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base normal-case tracking-normal text-ink outline-none transition placeholder:text-slate-400 focus:border-accent dark:border-white/25 dark:text-white", className)} {...props} />
    </label>
  );
}
