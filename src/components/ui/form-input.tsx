import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  label: string;
};

export function FormInput({ label, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      <input className={cn("min-h-11 rounded-md border border-line bg-white px-3 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white", className)} {...props} />
    </label>
  );
}

type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
};

export function FormTextarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      <textarea className={cn("min-h-36 rounded-md border border-line bg-white px-3 py-3 text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white", className)} {...props} />
    </label>
  );
}
