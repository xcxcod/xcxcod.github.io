import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-ink text-white shadow-[6px_6px_0_rgba(29,111,143,0.22)] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_rgba(29,111,143,0.28)] dark:bg-white dark:text-slate-950",
  secondary: "border border-ink/20 bg-transparent text-ink hover:border-accent hover:text-accent dark:border-white/25 dark:text-white",
  ghost: "text-slate-700 hover:text-accent dark:text-slate-200"
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn("inline-flex min-h-11 items-center justify-center rounded-sm px-5 text-sm font-semibold uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", variants[variant], className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", ...props }: LinkButtonProps) {
  return <Link className={cn("inline-flex min-h-11 items-center justify-center rounded-sm px-5 text-sm font-semibold uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", variants[variant], className)} {...props} />;
}
