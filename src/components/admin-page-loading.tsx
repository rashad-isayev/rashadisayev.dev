import { Skeleton } from "@/components/ui/skeleton";

function PageHeaderSkeleton({
  action,
  eyebrowWidth = "w-24",
  descriptionLines = 2,
}: {
  action?: boolean;
  eyebrowWidth?: string;
  descriptionLines?: 1 | 2;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        <Skeleton className={`mb-3 h-4 ${eyebrowWidth} rounded-full`} />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        {descriptionLines === 2 ? (
          <Skeleton className="mt-2 h-4 w-8/12 max-w-lg" />
        ) : null}
      </div>
      {action ? <Skeleton className="h-10 w-full rounded-md sm:w-36" /> : null}
    </div>
  );
}

function FieldSkeleton({ area = false }: { area?: boolean }) {
  return (
    <div>
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className={`mt-2 w-full rounded-md ${area ? "h-24" : "h-11"}`} />
    </div>
  );
}

function FormActionsSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Skeleton className="h-10 w-full rounded-md sm:w-28" />
      <Skeleton className="h-10 w-full rounded-md sm:w-24" />
    </div>
  );
}

export function AdminOverviewLoading() {
  return (
    <div aria-busy="true" aria-label="Loading admin page">
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
    </div>
  );
}

export function AdminBlogIndexLoading() {
  return (
    <div aria-busy="true" aria-label="Loading admin blog" className="font-mono">
      <PageHeaderSkeleton action eyebrowWidth="w-16" descriptionLines={1} />

      <div className="mb-4 flex items-center gap-2 border-b border-border py-3">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-14 rounded-full" />
        <Skeleton className="h-4 min-w-0 flex-1" />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-7 w-20 rounded-md" />
        ))}
      </div>

      <div className="border-y border-border/70">
        <div className="divide-y divide-border/70">
          {[0, 1, 2].map((item) => (
            <div key={item} className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="mt-3 h-3 w-20 rounded-full" />
                  <Skeleton className="mt-3 h-6 w-8/12 max-w-md" />
                  <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
                  <Skeleton className="mt-2 h-4 w-7/12 max-w-lg" />
                  <Skeleton className="mt-4 h-3 w-24 rounded-full" />
                </div>
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminContentSettingsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading content settings">
      <PageHeaderSkeleton eyebrowWidth="w-16" descriptionLines={2} />
      <div className="space-y-5">
        <div className="rounded-lg border border-border/70 bg-surface/60">
          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex items-start justify-between gap-4 rounded-md border border-border/80 bg-background/35 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-28" />
                  </div>
                  <Skeleton className="mt-1 size-4 rounded-sm" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md sm:w-44" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminBlogFormLoading({ editing = false }: { editing?: boolean }) {
  return (
    <div aria-busy="true" aria-label="Loading blog form" className="font-mono">
      <div className="mb-8">
        <Skeleton className="mb-4 h-7 w-24 rounded-md" />
        <Skeleton className="mb-3 h-4 w-28 rounded-full" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="space-y-5">
        <div className="rounded-lg border border-border/70 bg-surface/60">
          <div className="grid gap-5 p-5 sm:p-6">
            <FieldSkeleton />
            <FieldSkeleton area />
            <div>
              <Skeleton className="h-4 w-36 rounded-full" />
              <Skeleton className="mt-2 h-64 w-full rounded-md" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <FormActionsSkeleton />
          </div>
        </div>
        {editing ? (
          <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="mt-2 h-4 w-full max-w-sm" />
              </div>
              <Skeleton className="h-10 w-full rounded-md sm:w-24" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
