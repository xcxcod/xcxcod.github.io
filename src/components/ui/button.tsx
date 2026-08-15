import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent text-white hover:bg-accent/90",
  secondary: "border border-line bg-white text-ink hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-white",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn("inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", variants[variant], className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", ...props }: LinkButtonProps) {
  return <Link className={cn("inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2", variants[variant], className)} {...props} />;
}
