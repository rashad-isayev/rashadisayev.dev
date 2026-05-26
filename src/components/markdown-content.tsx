import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

function getCodeLanguage(className?: string) {
  return className?.match(/language-([\w-]+)/)?.[1];
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-document font-mono">
      <ReactMarkdown
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-anchor"],
              },
            },
          ],
        ]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ id, children }) => (
            <h1
              id={id}
              className="mt-10 text-3xl font-semibold tracking-normal first:mt-0"
            >
              {children}
            </h1>
          ),
          h2: ({ id, children }) =>
            id === "footnote-label" ? (
              <h2
                id={id}
                className="text-sm font-semibold uppercase tracking-normal text-muted"
              >
                {children}
              </h2>
            ) : (
              <h2
                id={id}
                className="mt-10 text-2xl font-semibold tracking-normal first:mt-0"
              >
                {children}
              </h2>
            ),
          h3: ({ id, children }) => (
            <h3 id={id} className="mt-8 text-xl font-semibold tracking-normal">
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4 id={id} className="mt-7 text-lg font-semibold tracking-normal">
              {children}
            </h4>
          ),
          h5: ({ id, children }) => (
            <h5 id={id} className="mt-6 text-base font-semibold tracking-normal">
              {children}
            </h5>
          ),
          h6: ({ id, children }) => (
            <h6
              id={id}
              className="mt-6 text-sm font-semibold uppercase tracking-normal text-muted"
            >
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mt-5 text-base leading-8 text-foreground/90">
              {children}
            </p>
          ),
          a: ({ href, children }) => {
            const isExternal =
              href?.startsWith("http://") || href?.startsWith("https://");

            if (!href) {
              return <span>{children}</span>;
            }

            return (
              <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="rounded-sm text-foreground underline decoration-accent/45 underline-offset-4 transition hover:decoration-accent focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                {children}
              </Link>
            );
          },
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2 pl-6 text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-6 text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-8">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-border pl-5 text-muted">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-8 border-0 border-t border-dashed border-border/90" />
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className);

            if (!isBlock) {
              return (
                <code className="rounded border border-border bg-soft px-1.5 py-0.5 text-sm text-accent">
                  {children}
                </code>
              );
            }

            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => {
            const codeChild = isValidElement<{
              className?: string;
              children?: ReactNode;
            }>(children)
              ? children
              : null;
            const language = getCodeLanguage(codeChild?.props.className);

            return (
              <div className="mt-6 overflow-hidden rounded-md border border-border bg-background/85">
                <div className="flex min-h-9 items-center border-b border-border bg-surface px-4 text-xs text-muted">
                  <span>{language ?? "text"}</span>
                </div>
                <pre className="overflow-x-auto p-4">
                  <code
                    className={`${codeChild?.props.className ?? ""} block whitespace-pre text-sm leading-7 text-foreground`}
                  >
                    {codeChild?.props.children ?? children}
                  </code>
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto rounded-md border border-border">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface px-3 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/70 px-3 py-2 text-muted">
              {children}
            </td>
          ),
          sup: ({ children }) => (
            <sup className="px-0.5 text-xs font-semibold text-accent">
              {children}
            </sup>
          ),
          section: ({ className, children, ...props }) => (
            <section
              {...props}
              className={`${className ?? ""} mt-10 border-t border-dashed border-border pt-6 text-sm text-muted`}
            >
              {children}
            </section>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
