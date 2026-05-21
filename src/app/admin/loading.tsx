import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading admin page">
      <div className="mb-8">
        <Skeleton className="loading-step-1 mb-3 h-4 w-20 rounded-full" />
        <Skeleton className="loading-step-2 h-9 w-64" />
        <Skeleton className="loading-step-3 mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="loading-step-4 mt-2 h-4 w-8/12 max-w-lg" />
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-border/70 bg-surface/60 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="loading-step-2 h-24 rounded-md" />
            <Skeleton className="loading-step-3 h-24 rounded-md" />
          </div>
          <Skeleton className="loading-step-4 mt-5 h-10 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
