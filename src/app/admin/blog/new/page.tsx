import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { createBlogPost } from "../../actions";
import { BlogPostForm } from "../../content-forms";

type NewBlogPostPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewBlogPostPage({
  searchParams,
}: NewBlogPostPageProps) {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const params = await searchParams;

  return (
    <div className="font-mono">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="admin-link mb-4 inline-flex rounded-md px-2 py-1 text-sm text-muted hover:bg-soft/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {"< blogs()"}
        </Link>
        <p className="mb-3 text-sm text-muted">blogs()</p>
        <h1 className="text-3xl font-semibold tracking-normal">new_blog()</h1>
      </div>

      {params?.error ? (
        <div className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
          Check the required fields and unique slug.
        </div>
      ) : null}

      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
