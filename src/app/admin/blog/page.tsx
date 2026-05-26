import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { BLOG_CATEGORIES, getAdminBlogPosts } from "@/lib/content";
import { filterBlogPosts } from "@/lib/content-filters";

type AdminBlogPageProps = {
  searchParams?: Promise<{
    category?: string;
    error?: string;
    q?: string;
    saved?: string;
  }>;
};

function getNotice(saved: string | undefined) {
  switch (saved) {
    case "created":
      return "Post created.";
    case "deleted":
      return "Post deleted.";
    default:
      return null;
  }
}

export default async function AdminBlogPage({
  searchParams,
}: AdminBlogPageProps) {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const params = await searchParams;
  const posts = await getAdminBlogPosts();
  const query = params?.q ?? "";
  const category =
    typeof params?.category === "string" &&
    BLOG_CATEGORIES.some(
      (item) => item.toLowerCase() === params.category?.toLowerCase(),
    )
      ? params.category.toLowerCase()
      : "all";
  const filteredPosts = filterBlogPosts(posts, query, category);
  const notice = getNotice(params?.saved);

  return (
    <div className="font-mono">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm text-muted">$ grep</p>
          <h1 className="text-3xl font-semibold tracking-normal">blogs</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {"// create, edit, publish, archive, or remove entries"}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="admin-link inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background shadow-sm hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus aria-hidden className="size-4" />
          new_blog()
        </Link>
      </div>

      {notice ? (
        <div className="mb-5 rounded-md border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}
      {params?.error ? (
        <div className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
          The post could not be updated.
        </div>
      ) : null}

      <form
        action="/admin/blog"
        className="mb-4 flex items-center gap-2 border-b border-border py-3 text-sm text-muted"
      >
        <Search aria-hidden className="size-4" />
        <span>$ grep</span>
        <input
          name="q"
          defaultValue={query}
          placeholder="// search admin posts"
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
        />
        {category !== "all" ? (
          <input type="hidden" name="category" value={category} />
        ) : null}
      </form>

      <div className="mb-5 flex flex-wrap gap-2 text-sm text-muted">
        <Link
          href={query ? `/admin/blog?q=${encodeURIComponent(query)}` : "/admin/blog"}
          className={`admin-link rounded-md border px-2.5 py-1 hover:bg-soft/80 focus-visible:ring-2 focus-visible:ring-accent/70 ${
            category === "all"
              ? "border-border bg-surface text-foreground"
              : "border-border/70"
          }`}
        >
          all
        </Link>
        {BLOG_CATEGORIES.map((item) => {
          const value = item.toLowerCase();
          const href = query
            ? `/admin/blog?q=${encodeURIComponent(query)}&category=${value}`
            : `/admin/blog?category=${value}`;

          return (
            <Link
              key={item}
              href={href}
              className={`admin-link rounded-md border px-2.5 py-1 hover:bg-soft/80 focus-visible:ring-2 focus-visible:ring-accent/70 ${
                category === value
                  ? "border-border bg-surface text-foreground"
                  : "border-border/70"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      <div className="border-y border-border/70">
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-border/70">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/blog/${post.id}`}
                className="admin-link block py-4 hover:bg-soft/35 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-inset"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-muted">
                      {post.slug}.md
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {post.category ?? BLOG_CATEGORIES[0]}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {post.excerpt}
                    </p>
                    <p className="mt-3 text-xs text-muted">
                      {"// updated "}
                      {post.updatedAt.toLocaleDateString("en")}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {post.starCount} stars · {post.viewCount} views
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background/45 px-2.5 py-1 text-xs text-muted">
                    {post.status.toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-5 text-sm text-muted">No blog posts yet.</div>
        )}
      </div>
    </div>
  );
}
