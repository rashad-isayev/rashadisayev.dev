export type FilterableBlogPost = {
  category?: string | null;
  createdAt?: Date;
  excerpt: string;
  publishedAt?: Date | null;
  slug: string;
  title: string;
};

export function filterBlogPosts<TPost extends FilterableBlogPost>(
  posts: TPost[],
  query: string,
  category: string,
  sort?: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const postCategory = post.category ?? "General";
    // Search uses the visible summary fields plus slug so copied URLs are discoverable.
    const matchesQuery = normalizedQuery
      ? [post.title, post.excerpt, post.slug, postCategory].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )
      : true;
    const matchesCategory =
      category === "all" || postCategory.toLowerCase() === category;

    return matchesQuery && matchesCategory;
  });

  if (!sort) {
    return filteredPosts;
  }

  return [...filteredPosts].sort((first, second) => {
    if (sort === "title") {
      return first.title.localeCompare(second.title);
    }

    const firstDate = first.publishedAt ?? first.createdAt ?? new Date(0);
    const secondDate = second.publishedAt ?? second.createdAt ?? new Date(0);

    // Prefer publish date, falling back to created date for unpublished/admin previews.
    return secondDate.getTime() - firstDate.getTime();
  });
}
