import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 border-y border-ink/15 p-6 text-slate-600 dark:border-white/15 dark:text-slate-300">
      <Loader2 className="animate-spin" size={18} />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="border-y border-dashed border-ink/20 p-8 text-center dark:border-white/20">
      <p className="text-2xl font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex gap-3 border-y border-red-200 bg-red-50/60 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
      <AlertCircle size={18} />
      <p>{message}</p>
    </div>
  );
}
