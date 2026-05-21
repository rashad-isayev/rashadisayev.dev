import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-md bg-linear-to-r from-soft via-surface to-soft",
        className,
      )}
    />
  );
}
