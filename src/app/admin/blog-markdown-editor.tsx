"use client";

import { useState } from "react";
import { Eye, Pencil, SquareCode } from "lucide-react";

import { MarkdownContent } from "@/components/markdown-content";

const editorModes = [
  { value: "edit", label: "Edit", icon: Pencil },
  { value: "preview", label: "Preview", icon: Eye },
] as const;

type BlogMarkdownEditorProps = {
  defaultValue?: string;
  filename?: string;
};

export function BlogMarkdownEditor({
  defaultValue = "",
  filename = "untitled.md",
}: BlogMarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="code-window overflow-hidden rounded-lg border border-border bg-background/55">
      <div className="code-window-header">
        <div className="flex min-w-0 flex-1 items-end self-stretch pt-1">
          <div className="code-window-tab is-active">
            <SquareCode aria-hidden className="size-3.5" />
            <span className="truncate">{filename}</span>
          </div>
        </div>
        <div
          role="tablist"
          aria-label="Markdown editor mode"
          className="ml-auto grid shrink-0 grid-cols-2 self-center rounded-md border border-border bg-background/70 p-0.5 shadow-sm"
        >
          {editorModes.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.value;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`blog-markdown-${item.value}`}
                onClick={() => setMode(item.value)}
                className={`admin-link inline-flex h-7 min-w-8 items-center justify-center gap-1.5 rounded px-2 text-xs transition sm:min-w-20 sm:px-3 ${
                  isActive
                    ? "bg-soft text-foreground shadow-[inset_0_0_0_1px_rgb(241_239_232_/_0.08)]"
                    : "text-muted hover:bg-soft/70 hover:text-foreground"
                }`}
              >
                <Icon aria-hidden className="size-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          id="blog-markdown-edit"
          name="content"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          rows={12}
          className="min-h-64 w-full resize-y border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 text-foreground outline-none placeholder:text-muted"
          placeholder={"# Page title\n\n## Section heading\n\n### Smaller heading\n\nWrite paragraphs with blank lines.\n\n---\n\n- Use lists\n- Add `inline code`\n\n```ts\nconsole.log(\"hello\");\n```\n\n| Feature | Status |\n| --- | --- |\n| Markdown | works |"}
        />
      ) : (
        <>
          <input type="hidden" name="content" value={value} />
          <div id="blog-markdown-preview" className="min-h-64 px-5 py-5">
            {value.trim() ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="font-mono text-sm text-muted">preview.empty()</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
