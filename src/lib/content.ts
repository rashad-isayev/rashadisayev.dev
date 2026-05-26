import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { ContentStatus, type ContentStatus as ContentStatusType } from "@/generated/prisma/enums";

const adminBlogPostListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  status: true,
  starCount: true,
  viewCount: true,
  publishedAt: true,
  updatedAt: true,
} as const;

// Public lists intentionally omit draft-only fields such as status and full content.
const publishedBlogPostListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  starCount: true,
  viewCount: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const CONTENT_STATUSES = [
  ContentStatus.DRAFT,
  ContentStatus.PUBLISHED,
  ContentStatus.ARCHIVED,
] as const;

export const BLOG_CATEGORIES = [
  "General",
  "Software",
  "Product",
  "Learning",
  "Career",
] as const;

export function toSlug(value: string) {
  // Keep slugs URL-safe and bounded so they are stable enough for public links.
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseSlug(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return toSlug(value);
}

export function parseContentStatus(value: FormDataEntryValue | null) {
  return CONTENT_STATUSES.includes(value as ContentStatusType)
    ? (value as ContentStatusType)
    : ContentStatus.DRAFT;
}

export function getPublishedAt(
  status: ContentStatusType,
  currentPublishedAt?: Date | null,
) {
  // Preserve the first publish timestamp across edits, but clear it when unpublished.
  return status === ContentStatus.PUBLISHED
    ? currentPublishedAt ?? new Date()
    : null;
}

export function getRequiredText(
  formData: FormData,
  key: string,
  maxLength: number,
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  // Empty or overlong values are treated the same so callers can use one error path.
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

export function parseBlogCategory(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return BLOG_CATEGORIES[0];
  }

  const category = BLOG_CATEGORIES.find((item) => item === value.trim());
  return category ?? BLOG_CATEGORIES[0];
}

export function splitTextBlocks(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export async function getAdminBlogPosts() {
  try {
    return await db.blogPost.findMany({
      select: adminBlogPostListSelect,
      orderBy: [{ updatedAt: "desc" }],
    });
  } catch {
    // Admin overview pages should render an empty state instead of crashing on transient DB issues.
    return [];
  }
}

export async function getAdminBlogPost(id: string) {
  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export async function getPublishedBlogPosts() {
  try {
    return await db.blogPost.findMany({
      select: publishedBlogPostListSelect,
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    // Public pages degrade to an empty list when content storage is unavailable.
    return [];
  }
}

export async function getPublishedBlogPost(id: string) {
  const post = await db.blogPost.findFirst({
    where: {
      id,
      status: ContentStatus.PUBLISHED,
    },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const post = await db.blogPost.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export async function getBlogPostSummary() {
  try {
    // Fetch dashboard counters and highlights together to keep the admin landing page fast.
    const [publishedCount, draftCount, archivedCount, topStarredPosts, latestUpdatedPost] =
      await Promise.all([
        db.blogPost.count({ where: { status: ContentStatus.PUBLISHED } }),
        db.blogPost.count({ where: { status: ContentStatus.DRAFT } }),
        db.blogPost.count({ where: { status: ContentStatus.ARCHIVED } }),
        db.blogPost.findMany({
          select: {
            id: true,
            slug: true,
            title: true,
            starCount: true,
            viewCount: true,
          },
          orderBy: [{ starCount: "desc" }, { viewCount: "desc" }, { updatedAt: "desc" }],
          take: 5,
        }),
        db.blogPost.findFirst({
          select: {
            title: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

    return {
      archivedCount,
      draftCount,
      latestUpdatedPost,
      publishedCount,
      topStarredPosts,
    };
  } catch {
    // Summary widgets are non-critical; default values keep the dashboard usable.
    return {
      archivedCount: 0,
      draftCount: 0,
      latestUpdatedPost: null,
      publishedCount: 0,
      topStarredPosts: [],
    };
  }
}
