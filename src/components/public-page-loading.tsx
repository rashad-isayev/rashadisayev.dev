import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

function PublicLoadingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5 sm:px-8 sm:pt-8">
      <div className="relative z-10 mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-4xl sm:min-h-[calc(100vh-4rem)]">
        <SiteHeader className="loading-shell" />
        {children}
      </div>
    </main>
  );
}

export function PublicHeroLoading() {
  return (
    <PublicLoadingShell>
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
    </PublicLoadingShell>
  );
}

export function ContactPageLoading() {
  return (
    <PublicLoadingShell>
      <section
        aria-busy="true"
        aria-label="Loading contact"
        className="max-w-2xl py-16 sm:py-20"
      >
        <div className="space-y-3">
          <Skeleton className="loading-step-1 h-11 w-full max-w-xl sm:h-14" />
          <Skeleton className="loading-step-2 h-11 w-10/12 max-w-lg sm:h-14" />
        </div>
        <div className="mt-7 max-w-2xl space-y-3">
          <Skeleton className="loading-step-2 h-5 w-full" />
          <Skeleton className="loading-step-3 h-5 w-10/12" />
        </div>
        <div className="loading-step-4 mt-8 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
          <Skeleton className="h-10 w-full rounded-md sm:w-24" />
        </div>
      </section>

      <section className="grid gap-3 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border/70 bg-surface/55 p-5"
          >
            <div className="flex h-full flex-col">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <div className="mt-4 min-w-0 flex-1">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-10/12" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </PublicLoadingShell>
  );
}

export function BlogIndexLoading() {
  return (
    <PublicLoadingShell>
      <section
        aria-busy="true"
        aria-label="Loading blog"
        className="py-12 font-mono sm:py-16"
      >
        <Skeleton className="loading-step-1 mb-4 h-4 w-16 rounded-full" />
        <Skeleton className="loading-step-1 h-9 w-36 sm:h-12" />
        <div className="mt-6 max-w-2xl space-y-3">
          <Skeleton className="loading-step-2 h-4 w-full" />
          <Skeleton className="loading-step-3 h-4 w-10/12" />
        </div>
      </section>

      <section className="grid w-full gap-8 pb-16 font-mono lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="mb-4 flex items-center gap-2 border-b border-border py-3">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 min-w-0 flex-1" />
          </div>

          <div className="mb-5 border-b border-border pb-4">
            <Skeleton className="h-4 w-28 rounded-full" />
            <div className="mt-3 flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-7 w-20 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        <aside className="text-sm lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Skeleton className="h-5 w-28" />
          <div className="mt-3 grid gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <div className="divide-y divide-border/70">
            {[0, 1, 2].map((item) => (
              <div key={item} className="py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-3 w-14 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-6 w-9/12 max-w-lg" />
                <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
                <Skeleton className="mt-2 h-4 w-8/12 max-w-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLoadingShell>
  );
}

export function BlogPostLoading() {
  return (
    <PublicLoadingShell>
      <article
        aria-busy="true"
        aria-label="Loading article"
        className="w-full py-16 font-mono sm:py-20"
      >
        <Skeleton className="mb-8 h-7 w-24 rounded-md" />
        <div className="overflow-hidden rounded-lg border border-border/70 bg-background/55">
          <div className="code-window-header">
            <div className="code-window-tab is-active">
              <Skeleton className="size-3.5 rounded-sm" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <header className="border-b border-border bg-surface/35 px-5 py-5 sm:px-7">
            <Skeleton className="mb-4 h-3 w-32 rounded-full" />
            <Skeleton className="h-9 w-full max-w-2xl sm:h-10" />
            <Skeleton className="mt-3 h-9 w-9/12 max-w-xl sm:h-10" />
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-8/12 max-w-xl" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </header>
          <div className="px-5 py-6 sm:px-7 sm:py-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-7/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="mt-6 h-5 w-5/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          </div>
        </div>
      </article>
    </PublicLoadingShell>
  );
}
