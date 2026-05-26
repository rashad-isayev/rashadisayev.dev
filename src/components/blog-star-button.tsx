"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Star } from "lucide-react";

type BlogStarButtonProps = {
  postId: string;
  initialCount: number;
  className?: string;
};

export function BlogStarButton({
  postId,
  initialCount,
  className = "",
}: BlogStarButtonProps) {
  const storageKey = useMemo(() => `blog-star:${postId}`, [postId]);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const starred = useSyncExternalStore(
    (onStoreChange) => {
      // Sync local star state across tabs and same-tab optimistic updates.
      function handleStorage(event: StorageEvent) {
        if (event.key === storageKey) {
          onStoreChange();
        }
      }

      window.addEventListener("storage", handleStorage);
      window.addEventListener("blog-star-change", onStoreChange);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("blog-star-change", onStoreChange);
      };
    },
    () => window.localStorage.getItem(storageKey) === "true",
    () => false,
  );

  async function toggleStar() {
    const nextStarred = !starred;
    const nextCount = Math.max(0, count + (nextStarred ? 1 : -1));

    // Update immediately for responsiveness, then reconcile with the server count.
    setCount(nextCount);
    setIsPending(true);
    setStoredStar(storageKey, nextStarred);

    try {
      const response = await fetch(`/api/blog/${postId}/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ starred: nextStarred }),
      });

      if (!response.ok) {
        throw new Error("Unable to update star");
      }

      const data = (await response.json()) as { starCount?: number };
      setCount(data.starCount ?? nextCount);
    } catch {
      // Roll back both visible count and persisted local state if the request fails.
      setCount(count);
      setStoredStar(storageKey, starred);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      aria-pressed={starred}
      aria-label={starred ? "Remove star from article" : "Star this article"}
      disabled={isPending}
      onClick={toggleStar}
      className={`cursor-pointer admin-link inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-sm transition focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-70 ${
        starred
          ? "border-amber-300/45 bg-amber-300/10 text-foreground shadow-[0_8px_22px_rgb(252_211_77_/_0.08)] hover:border-amber-300/55 hover:bg-amber-300/15"
          : "border-border/70 bg-surface/55 text-muted hover:border-amber-300/60 hover:bg-soft/80 hover:text-foreground"
      } ${className}`}
    >
      <Star
        aria-hidden
        className={`size-4 fill-current ${
          starred ? "text-amber-200" : "text-amber-300"
        }`}
      />
      <span className="font-mono text-base leading-none tabular-nums">
        {count}
      </span>
    </button>
  );
}

function setStoredStar(storageKey: string, starred: boolean) {
  if (starred) {
    window.localStorage.setItem(storageKey, "true");
  } else {
    window.localStorage.removeItem(storageKey);
  }

  window.dispatchEvent(new Event("blog-star-change"));
}
