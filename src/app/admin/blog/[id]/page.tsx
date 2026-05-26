import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getAdminBlogPost } from "@/lib/content";
import { deleteBlogPost, updateBlogPost } from "../../actions";
import { BlogPostForm } from "../../content-forms";

type EditBlogPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function EditBlogPostPage({
  params,
  searchParams,
}: EditBlogPostPageProps) {
  const configured = isAdminConfigured();
  const session = await getAdminSession();

  if (!configured || !session) {
    redirect("/admin/sign-in");
  }

  const { id } = await params;
  const query = await searchParams;
  const post = await getAdminBlogPost(id);

  return (
    <div className="font-mono">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="admin-link mb-4 inline-flex rounded-md px-2 py-1 text-sm text-muted hover:bg-soft/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {"< blogs()"}
        </Link>
        <p className="mb-3 text-sm text-muted">{post.slug}.md</p>
        <h1 className="text-3xl font-semibold tracking-normal">edit_blog()</h1>
      </div>

      {query?.saved ? (
        <div className="mb-5 rounded-md border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          Post updated.
        </div>
      ) : null}
      {query?.error ? (
        <div className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
          Check the required fields and unique slug.
        </div>
      ) : null}

      <BlogPostForm
        post={post}
        action={updateBlogPost.bind(null, post.id)}
        deleteAction={deleteBlogPost.bind(null, post.id)}
      />
    </div>
  );
}
