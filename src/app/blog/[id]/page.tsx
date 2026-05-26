import type { Metadata } from "next";
import Link from "next/link";
import { Code2 } from "lucide-react";

import { AmbientGlow } from "@/components/ambient-glow";
import { BlogStarButton } from "@/components/blog-star-button";
import { BlogViewTracker } from "@/components/blog-view-tracker";
import { MarkdownContent } from "@/components/markdown-content";
import { ConstructionStatus } from "@/components/construction-status";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedBlogPostBySlug } from "@/lib/content";
import { getPageConstructionStatus } from "@/lib/site-settings";
import { SITE_NAME, SITE_URL } from "@/constants/site";

type BlogPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedBlogPostBySlug(id);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (await getPageConstructionStatus("blog")) {
    return <ConstructionStatus />;
  }

  const { id } = await params;
  const post = await getPublishedBlogPostBySlug(id);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-5 sm:px-8 sm:pt-8">
      <BlogViewTracker postId={post.id} />
      <AmbientGlow className="ambient-glow-cosmos layer-reveal layer-backdrop absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="min-h-screen">
          <SiteHeader className="layer-reveal layer-nav" />

          <article className="w-full py-16 font-mono sm:py-20">
          <Link
            href="/blog"
            className="admin-link mb-8 inline-flex rounded-md px-2 py-1 text-sm text-muted hover:bg-soft/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {"< blogs()"}
          </Link>

          <div className="code-window layer-reveal layer-heading overflow-hidden rounded-lg border border-border/70 bg-background/55">
            <div className="code-window-header">
              <div className="code-window-tab is-active">
                <Code2 aria-hidden className="size-3.5" />
                <span className="truncate">{post.slug}.md</span>
              </div>
            </div>

            <header className="border-b border-border bg-surface/35 px-5 py-5 sm:px-7">
              <p className="mb-3 font-mono text-xs text-emerald-300/80">
                {"// published_article"}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 font-mono text-xs text-muted">
                  <span className="rounded-full border border-border bg-background/45 px-2.5 py-1">
                    {post.slug}.md
                  </span>
                  {post.publishedAt ? (
                    <span className="rounded-full border border-border bg-background/45 px-2.5 py-1">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(post.publishedAt)}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-border bg-background/45 px-2.5 py-1">
                    {post.viewCount} views
                  </span>
                </div>
                <BlogStarButton
                  postId={post.id}
                  initialCount={post.starCount}
                />
              </div>
            </header>

            <div className="markdown-document px-5 py-6 sm:px-7 sm:py-8">
              <MarkdownContent content={post.content} />
            </div>
          </div>
          </article>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
