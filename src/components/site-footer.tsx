import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-6 text-center text-sm text-muted">
      <p>
        © 2026 Built by Rashad with 💙. This site is{" "}
        <Link
          href="https://github.com/rashad-isayev/rashadisayev.dev"
          target="_blank"
          rel="noreferrer"
          className="rounded-sm text-foreground underline decoration-accent/45 underline-offset-4 transition hover:decoration-accent focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          open-source
        </Link>
        .
      </p>
    </footer>
  );
}
