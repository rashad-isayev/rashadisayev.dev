import { describe, expect, it } from "vitest";

import { filterBlogPosts } from "@/lib/content-filters";
import { toSlug } from "@/lib/content";

describe("toSlug", () => {
  it("normalizes titles into stable URL slugs", () => {
    expect(toSlug(" Designing Useful Interfaces! ")).toBe(
      "designing-useful-interfaces",
    );
    expect(toSlug("What's new in Next.js?")).toBe("whats-new-in-next-js");
  });
});

describe("filterBlogPosts", () => {
  const posts = [
    {
      title: "Durable software notes",
      excerpt: "Build systems that last.",
      slug: "durable-software-notes",
      category: "Software",
      publishedAt: new Date("2026-05-20T00:00:00.000Z"),
      createdAt: new Date("2026-05-19T00:00:00.000Z"),
    },
    {
      title: "Learning in public",
      excerpt: "A practical learning loop.",
      slug: "learning-in-public",
      category: "Learning",
      publishedAt: new Date("2026-05-22T00:00:00.000Z"),
      createdAt: new Date("2026-05-21T00:00:00.000Z"),
    },
  ];

  it("filters by search text across title, excerpt, slug, and category", () => {
    expect(filterBlogPosts(posts, "software", "all", "date")).toHaveLength(1);
    expect(filterBlogPosts(posts, "learning loop", "all", "date")[0].slug).toBe(
      "learning-in-public",
    );
  });

  it("filters by category and sorts by title", () => {
    const result = filterBlogPosts(posts, "", "software", "title");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Durable software notes");
  });
});
