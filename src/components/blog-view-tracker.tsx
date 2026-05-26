"use client";

import { useEffect } from "react";

type BlogViewTrackerProps = {
  postId: string;
};

export function BlogViewTracker({ postId }: BlogViewTrackerProps) {
  useEffect(() => {
    const controller = new AbortController();

    // Fire-and-forget analytics should never block article rendering.
    void fetch(`/api/blog/${postId}/view`, {
      method: "POST",
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [postId]);

  return null;
}
