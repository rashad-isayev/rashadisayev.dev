import Link from "next/link";

import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        // The header is sticky so navigation stays reachable while long pages scroll.
        "sticky top-0 z-10 -mx-4 px-4 py-4 text-sm sm:-mx-6 sm:px-6",
        className,
      )}
    >
      <div className="flex min-h-10 items-center justify-center">
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 rounded-full border border-border/60 bg-surface/35 p-1 text-muted shadow-sm backdrop-blur-2xl"
        >
          {/* Navigation is data-driven from constants/navigation.ts, so adding a route there updates the menu everywhere. */}
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 transition duration-200 ease-out hover:bg-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
