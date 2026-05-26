import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, FileText, PencilLine, Star } from "lucide-react";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getBlogPostSummary } from "@/lib/content";
import { getPageConstructionStatuses, getWorkAvailability } from "@/lib/site-settings";
import { PAGE_CONSTRUCTION_ITEMS } from "@/constants/page-construction";
import { Button } from "@/components/ui/button";

const numberFormatter = new Intl.NumberFormat("en");

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-surface/60 p-5">
      <div className="flex items-center gap-3 text-muted">
        <Icon aria-hidden className="size-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const [summary, availability, constructionStatuses] = await Promise.all([
    getBlogPostSummary(),
    getWorkAvailability(),
    getPageConstructionStatuses(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Quick platform state across content, availability, engagement, and
          page launch controls.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Published"
          value={numberFormatter.format(summary.publishedCount)}
        />
        <StatCard
          icon={PencilLine}
          label="Drafts"
          value={numberFormatter.format(summary.draftCount)}
        />
        <StatCard
          icon={BarChart3}
          label="Archived"
          value={numberFormatter.format(summary.archivedCount)}
        />
        <StatCard
          icon={Star}
          label="Top stars"
          value={numberFormatter.format(summary.topStarredPosts[0]?.starCount ?? 0)}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="rounded-lg border border-border/70 bg-surface/60 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-normal">
              Top content
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/blog">Manage</Link>
            </Button>
          </div>

          {summary.topStarredPosts.length > 0 ? (
            <div className="divide-y divide-border/70">
              {summary.topStarredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}`}
                  className="admin-link flex items-center justify-between gap-4 py-3 hover:bg-soft/35 focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{post.title}</span>
                    <span className="mt-1 block truncate text-xs text-muted">
                      {post.slug}.md
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {numberFormatter.format(post.starCount)} stars ·{" "}
                    {numberFormatter.format(post.viewCount)} views
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No content metrics yet.</p>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-border/70 bg-surface/60 p-5">
            <h2 className="text-lg font-semibold tracking-normal">
              Availability
            </h2>
            <p className="mt-3 text-sm text-muted">{availability.label}</p>
            <Button asChild className="mt-4" size="sm" variant="outline">
              <Link href="/admin/availability">Update</Link>
            </Button>
          </section>

          <section className="rounded-lg border border-border/70 bg-surface/60 p-5">
            <h2 className="text-lg font-semibold tracking-normal">
              Page states
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              {PAGE_CONSTRUCTION_ITEMS.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-muted">{item.label}</span>
                  <span>
                    {constructionStatuses[item.slug] ? "construction" : "live"}
                  </span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-4" size="sm" variant="outline">
              <Link href="/admin/content">Configure</Link>
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
