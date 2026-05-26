import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";

import { AmbientGlow } from "@/components/ambient-glow";
import { BlogStarButton } from "@/components/blog-star-button";
import { ConstructionStatus } from "@/components/construction-status";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BLOG_CATEGORIES, getPublishedBlogPosts } from "@/lib/content";
import { filterBlogPosts } from "@/lib/content-filters";
import { getPageConstructionStatus } from "@/lib/site-settings";
import { SITE_NAME, SITE_URL } from "@/constants/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles from Rashad Isayev about software, product thinking, learning, and durable work.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Articles about software, product thinking, learning, and durable work.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

type WritingPageProps = {
  searchParams?: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : "draft";
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  if (await getPageConstructionStatus("blog")) {
    return <ConstructionStatus />;
  }

  const params = await searchParams;
  const query = params?.q ?? "";
  const category =
    typeof params?.category === "string" &&
    BLOG_CATEGORIES.some(
      (item) => item.toLowerCase() === params.category?.toLowerCase(),
    )
      ? params.category.toLowerCase()
      : "all";
  const sort = params?.sort === "title" ? "title" : "date";
  const posts = await getPublishedBlogPosts();
  const filteredPosts = filterBlogPosts(posts, query, category, sort);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5 sm:px-8 sm:pt-8">
      <AmbientGlow className="ambient-glow-cosmos layer-reveal layer-backdrop absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="min-h-screen">
          <SiteHeader className="layer-reveal layer-nav" />

          <section className="py-12 font-mono sm:py-16">
            <p className="layer-reveal layer-copy mb-4 text-sm text-muted">
              $ grep
            </p>
            <h1 className="layer-reveal layer-heading text-3xl font-semibold leading-none text-balance sm:text-5xl">
              blogs
            </h1>
            <p className="layer-reveal layer-copy mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {"// you can find articles about several topics, including practical notes about software, product thinking, learning, and durable work"}
            </p>
          </section>

          <section className="layer-reveal layer-actions grid w-full gap-8 pb-16 font-mono lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <form
                action="/blog"
                className="mb-4 flex items-center gap-2 border-b border-border py-3"
              >
                <Search aria-hidden className="size-4 text-muted" />
                <span className="text-sm text-muted">$ grep</span>
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="// search posts"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                />
                {category !== "all" ? (
                  <input type="hidden" name="category" value={category} />
                ) : null}
                <input type="hidden" name="sort" value={sort} />
              </form>

              <div className="mb-5 border-b border-border pb-4 text-sm text-muted">
                <p>{"// categories"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={
                      query || sort !== "date"
                        ? `/blog?${new URLSearchParams({
                            ...(query ? { q: query } : {}),
                            ...(sort !== "date" ? { sort } : {}),
                          })}`
                        : "/blog"
                    }
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
                    const params = new URLSearchParams({
                      ...(query ? { q: query } : {}),
                      category: value,
                      ...(sort !== "date" ? { sort } : {}),
                    });

                    return (
                      <Link
                        key={item}
                        href={`/blog?${params}`}
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
              </div>

              {query || category !== "all" ? (
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span>{"// active_filters:"}</span>
                  {query ? (
                    <span className="text-foreground">
                      q=&quot;{query}&quot;
                    </span>
                  ) : null}
                  {category !== "all" ? (
                    <span className="text-foreground">
                      category=&quot;{category}&quot;
                    </span>
                  ) : null}
                  <Link
                    href="/blog"
                    className="admin-link rounded-md px-2 py-1 text-accent hover:bg-soft/70 focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    clear()
                  </Link>
                </div>
              ) : null}
            </div>

            <aside className="text-sm text-muted lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="space-y-8 lg:sticky lg:top-8">
                <div>
                  <h2 className="text-base text-foreground">### // sort</h2>
                  <div className="mt-3 grid gap-2">
                    <Link
                      href={
                        query || category !== "all"
                          ? `/blog?${new URLSearchParams({
                              ...(query ? { q: query } : {}),
                              ...(category !== "all" ? { category } : {}),
                            })}`
                          : "/blog"
                      }
                      className={`admin-link rounded-md border px-3 py-2 hover:bg-soft/70 focus-visible:ring-2 focus-visible:ring-accent/70 ${
                        sort === "date"
                          ? "border-border bg-surface text-foreground"
                          : "border-border/70"
                      }`}
                    >
                      sort.date(&quot;desc&quot;)
                    </Link>
                    <Link
                      href={`/blog?${new URLSearchParams({
                        ...(query ? { q: query } : {}),
                        ...(category !== "all" ? { category } : {}),
                        sort: "title",
                      })}`}
                      className={`admin-link rounded-md border px-3 py-2 hover:bg-soft/70 focus-visible:ring-2 focus-visible:ring-accent/70 ${
                        sort === "title"
                          ? "border-border bg-surface text-foreground"
                          : "border-border/70"
                      }`}
                    >
                      sort.title(&quot;a-z&quot;)
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              {filteredPosts.length > 0 ? (
                <div className="divide-y divide-border/70">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group flex flex-col gap-3 py-4 hover:bg-soft/35 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="admin-link min-w-0 flex-1 focus-visible:ring-2 focus-visible:ring-accent/70"
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span className="truncate group-hover:text-foreground">
                            {post.slug}.md
                          </span>
                          <span>{post.category ?? BLOG_CATEGORIES[0]}</span>
                          <time>{formatDate(post.publishedAt)}</time>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold leading-tight text-foreground">
                          {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                          {post.excerpt}
                        </p>
                      </Link>
                      <BlogStarButton
                        postId={post.id}
                        initialCount={post.starCount}
                        className="self-start sm:self-center"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-sm text-muted">
                  <p className="text-4xl">¯\_(ツ)_/¯</p>
                  <p className="mt-4">No results found</p>
                  <Link
                    href="/blog"
                    className="admin-link mt-3 inline-flex rounded-md px-2 py-1 text-accent hover:bg-soft/70 focus-visible:ring-2 focus-visible:ring-accent/70"
                  >
                    filter.reset()
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
