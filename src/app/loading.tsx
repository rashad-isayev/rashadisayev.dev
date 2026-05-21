import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-4xl flex-col sm:min-h-[calc(100vh-4rem)]">
        <header className="sticky top-0 z-10 -mx-4 px-4 py-4 text-sm sm:-mx-6 sm:px-6">
          <div className="flex min-h-10 items-center justify-center">
            <div className="loading-shell flex items-center gap-1 rounded-full border border-border/60 bg-surface/35 p-1 shadow-sm backdrop-blur-2xl">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="hidden h-8 w-20 rounded-full sm:block" />
            </div>
          </div>
        </header>

        <section
          aria-busy="true"
          aria-label="Loading page"
          className="flex flex-1 flex-col items-center justify-center pb-8 pt-6 text-center sm:pb-12"
        >
          <div className="loading-avatar relative mb-9">
            <Skeleton className="size-16 rounded-full border border-border bg-surface shadow-[var(--shadow-soft)] ring-4 ring-background sm:size-20" />
            <div className="absolute left-1/2 top-[70%] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-border/80 bg-surface-muted/80 px-4 py-2 shadow-sm backdrop-blur-xl">
              <span className="size-3 rounded-full bg-accent/30" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
          </div>

          <div className="w-full max-w-3xl space-y-7">
            <div className="space-y-3">
              <Skeleton className="loading-step-1 mx-auto h-12 w-full max-w-2xl sm:h-16" />
              <Skeleton className="loading-step-2 mx-auto h-12 w-full max-w-xl sm:h-16" />
              <Skeleton className="loading-step-3 mx-auto h-12 w-full max-w-lg sm:h-16" />
            </div>

            <div className="mx-auto w-full max-w-2xl space-y-3">
              <Skeleton className="loading-step-2 h-5 w-full" />
              <Skeleton className="loading-step-3 mx-auto h-5 w-10/12" />
              <Skeleton className="loading-step-4 mx-auto h-5 w-8/12" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
