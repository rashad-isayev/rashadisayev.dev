"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CircleDot,
  LayoutDashboard,
  FileText,
  LogOut,
  Newspaper,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAdmin } from "./actions";

type AdminSidebarProps = {
  isSignedIn: boolean;
};

const sidebarItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/availability",
    label: "Availability",
    icon: CircleDot,
  },
  {
    href: "/admin/content",
    label: "Content system",
    icon: FileText,
  },
  {
    href: "/admin/blog",
    label: "Blog posts",
    icon: Newspaper,
  },
];

export function AdminSidebar({ isSignedIn }: AdminSidebarProps) {
  // usePathname is a client hook, so this sidebar is a client component.
  // It lets the nav style the current route without waiting for server data.
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-border/70 bg-surface/55 p-3 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-2 py-2">
        <Link
          href="/"
          className="admin-link flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted hover:bg-soft/85 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">Back to homepage</span>
        </Link>
        {isSignedIn ? (
          <form action={logoutAdmin}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              className="size-8 hover:text-foreground"
            >
              <LogOut aria-hidden="true" className="size-4" />
            </Button>
          </form>
        ) : null}
      </div>

      <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-link flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:min-w-0 ${
                active
                  ? "bg-accent-soft text-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.035)]"
                  : "text-muted hover:bg-soft/85 hover:text-foreground"
              }`}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
