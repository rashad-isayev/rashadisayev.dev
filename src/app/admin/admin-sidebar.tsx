"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  FileText,
  Globe2,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAdmin } from "./actions";

type AdminSidebarProps = {
  isSignedIn: boolean;
};

const sidebarItems = [
  {
    href: "/admin/availability",
    label: "Work availability",
    icon: BriefcaseBusiness,
  },
  {
    href: "/admin/content",
    label: "Content system",
    icon: FileText,
  },
  {
    href: "/admin/security",
    label: "Access & security",
    icon: ShieldCheck,
  },
  {
    href: "/admin/site",
    label: "Site shell",
    icon: Globe2,
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
          className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition hover:bg-soft"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground text-xs font-semibold text-background">
            RI
          </span>
          <span className="truncate">Rashad Isayev</span>
        </Link>
        {isSignedIn ? (
          <form action={logoutAdmin}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              className="size-8"
            >
              <LogOut aria-hidden="true" className="size-4" />
            </Button>
          </form>
        ) : null}
      </div>

      <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm transition lg:min-w-0 ${
                active
                  ? "bg-accent-soft text-foreground"
                  : "text-muted hover:bg-soft hover:text-foreground"
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
