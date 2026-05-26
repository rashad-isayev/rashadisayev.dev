"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  assertAdminSession,
  assertSameOrigin,
  clearAdminSession,
  getRateLimitKey,
  isAdminConfigured,
  isLoginRateLimited,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { PAGE_CONSTRUCTION_ITEMS } from "@/constants/page-construction";
import {
  getPublishedAt,
  getRequiredText,
  parseBlogCategory,
  parseSlug,
  parseContentStatus,
  toSlug,
} from "@/lib/content";
import {
  setPageConstructionStatuses,
  setWorkAvailability,
  type PageConstructionStatuses,
} from "@/lib/site-settings";

function redirectToContentError(path: string, error: string): never {
  redirect(`${path}?error=${error}`);
}

function getBlogPostFormData(formData: FormData) {
  const title = getRequiredText(formData, "title", 160);
  const excerpt = getRequiredText(formData, "excerpt", 320);
  const content = getRequiredText(formData, "content", 20000);
  const category = parseBlogCategory(formData.get("category"));
  const status = parseContentStatus(formData.get("status"));
  // Editors may leave slug empty; in that case the title becomes the canonical source.
  const slug = parseSlug(formData.get("slug")) || (title ? toSlug(title) : "");

  return {
    category,
    content,
    excerpt,
    slug,
    status,
    title,
  };
}

export async function loginAdmin(formData: FormData) {
  // Server actions can be called directly by forms. Because they mutate auth state,
  // each action first checks that the request came from this same site.
  await assertSameOrigin();

  if (!isAdminConfigured()) {
    redirect("/admin/sign-in?error=not-configured");
  }

  // Rate limiting is keyed by the request context to slow repeated password guesses.
  const key = await getRateLimitKey();

  if (await isLoginRateLimited(key)) {
    redirect("/admin/sign-in?error=rate-limited");
  }

  const password = formData.get("password");
  const passwordIsValid =
    typeof password === "string" && (await verifyAdminPassword(password));

  if (passwordIsValid) {
    await resetLoginRateLimit(key);
    await setAdminSession();
    redirect("/admin/blog");
  }

  await recordFailedLoginAttempt(key);
  redirect("/admin/sign-in?error=invalid");
}

export async function logoutAdmin() {
  await assertSameOrigin();
  await clearAdminSession();
  redirect("/admin/sign-in");
}

export async function updateWorkAvailability(formData: FormData) {
  await assertSameOrigin();
  await assertAdminSession();

  const availability = formData.get("availability");

  if (availability !== "available" && availability !== "unavailable") {
    redirect("/admin/availability?error=invalid-availability");
  }

  try {
    await setWorkAvailability(availability === "available");
  } catch {
    redirect("/admin/availability?error=database");
  }

  // Both the homepage badge and admin form depend on this setting.
  revalidatePath("/");
  revalidatePath("/admin/availability");
  redirect("/admin/availability?saved=availability");
}

export async function updatePageConstructionStatuses(formData: FormData) {
  await assertSameOrigin();
  await assertAdminSession();

  const statuses = PAGE_CONSTRUCTION_ITEMS.reduce((nextStatuses, item) => {
    nextStatuses[item.slug] = formData.get(item.slug) === "on";
    return nextStatuses;
  }, {} as PageConstructionStatuses);

  try {
    await setPageConstructionStatuses(statuses);
  } catch {
    redirect("/admin/content?error=database");
  }

  for (const item of PAGE_CONSTRUCTION_ITEMS) {
    // Each public route reads its own construction flag at render time.
    revalidatePath(item.route);
  }

  revalidatePath("/admin/content");
  redirect("/admin/content?saved=construction");
}

export async function createBlogPost(formData: FormData) {
  await assertSameOrigin();
  await assertAdminSession();

  const { category, content, excerpt, slug, status, title } =
    getBlogPostFormData(formData);

  if (!title || !excerpt || !content) {
    redirectToContentError("/admin/blog/new", "invalid");
  }

  if (!slug) {
    redirectToContentError("/admin/blog/new", "invalid-slug");
  }

  try {
    await db.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        category,
        status,
        publishedAt: getPublishedAt(status),
      },
    });
  } catch {
    redirectToContentError("/admin/blog/new", "database");
  }

  // The post detail page is not public until a reader has a stable slug to request.
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog?saved=created");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await assertSameOrigin();
  await assertAdminSession();

  const existing = await db.blogPost.findUnique({
    where: { id },
    select: {
      publishedAt: true,
      slug: true,
    },
  });

  if (!existing) {
    redirect("/admin/blog?error=missing");
  }

  const { category, content, excerpt, slug, status, title } =
    getBlogPostFormData(formData);

  if (!title || !excerpt || !content) {
    redirectToContentError(`/admin/blog/${id}`, "invalid");
  }

  if (!slug) {
    redirectToContentError(`/admin/blog/${id}`, "invalid-slug");
  }

  try {
    await db.blogPost.update({
      where: { id },
      data: {
        slug,
        title,
        excerpt,
        content,
        category,
        status,
        publishedAt: getPublishedAt(status, existing.publishedAt),
      },
    });
  } catch {
    redirectToContentError(`/admin/blog/${id}`, "database");
  }

  // Revalidate both old and new public URLs because the slug may have changed.
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${id}?saved=updated`);
}

export async function deleteBlogPost(id: string) {
  await assertSameOrigin();
  await assertAdminSession();

  try {
    const deleted = await db.blogPost.delete({
      where: { id },
      select: {
        slug: true,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${deleted.slug}`);
    revalidatePath("/admin/blog");
  } catch {
    redirect("/admin/blog?error=database");
  }

  redirect("/admin/blog?saved=deleted");
}
