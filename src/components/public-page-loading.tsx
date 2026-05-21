import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export function PublicPageLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-5 sm:px-8 sm:py-8">
      <div className="relative z-10 mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-4xl sm:min-h-[calc(100vh-4rem)]">
        <SiteHeader className="loading-shell" />

        <section
          aria-busy="true"
          aria-label="Loading page"
          className="max-w-2xl py-16 sm:py-20"
        >
          <div className="mb-6">
            <Skeleton className="loading-step-1 h-4 w-24 rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="loading-step-1 h-11 w-full max-w-xl sm:h-14" />
            <Skeleton className="loading-step-2 h-11 w-11/12 max-w-lg sm:h-14" />
          </div>

          <div className="mt-7 max-w-2xl space-y-3">
            <Skeleton className="loading-step-2 h-5 w-full" />
            <Skeleton className="loading-step-3 h-5 w-10/12" />
            <Skeleton className="loading-step-4 h-5 w-7/12" />
          </div>

          <Skeleton className="loading-step-4 mt-8 h-4 w-44 rounded-full" />
        </section>
      </div>
    </main>
  );
}
