import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 rounded-md border border-line bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <Loader2 className="animate-spin" size={18} />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      <AlertCircle size={18} />
      <p>{message}</p>
    </div>
  );
}
