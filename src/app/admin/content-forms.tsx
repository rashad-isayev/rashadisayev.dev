import Link from "next/link";

import { BLOG_CATEGORIES, CONTENT_STATUSES } from "@/lib/content";
import type { BlogPostModel } from "@/generated/prisma/models/BlogPost";
import { BlogMarkdownEditor } from "./blog-markdown-editor";
import { AdminSubmitButton } from "./admin-submit-button";

type BlogPostFormProps = {
  post?: BlogPostModel;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`admin-input-wrap h-11 w-full rounded-md border border-border bg-background/50 px-3 text-foreground outline-none placeholder:text-muted focus:border-accent/80 focus:bg-background/70 ${
        props.className ?? ""
      }`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`admin-input-wrap min-h-32 w-full resize-y rounded-md border border-border bg-background/50 px-3 py-3 text-foreground outline-none placeholder:text-muted focus:border-accent/80 focus:bg-background/70 ${
        props.className ?? ""
      }`}
    />
  );
}

function StatusSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      name="status"
      defaultValue={defaultValue ?? "DRAFT"}
      className="admin-input-wrap h-11 w-full rounded-md border border-border bg-background/50 px-3 text-foreground outline-none focus:border-accent/80 focus:bg-background/70"
    >
      {CONTENT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

function BlogCategorySelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select
      name="category"
      defaultValue={
        BLOG_CATEGORIES.includes(defaultValue as (typeof BLOG_CATEGORIES)[number])
          ? defaultValue
          : BLOG_CATEGORIES[0]
      }
      className="admin-input-wrap h-11 w-full rounded-md border border-border bg-background/50 px-3 text-foreground outline-none focus:border-accent/80 focus:bg-background/70"
    >
      {BLOG_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}

export function BlogPostForm({
  post,
  action,
  deleteAction,
}: BlogPostFormProps) {
  return (
    <div className="space-y-5 font-mono [&_button]:font-mono [&_input]:font-mono [&_select]:font-mono [&_textarea]:font-mono">
      <form action={action} className="rounded-lg border border-border/70 bg-surface/60">
        <div className="grid gap-5 p-5 sm:p-6">
          <Field label="Title">
            <TextInput
              name="title"
              required
              maxLength={160}
              defaultValue={post?.title}
              placeholder="Designing useful interfaces"
            />
          </Field>

          <Field label="Slug">
            <TextInput
              name="slug"
              maxLength={80}
              defaultValue={post?.slug}
              placeholder="designing-useful-interfaces"
            />
          </Field>

          <Field label="Excerpt">
            <TextArea
              name="excerpt"
              required
              maxLength={320}
              defaultValue={post?.excerpt}
              placeholder="A short summary shown on the writing index."
              className="min-h-24"
            />
          </Field>

          <Field label="Markdown content">
            <BlogMarkdownEditor
              defaultValue={post?.content}
              filename={post?.slug ? `${post.slug}.md` : "untitled.md"}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <BlogCategorySelect defaultValue={post?.category} />
            </Field>
            <Field label="Status">
              <StatusSelect defaultValue={post?.status} />
            </Field>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AdminSubmitButton icon="save" pendingLabel="Saving post">
              Save post
            </AdminSubmitButton>
            <Link
              href="/admin/blog"
              className="admin-link inline-flex h-10 items-center justify-center rounded-md px-4 text-sm text-muted hover:bg-soft/85 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {deleteAction ? (
        <form action={deleteAction} className="rounded-lg border border-red-400/20 bg-red-400/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium">Delete post</h2>
              <p className="mt-1 text-sm text-muted">
                This removes the post from admin and public pages.
              </p>
            </div>
            <AdminSubmitButton
              icon="trash"
              pendingLabel="Deleting"
              className="bg-red-200 text-red-950 hover:bg-red-100"
            >
              Delete
            </AdminSubmitButton>
          </div>
        </form>
      ) : null}
    </div>
  );
}
